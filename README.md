# FinGoal

A Thai-language personal finance tracker built as a school project. Tracks
income/expenses, savings goals, and an automatic invest/save split for each
income entry. All data lives in Supabase — there is deliberately no local
fallback.

## Stack

- React 19 + TypeScript + Vite (custom `build.ts` / `dev.ts` via Bun)
- Supabase (Postgres) as the single backend
- Tailwind CSS v4
- Tests: Bun test runner + happy-dom

## Scripts

```bash
bun install
bun run dev        # local dev server
bun test           # run the test suite
bun run typecheck  # tsc --noEmit
bun run build      # production build to dist/
```

## Setup

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Copy `src/config.ts` and point `SUPABASE_URL` /
   `SUPABASE_PUBLISHABLE_KEY` at your project.
3. `bun run dev` and start entering data.

## Data model

- `transactions` — income/expense entries with category, amount, date, note.
  Income entries run the auto-split: `autoInvestPercent` fills the top goal
  first, then rolls over; `autoSavePercent` goes to the savings balance.
- `goals` — named savings targets with current amount and duration. The
  duration only drives the "Est. THB/day" estimate text.
- `settings` — savings balance and the auto-invest/auto-save percentages.

## Security note (school demo)

The anon role has full CRUD on all three tables via RLS policies. Anyone with
the publishable key can read or delete all data. This is acceptable for a
school demo with throwaway data only.

If this ever holds real data, the fix is:

1. Enable Supabase Auth and require sign-in (`auth.uid()` based policies in
   `schema.sql`).
2. Replace every `create policy ... to anon` with an `to authenticated`
   policy scoped to the user's own rows.
3. Move the publishable key behind an auth session (the browser key stays
   public by design; row-level auth is what actually protects the data).

## Deploy

`bun run build` emits `dist/`. Pushing to `main` triggers the
`.github/workflows/deploy-pages.yml` workflow, which deploys `dist/` to
GitHub Pages.