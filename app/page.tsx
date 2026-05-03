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
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
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
          <Button asChild>
            <a
              href="https://slack.com/oauth/v2/authorize"
              target="_blank"
              rel="noopener noreferrer"
            >
              Add to Slack
            </a>
          </Button>
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
            Just ask TaxBot in Slack and get instant answers.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2" asChild>
              <a
                href="https://slack.com/oauth/v2/authorize"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                </svg>
                Add to Slack
              </a>
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
              Get started in under a minute. No signup required beyond adding to
              Slack.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Add to Slack
              </h3>
              <p className="text-sm text-muted-foreground">
                Click the button above to add TaxBot to your Slack workspace.
                Takes just a few seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                @mention TaxBot
              </h3>
              <p className="text-sm text-muted-foreground">
                In any channel or DM, mention @TaxBot and describe the vehicle
                you want to import.
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
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Ready to calculate your import costs?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Add TaxBot to your Slack workspace and get instant tax estimates for
            any vehicle.
          </p>
          <Button size="lg" className="gap-2" asChild>
            <a
              href="https://slack.com/oauth/v2/authorize"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
              </svg>
              Add TaxBot to Slack
            </a>
          </Button>
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
