import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[TaxBot] Missing Supabase env vars:', { 
      url: !!supabaseUrl, 
      key: !!supabaseAnonKey 
    })
    throw new Error(
      'Supabase not configured. Please check environment variables.'
    )
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return client
}
