# Kryst Enquete Website

Responsive one-page React campagnewebsite in warme kerststijl met:

- Hero en merkverhaal van Kryst
- Meerstaps enquete met voortgangsbalk
- Opslag van reacties via Netlify Functions + Supabase
- Live resultaten dashboard met aggregaties
- CSV export en flyer-preview met QR placeholder

## Stack

- React + Vite
- Tailwind CSS v4
- Netlify Functions
- Supabase (PostgreSQL)

## Lokaal starten

1. Installeer dependencies:

   npm install

2. Maak een .env bestand (op basis van .env.example) met:

   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

3. Start frontend:

   npm run dev

4. Start met Netlify Functions (aanbevolen voor volledige flow):

   npx netlify dev

## Supabase tabel

Voer deze SQL uit in Supabase:

create extension if not exists "pgcrypto";

create table if not exists public.survey_responses (
id uuid primary key default gen_random_uuid(),
created_at timestamptz not null default now(),
response jsonb not null
);

## Deploy op Netlify

1. Push project naar Git.
2. Koppel repository in Netlify.
3. Voeg environment variables toe:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
4. Build command: npm run build
5. Publish directory: dist

De redirects en functions map zijn al geconfigureerd in netlify.toml.

## Troubleshooting 500 errors

Krijg je op productie 500 op /api/get-results of /api/submit-response? Check dan:

1. Netlify Environment variables staan in de Site settings en zijn opnieuw gedeployed:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
2. De Supabase tabel public.survey_responses bestaat echt (SQL hierboven uitvoeren).
3. Je bekijkt de Function logs in Netlify:
   - Site -> Functions -> get-results / submit-response -> Logs
4. De API geeft nu ook detail terug in de JSON (velden error + detail + code) om de exacte oorzaak te zien.
