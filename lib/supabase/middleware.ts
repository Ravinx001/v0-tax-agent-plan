import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Check if Supabase env vars are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase not configured - skip auth checks but still protect routes
    const protectedPaths = ['/protected', '/chat']
    const isProtectedPath = protectedPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    )

    if (isProtectedPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }

  try {
    // Get session from cookies (fast path)
    const sessionToken = request.cookies.get('sb-auth-token')?.value

    if (!sessionToken) {
      // No session cookie - check if route is protected
      const protectedPaths = ['/protected', '/chat']
      const isProtectedPath = protectedPaths.some(path => 
        request.nextUrl.pathname.startsWith(path)
      )

      if (isProtectedPath) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
      }

      return supabaseResponse
    }

    // Try to validate from cache first (Redis)
    let isValid = false
    try {
      const cachedSession = await Promise.race([
        redis.get(`session:${sessionToken}`),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Cache timeout')), 2000)
        ),
      ]) as string | null

      if (cachedSession === 'valid') {
        isValid = true
      }
    } catch {
      // Cache check failed or timed out - fall through to Supabase check
    }

    // If not in cache, validate with Supabase (with timeout)
    if (!isValid) {
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value),
              )
              supabaseResponse = NextResponse.next({
                request,
              })
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options),
              )
            },
          },
        },
      )

      // Use Promise.race to enforce a 5-second timeout on auth check
      const authPromise = supabase.auth.getUser()
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Auth timeout')), 5000)
      )

      const {
        data: { user },
      } = (await Promise.race([authPromise, timeoutPromise])) as any

      if (!user) {
        // Invalid session
        const protectedPaths = ['/protected', '/chat']
        const isProtectedPath = protectedPaths.some(path => 
          request.nextUrl.pathname.startsWith(path)
        )

        if (isProtectedPath) {
          const url = request.nextUrl.clone()
          url.pathname = '/auth/login'
          return NextResponse.redirect(url)
        }
      } else {
        // Cache valid session for 5 minutes
        try {
          await redis.setex(`session:${sessionToken}`, 300, 'valid')
        } catch {
          // Cache write failed - continue anyway
        }
      }
    }
  } catch (error) {
    // On any error (including timeout), continue - don't block the request
    console.error('[Middleware Error]', error)
  }

  return supabaseResponse
}
