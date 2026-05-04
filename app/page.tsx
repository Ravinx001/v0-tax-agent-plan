"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calculator,
  MessageSquare,
  Zap,
  BarChart3,
  Car,
  FileText,
  Smartphone,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "sonner";

const COMING_SOON = "Will be Available Soon";

function showComingSoon() {
  toast(COMING_SOON);
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" richColors closeButton />
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Calculator className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              TaxBot LK
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </a>
            <a
              href="#rates"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Tax Rates
            </a>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <Button size="sm" className="gap-2" asChild>
              <Link href="/chat">
                <Globe className="h-4 w-4" />
                Chat on Web
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              type="button"
              className="hidden gap-2 sm:inline-flex"
              onClick={showComingSoon}
            >
              Add to Slack
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
            <span>2025 Gazette Rates</span>
            <span className="text-primary">Updated</span>
          </div>
          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Calculate Sri Lankan vehicle import taxes instantly
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Get accurate estimates for customs duty, excise duty, VAT, and more.
            Chat with TaxBot on the web, Slack, or WhatsApp and get instant answers.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/chat">
                <Globe className="h-5 w-5" />
                Chat on Web
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              type="button"
              className="gap-2"
              onClick={showComingSoon}
            >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                </svg>
                Add to Slack
            </Button>
            <Button
              size="lg"
              variant="secondary"
              type="button"
              className="gap-2"
              onClick={showComingSoon}
            >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#how-it-works">Learn more</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Everything you need to estimate import costs
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              TaxBot calculates all applicable duties and taxes based on the
              latest Sri Lankan customs regulations.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  Complete Tax Breakdown
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get detailed calculations for customs duty, excise duty, VAT,
                  PAL, and SSL in one response.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  Fuel Type Comparison
                </h3>
                <p className="text-sm text-muted-foreground">
                  Compare taxes across petrol, diesel, hybrid, and electric
                  options to find savings.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  All Vehicle Types
                </h3>
                <p className="text-sm text-muted-foreground">
                  Works with cars, SUVs, vans, and commercial vehicles. New and
                  used imports supported.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  Instant Responses
                </h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered chat provides immediate answers without waiting for
                  manual calculations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  2025 Gazette Rates
                </h3>
                <p className="text-sm text-muted-foreground">
                  Calculations based on the latest published customs duty and
                  excise rates.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  Natural Conversation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Just describe your vehicle naturally. No forms to fill or
                  complex interfaces.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  Multi-Platform Access
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use Slack from your workspace or WhatsApp from your phone.
                  Same AI, wherever you are.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="border-t border-border bg-secondary/30 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              How it works
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Get started in under a minute. Use the web chat, Slack, or WhatsApp.
            </p>
          </div>

          {/* Platform Tabs */}
          <div className="mb-12 flex justify-center">
            <div className="inline-flex rounded-lg bg-secondary p-1">
              <span className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Web
              </span>
              <span className="px-4 py-2 text-sm font-medium text-muted-foreground">
                Slack
              </span>
              <span className="px-4 py-2 text-sm font-medium text-muted-foreground">
                WhatsApp
              </span>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Connect
              </h3>
              <p className="text-sm text-muted-foreground">
                Sign up for web chat, add TaxBot to Slack, or message our WhatsApp number.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Describe Your Vehicle
              </h3>
              <p className="text-sm text-muted-foreground">
                Tell us the CIF value, engine size, fuel type, and year. We will ask if anything is missing.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Get Your Estimate
              </h3>
              <p className="text-sm text-muted-foreground">
                Receive a detailed tax breakdown instantly. Ask follow-up
                questions or compare options.
              </p>
            </div>
          </div>

          {/* Example conversation */}
          <div className="mt-16">
            <Card className="mx-auto max-w-2xl border-border bg-card">
              <CardContent className="p-6">
                <p className="mb-4 text-sm font-medium text-muted-foreground">
                  Example conversation
                </p>
                <div className="space-y-4">
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold text-primary">
                        @TaxBot
                      </span>{" "}
                      How much tax for a 2023 Toyota Prius hybrid, CIF value 4
                      million LKR?
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-3">
                    <p className="mb-2 text-sm font-semibold text-primary">
                      TaxBot LK
                    </p>
                    <p className="text-sm text-foreground">
                      For a 2023 Toyota Prius (hybrid petrol, ~1800cc):
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>Customs Duty: LKR 800,000 (20%)</li>
                      <li>Excise Duty: LKR 2,640,000 (55%)</li>
                      <li>VAT: LKR 1,339,200 (18%)</li>
                      <li>PAL + SSL: LKR 385,980</li>
                    </ul>
                    <p className="mt-3 text-sm font-semibold text-foreground">
                      Total Tax: LKR 5,165,180
                    </p>
                    <p className="text-sm text-foreground">
                      Total Landed Cost: LKR 9,165,180
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tax Rates Section */}
      <section id="rates" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Current tax rates at a glance
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Based on 2025 Gazette notifications. Ask TaxBot for detailed rate
              lookups.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-card-foreground">
                  Customs Duty Rates
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Petrol / Diesel
                    </span>
                    <span className="font-medium text-foreground">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hybrid</span>
                    <span className="font-medium text-foreground">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plugin Hybrid</span>
                    <span className="font-medium text-foreground">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Electric</span>
                    <span className="font-medium text-primary">0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-card-foreground">
                  Other Taxes
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VAT</span>
                    <span className="font-medium text-foreground">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Port & Airport Levy
                    </span>
                    <span className="font-medium text-foreground">5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Social Security Levy
                    </span>
                    <span className="font-medium text-foreground">2.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Excise Duty (varies)
                    </span>
                    <span className="font-medium text-foreground">
                      10-250%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-primary/5 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Ready to calculate your import costs?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Chat with TaxBot on your preferred platform and get instant tax estimates for any vehicle.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/chat">
                <Globe className="h-5 w-5" />
                Chat on Web
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              type="button"
              className="gap-2"
              onClick={showComingSoon}
            >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                </svg>
                Add to Slack
            </Button>
            <Button
              size="lg"
              variant="secondary"
              type="button"
              className="gap-2"
              onClick={showComingSoon}
            >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <Calculator className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">
                TaxBot LK
              </span>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Estimates are for informational purposes only. Consult a licensed
              customs agent for official calculations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
