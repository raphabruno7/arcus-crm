# Arcus CRM

AI-assisted CRM for small sales teams. Visual Kanban pipeline, contacts and
companies, deals, activities, and an AI assistant that works over your data
(analyses the pipeline, drafts messages, creates records). Multi-tenant with
per-organisation data isolation.

Also serves as the backend for the [WhatsApp Lead Agent](https://github.com/raphabruno7/whatsapp-lead-agent),
which reads and writes leads here through the Supabase REST API.

## Features

- **Pipeline** — Kanban board, drag deals between stages, real-time metrics (total
  value, probability, time-in-stage).
- **Contacts & companies** — funnel stages (lead / prospect / customer), CSV
  import/export, custom fields.
- **Deals** — linked to contacts, products/services, close-probability tracking.
- **Activities** — tasks, reminders, meetings and calls, "today" view.
- **AI assistant** — chat over your CRM data; ask for analyses, create deals,
  generate sales scripts.
- **Inbox** — daily AI-generated briefing with your priorities.
- **i18n** — PT / EN toggle.
- **Auth** — email/password with full reset flow.

## Stack

Next.js (App Router) · TypeScript · Supabase (Postgres + RLS multi-tenancy) ·
AI over the Claude / OpenAI APIs · deployed on Vercel.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill Supabase + AI provider keys
npm run dev
```

See `docs/` for architecture and feature specs.

## Origin

Started from an open-source CRM base and heavily modified since (auth, i18n,
messaging inbox, currency handling, AI assistant, and more).
