# FinGoal — Fix Guide (review 2026-08-17)

Status: app works, but test suite is RED (16 fails) and there is dead code. Fix in this order.

## How to verify after each step

```bash
bun run typecheck   # must be clean
bun test            # must be 216/216 pass
bun run build       # must build
```

---

## PHASE 1 — Fix the broken tests (make suite green)

Why: 16 tests fail because code changed (optimistic updates, Tailwind restyle, pending rows) and tests were never updated. CI does not run tests, so it ships silently.

### 1.1 `tests/tx-table.test.tsx`
- **Problem**: crashes with `pendingIds.has is undefined` — new required prop missing.
- **Fix**: pass `pendingIds={new Set()}` in every `<TxTable …>` render in the test.

### 1.2 `tests/store.test.ts` + `tests/app-reactivity.test.tsx`
- **Problem**: `addTx`/`deleteTx`/`addGoal`/`deleteGoal` now notify TWICE (optimistic + resolved). Tests expect 1.
- **Fix**: update expected notify counts from 1 → 2, or assert `>= 1`. Same for the version-bump test in app-reactivity.

### 1.3 `tests/quote-box.test.tsx` + `tests/tx-logic.test.ts`
- **Problem**: expect old class names (`card quote-box`, `quote-text`, `badge badge-income`, `tx-amount tx-amount-income`). Code now returns Tailwind classes.
- **Fix**: assert on new class strings, e.g. `toContain("rounded-2xl")` / `"inline-block rounded-full bg-income-light"`.

### 1.4 `tests/animated-icon.test.tsx`
- **Problem**: tests dead component; also fails on old class name.
- **Fix**: delete this test file together with Phase 2, item 2.1.

---

## PHASE 2 — Delete dead code

### 2.1 Dead component + its dependency
- Delete `src/components/AnimatedIcon.tsx` and `tests/animated-icon.test.tsx`.
- `motion` package becomes unused → `bun remove motion`.

### 2.2 Dead lib functions (only referenced by their own tests)
- `src/lib/interest.ts` (whole file) + `INTEREST_RATE` in `src/lib/constants.ts` → delete + `tests/interest.test.ts`
- `src/lib/finance.ts`: delete `applyDeduction`, `getBalance`, `currentBalance` (keep `sumByType`, `goalProgress`, `goalsInvested`, `freeBalance`) → update `tests/finance.test.ts`
- `src/lib/date.ts`: delete `monthKey`, `formatThaiDate`, `CHART_MONTHS` (keep `todayKey`) → update `tests/date.test.ts`

### 2.3 Dead store methods
- `src/lib/store.ts`: delete `updateTx`, `clearAll`, `isTxPending`, `isGoalPending`
- `src/lib/storage/datastore.ts`: delete `clearAll` from interface
- `src/lib/storage/supabase.ts`: delete `clearAll` method
- Update `tests/store.test.ts` + `tests/supabase.test.ts` accordingly.

### 2.4 Legacy field `totalDeducted`
- Never written by UI (always 0). Remove from `Settings` type, `DEFAULT_SETTINGS`, `supabase.ts` (`SETTING_KEYS`, `SETTING_IDS`, `getSettings`, `saveSettings`).
- Optional: remove `total_deducted` row/key from `supabase/schema.sql` (schema edit is manual — you must run it in Supabase SQL editor yourself).

### 2.5 Unused npm deps
- `clsx`, `tailwind-merge` have zero imports → `bun remove clsx tailwind-merge`.

### 2.6 Dead delete-pending logic
- `src/lib/store.ts`: in `deleteTx` and `deleteGoal`, remove `this.pendingTxIds.add(id)` / `this.pendingGoalIds.add(id)` — row is already gone, skeleton never renders.

---

## PHASE 3 — Fix real bugs (data integrity)

### 3.1 `store.ts` addTx rollback bug (CRITICAL)
- **Problem**: tx insert succeeds → later goal/settings write fails → catch rolls back client AND the saved tx is already in DB. On reload the tx reappears without its goal split.
- **Fix options** (pick one):
  - a) If insert succeeded, do NOT roll back the transaction row — only roll back goal/settings changes, and surface a warning toast.
  - b) Move tx + deltas into one Supabase RPC (database transaction) so all-or-nothing.

### 3.2 AutoInvestRow writes on every keystroke
- `src/components/AutoInvestRow.tsx`: commit only on blur or Enter, not per `onChange`. Also handle empty input (don't commit `Number("") = 0` silently).

### 3.3 Invisible boot toast
- `src/main.tsx` line ~57: `toast.error(CONNECT_ERROR)` fires before `<Toaster>` mounts → never visible. Remove it (ConnectionError screen already shows the message).

---

## PHASE 4 — Zombie feature: Goal Mode selector

- `src/components/GoalForm.tsx`: Mode (Daily/Weekly) select is collected and persisted but **never used** anywhere.
- Decide: remove it (delete `mode` from form, `GoalInput`, `Goal` type, `schema.sql`) — OR implement mode in `goal-result-logic.ts` (`dailyRequiredSavings` should differ for weekly mode).
- Recommendation: remove it — simplest.

---

## PHASE 5 — Security (only if keeping real data)

- `supabase/schema.sql`: anon has full CRUD on all tables → anyone can delete everything.
- School demo with throwaway data: acceptable, just document it.
- Real data: enable auth, change policies to `auth.uid()` based. This is a bigger change — do it only if needed.

---

## PHASE 6 — Polish (optional, low priority)

- [ ] `Icon.tsx`: trim 60-icon allowlist to the 3 used (Wallet, Quote, Trash2) — smaller bundle
- [ ] Unify language: GoalForm/GoalCard/SummaryCard are English, rest Thai
- [ ] `investGoal`/`saveMoney`: show error/success feedback instead of silent no-op
- [ ] TxForm: validate date is required (empty date currently allowed)
- [ ] Chart months: use fixed last-6-months window (`CHART_MONTHS` concept) instead of only months with data
- [ ] Goal ordering: all goals `position: 0` → order unstable; add reorder UI or drop ordering
- [ ] README.md still says "BMI Calculator" — rewrite for FinGoal
- [ ] Add `bun test` step to `.github/workflows/deploy-pages.yml` so broken tests block deploy

---

## Final checklist before deploy

```bash
bun run typecheck   # 0 errors
bun test            # all pass
bun run build       # builds
git push            # workflow deploys to GitHub Pages
```

---

## Phase 4 addendum — daily/weekly mode confirmed dead (2026-08-17)

Verified again during walkthrough prep:
- `goal.mode` (daily/weekly): collected in GoalForm, persisted to DB, **never read by any logic**.
- Actual invest flows are BOTH per-action:
  1. Manual "Invest" button on each GoalCard (`store.investGoal`)
  2. Auto-invest % applied per income entry (`store.addTx` → `computeAutoSplit`)
- No daily/weekly scheduling exists anywhere → `mode` describes a feature that does not exist.
- `goal.duration` only drives the cosmetic "Est. X THB/day" text on GoalCard (`dailyRequiredSavings` = `(target − current) / duration`). It is hardcoded per-day even when mode = weekly.

Decision options for Phase 4:
- **Option A (recommended)**: remove `mode` (form select, `GoalInput`, `Goal` type, `schema.sql`). Keep `duration` only for the estimate text.
- **Option B**: implement real weekly mode — mode-aware estimate + actual scheduled investing (bigger change; Supabase cron/edge function needed). Overkill for school demo.
