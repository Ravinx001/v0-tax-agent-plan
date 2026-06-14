<div align="center">

# 🚗 TaxBot LK

### AI-Powered Sri Lankan Vehicle Import Tax Assistant

**Next.js 16 · Gemini · Deterministic Tax Engine · Supabase Auth · Slack & WhatsApp Adapters**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Auth-Supabase-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

![GitHub repo size](https://img.shields.io/github/repo-size/Ravinx001/v0-tax-agent-plan?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/Ravinx001/v0-tax-agent-plan?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/Ravinx001/v0-tax-agent-plan?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/Ravinx001/v0-tax-agent-plan?style=for-the-badge)

### [🌐 Open the Live Demo](https://v0-taxbotlk.vercel.app/)

</div>

---

## 🎯 Project Overview

**TaxBot LK** is a conversational vehicle import tax estimator focused on Sri Lanka. Users describe a vehicle in natural language, and the application combines Google Gemini with a deterministic TypeScript tax engine to produce a structured estimate for:

- Customs duty
- Excise duty
- Value Added Tax (VAT)
- Port and Airport Development Levy (PAL)
- Social Security Contribution Levy (SSCL/SSL)
- Total estimated tax and landed cost

The main product is an authenticated web chat. The repository also contains server-side adapters and webhook routes for Slack and WhatsApp.

> [!IMPORTANT]
> This project provides estimates for educational and planning purposes. Its rate table is a manually maintained `2025-Q1-v1` snapshot, not a live Sri Lanka Customs tariff service. Customs valuation, gazette changes, exemptions, surcharges, exchange rates, and vehicle-specific rules can change the final amount. Consult Sri Lanka Customs or a licensed customs agent before making a financial decision.

---

## ✨ Key Features

### 🤖 Gemini-Powered Conversation

- Streams responses through the Vercel AI SDK
- Uses `gemini-2.5-flash` by default
- Supports multi-step tool calling with a maximum of five model/tool steps
- Renders Markdown, tables, lists, code, and links in assistant messages

### 🧮 Deterministic Tax Calculations

- Keeps numeric calculations outside the language model
- Validates tool input with Zod
- Returns a full tax breakdown, effective rate, warnings, and landed cost
- Supports petrol, diesel, electric, plug-in hybrid, petrol hybrid, and diesel hybrid vehicles

### 📊 Fuel-Type Comparison

- Compares all supported fuel types using the same vehicle assumptions
- Calculates savings or additional cost relative to petrol
- Displays comparison results in responsive structured cards

### 🔐 Authenticated Web Chat

- Email/password sign-up and login through Supabase
- Email confirmation callback flow
- Middleware protection for the `/chat` route
- Logout and session refresh support

### 🚦 Daily Usage Controls

- Optional Upstash/Vercel KV-backed web-chat rate limiting
- Default limit: **20 messages per authenticated user per UTC day**
- Remaining quota is shown in the chat interface and response headers
- Rate limiting is disabled gracefully when KV is not configured

### 💬 Multi-Platform Bot Backend

- Slack adapter with a ready-to-customize app manifest
- WhatsApp Cloud API adapter and verification endpoint
- Redis-backed conversation state when configured
- In-memory state fallback for local or single-instance development

> [!NOTE]
> Slack and WhatsApp backend integrations are present, but their landing-page buttons currently show **“Will be Available Soon”**. Web chat is the exposed user flow in the current UI.

### 🌍 Curated Import-Market Context

- Includes a manually reviewed Sri Lankan vehicle import market snapshot
- Covers common vehicle segments, representative models, discussion points, and source links
- Clearly labels the snapshot as contextual rather than official statistics

---

## 🚀 Quick Start

```mermaid
flowchart LR
    A[Clone repository] --> B[Install dependencies]
    B --> C[Configure Supabase]
    C --> D[Add Gemini API key]
    D --> E[Optional KV and chat adapters]
    E --> F[Run development server]
    F --> G[Open localhost:3000]
```

### Prerequisites

- **Node.js 20.9.0 or newer**
- **pnpm** or **npm**
- A **Supabase** project
- A **Google AI Studio / Gemini API key**
- Optional: Upstash Redis or Vercel KV for rate limiting and persistent bot state

### 1. Clone the Repository

```bash
git clone https://github.com/Ravinx001/v0-tax-agent-plan.git
cd v0-tax-agent-plan
```

### 2. Install Dependencies

The examples below use pnpm because the repository includes `pnpm-lock.yaml`.

```bash
pnpm install
```

Using npm is also supported:

```bash
npm install
```

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Required: Supabase authentication
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required: Gemini (either key name is accepted)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
# GEMINI_API_KEY=your_gemini_api_key

# Optional: override the default Gemini model
GOOGLE_GENERATIVE_AI_MODEL=gemini-2.5-flash

# Optional: local Supabase email-confirmation redirect
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# Optional: web-chat daily rate limiting
KV_REST_API_URL=https://your-upstash-endpoint
KV_REST_API_TOKEN=your_upstash_token

# Optional: Slack adapter
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_SIGNING_SECRET=your_slack_signing_secret

# Optional: WhatsApp Cloud API adapter
WHATSAPP_ACCESS_TOKEN=your_meta_access_token
WHATSAPP_APP_SECRET=your_meta_app_secret
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_webhook_verify_token

# Optional: persistent Chat SDK state
REDIS_URL=redis://your-redis-connection
```

Do not commit `.env.local`. Environment files are already ignored by Git.

### 4. Configure Supabase Auth

1. Create a Supabase project.
2. Enable email/password authentication.
3. Add `http://localhost:3000/auth/callback` to the allowed redirect URLs.
4. Add the production callback URL after deployment, for example `https://your-domain.com/auth/callback`.
5. Copy the project URL and anon key into `.env.local`.

### 5. Start the App

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, confirm the email if required by your Supabase settings, and sign in to use the chat.

---

## 🧠 System Architecture

```mermaid
flowchart TB
    subgraph CLIENTS[Client Channels]
        WEB[Next.js Web Chat]
        SLACK[Slack]
        WA[WhatsApp]
    end

    subgraph NEXT[Next.js Application]
        MW[Supabase Session Middleware]
        CHATAPI["/api/chat"]
        WEBHOOK["/api/webhooks/:platform"]
        BOT[Chat SDK Bot]
    end

    subgraph AI[AI Orchestration]
        GEMINI[Google Gemini]
        TOOLS[AI SDK Tools]
    end

    subgraph DOMAIN[Deterministic Domain Layer]
        ENGINE[Vehicle Tax Engine]
        RATES["2025-Q1-v1 Rate Tables"]
        MARKET[Curated Market Snapshot]
    end

    subgraph SERVICES[External Services]
        AUTH[Supabase Auth]
        KV["Upstash / Vercel KV"]
        REDIS[Redis Bot State]
        ANALYTICS[Vercel Analytics]
    end

    WEB --> MW --> AUTH
    WEB --> CHATAPI
    CHATAPI --> KV
    CHATAPI --> GEMINI
    SLACK --> WEBHOOK
    WA --> WEBHOOK
    WEBHOOK --> BOT
    BOT --> REDIS
    BOT --> GEMINI
    GEMINI --> TOOLS
    TOOLS --> ENGINE
    ENGINE --> RATES
    TOOLS --> MARKET
    WEB --> ANALYTICS
```

### Web Chat Request Flow

1. Supabase middleware checks the session before allowing access to `/chat`.
2. The browser sends the conversation to `POST /api/chat`.
3. The API verifies the authenticated user and increments the optional daily KV counter.
4. Gemini receives the system prompt, chat history, and registered tax tools.
5. Tool calls execute deterministic TypeScript functions for all numeric results.
6. The response streams back to the UI, where text and structured calculation cards are rendered separately.

---

## 🛠️ AI Tooling

| Tool | Purpose |
|------|---------|
| `calculate_vehicle_tax` | Calculates the complete tax breakdown for one vehicle |
| `compare_fuel_types` | Compares all supported fuel types using shared assumptions |
| `lookup_excise_rate` | Returns CC-based or battery-based excise bands |
| `list_supported_fuel_types` | Lists accepted fuel/powertrain values |
| `get_sri_lanka_import_context` | Returns curated import-market context and source links |

The model is instructed to use tools for tax numbers instead of inventing or manually estimating them.

---

## 🧮 Tax Calculation Model

The current engine calculates each component in this order:

| Component | Implemented Formula |
|-----------|---------------------|
| Customs duty | `CIF × customs rate` |
| Excise duty | `(CIF + customs duty) × excise rate` |
| VAT | `(CIF + customs duty + excise duty) × 18%` |
| PAL | `CIF × 5%` |
| SSL | `(CIF + customs duty + excise duty + VAT) × 2.5%` |
| Total tax | Sum of customs, excise, VAT, PAL, SSL, and surcharge |
| Landed cost | `CIF + total tax` |

All component values are rounded to the nearest LKR before totals are calculated.

### Embedded Base Rates

| Fuel Type | Customs Duty | Excise Basis |
|-----------|--------------|--------------|
| Petrol | 30% | 50%–250% by engine CC |
| Diesel | 30% | 60%–225% by engine CC |
| Petrol hybrid | 20% | 25%–110% by engine CC |
| Diesel hybrid | 20% | 35%–95% by engine CC |
| Plug-in hybrid | 15% | 20%–30% by battery capacity |
| Electric | 0% | 10%–20% by battery capacity |

### Supported Fuel Values

```text
petrol
diesel
electric
plugin_hybrid
hybrid_petrol
hybrid_diesel
```

### Validation and Warnings

- CIF must be greater than zero.
- Engine capacity cannot be negative.
- Battery capacity is optional, but missing EV/PHEV capacity triggers a warning and uses the smallest configured battery tier.
- Used vehicles older than seven years trigger an import-restriction warning.
- A future manufacture year triggers an accuracy warning.
- The repository defines used-vehicle depreciation reference data, but the current calculator does **not** apply depreciation to the tax calculation.

---

## 📡 Routes and Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET | Public landing page and rate overview |
| `/chat` | GET | Protected authenticated chat interface |
| `/auth/login` | GET | Email/password login |
| `/auth/sign-up` | GET | Account creation |
| `/auth/callback` | GET | Supabase email confirmation/session exchange |
| `/api/chat` | POST | Authenticated streaming Gemini chat endpoint |
| `/api/chat` | GET | Returns the authenticated user's remaining daily quota |
| `/api/webhooks/slack` | POST | Slack Chat SDK webhook |
| `/api/webhooks/whatsapp` | GET/POST | WhatsApp verification and event webhook |

`POST /api/chat` returns these quota headers when a request is accepted:

```text
X-RateLimit-Remaining
X-RateLimit-Limit
X-RateLimit-Reset
```

---

## 💬 Slack Setup

The repository includes [`slack-manifest.yaml`](slack-manifest.yaml).

1. Deploy the application to a public HTTPS URL.
2. Replace `YOUR_DOMAIN` in `slack-manifest.yaml` with the deployment hostname.
3. Create a Slack app from the manifest at [api.slack.com/apps](https://api.slack.com/apps).
4. Install the app to the workspace.
5. Add `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET` to the deployment environment.
6. Point Slack events and interactivity to:

```text
https://your-domain.com/api/webhooks/slack
```

The manifest subscribes to app mentions, channel/group/DM messages, and reaction events.

---

## 📱 WhatsApp Setup

1. Create a WhatsApp Cloud API app in the Meta developer console.
2. Add the four `WHATSAPP_*` environment variables.
3. Configure the callback URL:

```text
https://your-domain.com/api/webhooks/whatsapp
```

4. Use the same value for the Meta verification token and `WHATSAPP_VERIFY_TOKEN`.
5. Subscribe the Meta app to the required WhatsApp message events.

WhatsApp responses use a shorter mobile-specific system prompt with plain-text sections instead of Markdown tables.

---

## ⚙️ Environment Variable Reference

| Variable | Required | Used By |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Browser, server auth, middleware |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Browser, server auth, middleware |
| `GOOGLE_GENERATIVE_AI_API_KEY` or `GEMINI_API_KEY` | Yes | Gemini web chat and bots |
| `GOOGLE_GENERATIVE_AI_MODEL` | No | Overrides `gemini-2.5-flash` |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | No | Development sign-up callback |
| `KV_REST_API_URL` | No | Web-chat rate limiting and optional bot state detection |
| `KV_REST_API_TOKEN` | No | Web-chat rate limiting and optional bot state detection |
| `REDIS_URL` | No | Persistent Chat SDK bot state |
| `SLACK_BOT_TOKEN` | For Slack | Slack adapter |
| `SLACK_SIGNING_SECRET` | For Slack | Slack request verification |
| `WHATSAPP_ACCESS_TOKEN` | For WhatsApp | WhatsApp adapter |
| `WHATSAPP_APP_SECRET` | For WhatsApp | WhatsApp adapter |
| `WHATSAPP_PHONE_NUMBER_ID` | For WhatsApp | WhatsApp sending identity |
| `WHATSAPP_VERIFY_TOKEN` | For WhatsApp | Meta webhook verification |

---

## 📁 Project Structure

```text
v0-tax-agent-plan/
├── app/
│   ├── api/
│   │   ├── chat/route.ts                 # Authenticated streaming web chat
│   │   └── webhooks/[platform]/route.ts  # Slack and WhatsApp webhooks
│   ├── auth/                             # Login, sign-up, callback, error pages
│   ├── chat/page.tsx                     # Protected chat experience
│   ├── layout.tsx                        # Metadata, fonts, Vercel Analytics
│   └── page.tsx                          # Public landing page
├── components/
│   ├── chat/                             # Markdown and tax-result rendering
│   └── ui/                               # shadcn/ui component library
├── hooks/                                # Shared responsive/toast hooks
├── lib/
│   ├── data/sl-import-market.ts          # Curated market snapshot
│   ├── supabase/                         # Browser, server, middleware clients
│   ├── tax-engine/                       # Types, rates, formulas, exports
│   ├── bot.ts                            # Slack/WhatsApp Chat SDK bot
│   ├── gemini.ts                         # Gemini provider configuration
│   ├── prompts.ts                        # Web and WhatsApp system prompts
│   ├── rate-limit.ts                     # Optional daily KV quota
│   └── tools.ts                          # AI SDK tool definitions
├── middleware.ts                         # Supabase session middleware entry
├── slack-manifest.yaml                   # Slack application manifest
├── vercel.json                           # Webhook function timeout
└── package.json                          # Scripts and dependencies
```

---

## 🧰 Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Run the production server |
| `pnpm lint` | Intended ESLint check; currently requires adding ESLint and a project configuration |

Equivalent `npm run <script>` commands are available.

---

## 🚢 Deployment

### Vercel

1. Import the GitHub repository into Vercel.
2. Add the required Supabase and Gemini environment variables.
3. Add optional KV, Slack, WhatsApp, and Redis variables as needed.
4. Add the deployed callback URL to Supabase Auth redirect URLs.
5. Update external webhook URLs after the first deployment.

The repository's `vercel.json` gives the dynamic webhook function a maximum duration of 60 seconds. Vercel Analytics is enabled only in production.

### Other Node.js Hosts

Any host that supports Node.js 20.9+ and Next.js server functions can run the web application:

```bash
pnpm build
pnpm start
```

Slack and WhatsApp require a stable public HTTPS webhook URL.

---

## ⚠️ Current Limitations

- Tax rates and exchange-rate guidance are static and require manual review when policy changes.
- No specific gazette document number is encoded alongside the rate table.
- Used-vehicle depreciation data exists but is not applied by the calculator.
- The web quota resets at midnight UTC and is enforced only when KV credentials are present.
- Rate-limit storage failures are fail-open, so requests continue if KV is unavailable.
- In-memory bot state is not suitable for multi-instance or serverless production deployments.
- Slack and WhatsApp setup is backend-ready, but the public landing-page actions are still marked coming soon.
- The repository currently has no automated test suite.
- The declared lint script currently fails because ESLint is not installed or configured.
- TypeScript build errors are currently ignored by `next.config.mjs`; run an explicit type check before production releases.

---

## 🗺️ Roadmap

- [ ] Add unit tests for every tax band and formula
- [ ] Add integration tests for auth, rate limiting, and streaming tool calls
- [ ] Link each rate revision to an exact official gazette/customs source
- [ ] Apply or remove the unused depreciation schedule after policy validation
- [ ] Add live, source-attributed exchange rates
- [ ] Complete public Slack and WhatsApp onboarding flows
- [ ] Store web-chat history for authenticated users
- [ ] Add an admin workflow for reviewing and publishing rate updates

---

## 🤝 Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Make focused changes and run the relevant checks.
4. Commit with a clear message.
5. Push the branch and open a pull request.

Tax-rate changes should include an official source, effective date, and tests covering every affected bracket.

---

## 📄 License

This repository does not currently include a license file. Without an explicit license, reuse, modification, and redistribution rights are not granted by default. Add a `LICENSE` file before distributing the project as open source.

---

## 🔗 Links

- **Live application:** [v0-taxbotlk.vercel.app](https://v0-taxbotlk.vercel.app/)
- **GitHub repository:** [Ravinx001/v0-tax-agent-plan](https://github.com/Ravinx001/v0-tax-agent-plan)
- **Issues:** [Report a bug or request a feature](https://github.com/Ravinx001/v0-tax-agent-plan/issues)
- **v0 project:** [Continue in v0](https://v0.app/chat/projects/prj_xpmaQcSrpQLHNpGHkS1SXmmZ0fyL/)

---

<div align="center">

### Built for clearer Sri Lankan vehicle import cost planning

**Estimate carefully. Verify officially. Import confidently.**

</div>
