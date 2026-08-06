import { useEffect, useState } from "react";
import type { ChangeEvent, ReactElement } from "react";
import { MAX_AUTO_PERCENT, validateAutoSplitPercents } from "../lib/auto-split";
import type { Settings } from "../lib/types";

export interface AutoInvestRowProps {
  settings: Settings;
  onUpdate: (patch: Partial<Settings>) => void;
}

const INPUT_CLASS =
  "w-24 rounded-lg border border-edge bg-surface px-3 py-1.5 text-ink outline-none transition-colors focus:border-primary";

export function AutoInvestRow({ settings, onUpdate }: AutoInvestRowProps): ReactElement {
  const [invest, setInvest] = useState(String(settings.autoInvestPercent));
  const [save, setSave] = useState(String(settings.autoSavePercent));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInvest(String(settings.autoInvestPercent));
    setSave(String(settings.autoSavePercent));
  }, [settings.autoInvestPercent, settings.autoSavePercent]);

  function commit(investInput: string, saveInput: string): void {
    const investPercent = Number(investInput);
    const savePercent = Number(saveInput);
    const result = validateAutoSplitPercents(investPercent, savePercent);
    if (!result.isValid) {
      setError(result.error ?? null);
      return;
    }
    setError(null);
    onUpdate({ autoInvestPercent: investPercent, autoSavePercent: savePercent });
  }

  function handleInvestChange(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    setInvest(value);
    commit(value, save);
  }

  function handleSaveChange(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    setSave(value);
    commit(invest, value);
  }

  return (
    <div className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-xl border border-edge bg-card p-4 text-center">
      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        Auto-invest
        <input
          type="text"
          name="auto-invest-percent"
          inputMode="decimal"
          className={INPUT_CLASS}
          value={invest}
          onChange={handleInvestChange}
          aria-label="Auto-invest percent"
        />
        %
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        Auto-save
        <input
          type="text"
          name="auto-save-percent"
          inputMode="decimal"
          className={INPUT_CLASS}
          value={save}
          onChange={handleSaveChange}
          aria-label="Auto-save percent"
        />
        %
      </label>
      <p className="m-0 text-center text-sm text-ink-dim">
        Auto-invest fills the top goal first, then rolls over. Each income entry
        is split automatically. Max {MAX_AUTO_PERCENT}% combined.
      </p>
      {error !== null && (
        <p className="m-0 w-full text-sm text-expense" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}