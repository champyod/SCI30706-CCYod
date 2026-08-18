import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "../../config";
import type { Goal, Settings, Tx } from "../types";
import type { DataStore } from "./datastore";

const DEFAULT_SETTINGS: Settings = {
  savingsBalance: 0,
  autoInvestPercent: 0,
  autoSavePercent: 0,
};

const SETTING_KEYS = {
  savingsBalance: "savings_balance",
  autoInvestPercent: "auto_invest_percent",
  autoSavePercent: "auto_save_percent",
} as const;

// settings.id integer primary key has no default, so the three keyed rows use fixed ids
const SETTING_IDS = {
  savingsBalance: 2,
  autoInvestPercent: 4,
  autoSavePercent: 5,
} as const;

export interface SupabaseResult<T> {
  data: T | null;
  error: { message: string } | null;
}

export interface ThenableQuery<T> {
  then<TResult1 = SupabaseResult<T>, TResult2 = never>(
    onfulfilled?: ((value: SupabaseResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2>;
}

export interface FilteredQuery<T> extends ThenableQuery<T> {
  eq(column: string, value: unknown): FilteredQuery<T>;
  order(column: string, options: { ascending: boolean }): FilteredQuery<T>;
}

export interface DbTable {
  select(columns?: string): FilteredQuery<unknown>;
  insert(values: unknown): FilteredQuery<unknown>;
  upsert(values: unknown, options: { onConflict: string }): FilteredQuery<unknown>;
  update(values: unknown): FilteredQuery<unknown>;
  delete(): FilteredQuery<unknown>;
}

export interface SupabaseClientLike {
  from(table: string): DbTable;
}

interface TxRow {
  id: string;
  type: string;
  category: string;
  amount: number;
  note: string | null;
  date: string;
  created_at: string;
}

interface GoalRow {
  id: string;
  name: string;
  target: number;
  current: number;
  duration: number;
  position: number;
  created_at: string;
}

interface SettingsRow {
  key: string;
  value: unknown;
}

function rowToTx(row: TxRow): Tx {
  return {
    id: row.id,
    type: row.type === "income" ? "income" : "expense",
    category: row.category,
    amount: Number(row.amount),
    note: row.note ?? "",
    date: row.date,
    createdAt: row.created_at,
  };
}

function rowToGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    name: row.name,
    target: Number(row.target),
    current: Number(row.current),
    duration: row.duration,
    position: row.position,
    createdAt: row.created_at,
  };
}

function patchToRow(patch: Partial<Goal> | Partial<Tx>): Record<string, unknown> {
  const row: Record<string, unknown> = { ...patch };
  if (row.createdAt !== undefined) {
    row.created_at = row.createdAt;
  }
  delete row.createdAt;
  return row;
}

// the real SupabaseClient's generated generics are too deep for TS to check
// structurally against the minimal client interface, so widen only at this boundary
function defaultClient(): SupabaseClientLike {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) as unknown as SupabaseClientLike;
}

function parseNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return DEFAULT_SETTINGS.savingsBalance;
}

export class SupabaseStore implements DataStore {
  constructor(private client: SupabaseClientLike = defaultClient()) {}

  private wrapError(operation: string, cause: unknown): never {
    const detail = cause instanceof Error ? cause.message : String(cause);
    throw new Error(`ไม่สามารถ${operation}ได้ (${detail})`);
  }

  private async run(
    operation: string,
    builder: () => ThenableQuery<unknown>,
  ): Promise<SupabaseResult<unknown>> {
    let result: SupabaseResult<unknown>;
    try {
      result = await builder();
    } catch (cause) {
      throw this.wrapError(operation, cause);
    }
    if (result.error !== null) {
      throw this.wrapError(operation, result.error);
    }
    return result;
  }

  async listTransactions(): Promise<Tx[]> {
    const result = await this.run("โหลดรายการธุรกรรม", () =>
      this.client.from("transactions").select("*").order("created_at", { ascending: false }),
    );
    return ((result.data ?? []) as TxRow[]).map(rowToTx);
  }

  async addTransaction(t: Omit<Tx, "id" | "createdAt">): Promise<Tx> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await this.run("บันทึกรายการธุรกรรม", () =>
      this.client.from("transactions").insert({ ...t, id, created_at: createdAt }),
    );
    return { ...t, id, createdAt };
  }

  async updateTransaction(id: string, patch: Partial<Tx>): Promise<void> {
    await this.run("อัปเดตรายการธุรกรรม", () =>
      this.client.from("transactions").update(patchToRow(patch)).eq("id", id),
    );
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.run("ลบรายการธุรกรรม", () =>
      this.client.from("transactions").delete().eq("id", id),
    );
  }

  async listGoals(): Promise<Goal[]> {
    const result = await this.run("โหลดเป้าหมาย", () =>
      this.client.from("goals").select("*").order("position", { ascending: true }),
    );
    return ((result.data ?? []) as GoalRow[]).map(rowToGoal);
  }

  async addGoal(g: Omit<Goal, "id" | "createdAt">): Promise<Goal> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await this.run("บันทึกเป้าหมาย", () =>
      this.client.from("goals").insert({ ...g, id, created_at: createdAt }),
    );
    return { ...g, id, createdAt };
  }

  async updateGoal(id: string, patch: Partial<Goal>): Promise<void> {
    await this.run("อัปเดตเป้าหมาย", () =>
      this.client.from("goals").update(patchToRow(patch)).eq("id", id),
    );
  }

  async deleteGoal(id: string): Promise<void> {
    await this.run("ลบเป้าหมาย", () => this.client.from("goals").delete().eq("id", id));
  }

  async getSettings(): Promise<Settings> {
    const result = await this.run("โหลดการตั้งค่า", () =>
      this.client.from("settings").select("key,value"),
    );
    const byKey = new Map(((result.data ?? []) as SettingsRow[]).map((row) => [row.key, row.value]));
    return {
      savingsBalance: parseNumber(byKey.get(SETTING_KEYS.savingsBalance)),
      autoInvestPercent: parseNumber(byKey.get(SETTING_KEYS.autoInvestPercent)),
      autoSavePercent: parseNumber(byKey.get(SETTING_KEYS.autoSavePercent)),
    };
  }

  async saveSettings(settings: Settings): Promise<void> {
    const rows = [
      { id: SETTING_IDS.savingsBalance, key: SETTING_KEYS.savingsBalance, value: settings.savingsBalance },
      { id: SETTING_IDS.autoInvestPercent, key: SETTING_KEYS.autoInvestPercent, value: settings.autoInvestPercent },
      { id: SETTING_IDS.autoSavePercent, key: SETTING_KEYS.autoSavePercent, value: settings.autoSavePercent },
    ];
    await this.run("บันทึกการตั้งค่า", () =>
      this.client.from("settings").upsert(rows, { onConflict: "key" }),
    );
  }
}
