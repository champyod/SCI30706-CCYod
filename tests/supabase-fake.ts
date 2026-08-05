import { SupabaseStore } from "../src/lib/storage/supabase";
import type { DbTable, FilteredQuery, SupabaseClientLike, SupabaseResult } from "../src/lib/storage/supabase";

export type Row = Record<string, unknown>;

class FakeQuery implements FilteredQuery<unknown> {
  private filter: { column: string; value: unknown } | null = null;

  constructor(
    private table: FakeTable,
    private kind: "select" | "insert" | "upsert" | "update" | "delete",
    private values?: unknown,
    private conflictKey?: string,
  ) {}

  eq(column: string, value: unknown): FilteredQuery<unknown> {
    this.filter = { column, value };
    return this;
  }

  order(column: string, options: { ascending: boolean }): FilteredQuery<unknown> {
    this.table.lastOrder = { column, ascending: options.ascending };
    return this;
  }

  then<TResult1 = SupabaseResult<unknown>, TResult2 = never>(
    onfulfilled?: ((value: SupabaseResult<unknown>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.result().then(onfulfilled, onrejected);
  }

  private result(): Promise<SupabaseResult<unknown>> {
    if (this.table.rejectWith !== null) {
      return Promise.reject(this.table.rejectWith);
    }
    if (this.table.error !== null) {
      return Promise.resolve({ data: null, error: this.table.error });
    }
    return Promise.resolve({ data: this.apply(), error: null });
  }

  private apply(): unknown[] | null {
    switch (this.kind) {
      case "select":
        return this.selectRows();
      case "insert":
        for (const row of this.asRows()) {
          this.table.rows.push(row);
        }
        return [];
      case "upsert":
        for (const row of this.asRows()) {
          const existingIndex = this.table.rows.findIndex(
            (existing) => existing[this.conflictKey ?? "key"] === row[this.conflictKey ?? "key"],
          );
          if (existingIndex >= 0) {
            this.table.rows[existingIndex] = { ...this.table.rows[existingIndex], ...row };
          } else {
            this.table.rows.push(row);
          }
        }
        return [];
      case "update": {
        const id = this.filter === null ? undefined : this.filter.value;
        for (const row of this.table.rows) {
          if (row.id === id) {
            Object.assign(row, this.values);
          }
        }
        return [];
      }
      case "delete":
        this.table.deleteCalls += 1;
        if (this.filter === null) {
          this.table.rows = [];
        } else {
          this.table.rows = this.table.rows.filter((row) => row.id !== this.filter?.value);
        }
        return [];
    }
  }

  private asRows(): Row[] {
    return Array.isArray(this.values) ? (this.values as Row[]) : [this.values as Row];
  }

  private selectRows(): unknown[] {
    const rows = [...this.table.rows];
    const order = this.table.lastOrder;
    if (order !== null) {
      rows.sort((a, b) => {
        const left = a[order.column] as number;
        const right = b[order.column] as number;
        if (left === right) {
          return 0;
        }
        return (left < right ? -1 : 1) * (order.ascending ? 1 : -1);
      });
    }
    return rows;
  }
}

export class FakeTable implements DbTable {
  rows: Row[] = [];
  error: { message: string } | null = null;
  rejectWith: Error | null = null;
  lastOrder: { column: string; ascending: boolean } | null = null;
  lastUpsertConflict: string | null = null;
  deleteCalls = 0;

  select(): FilteredQuery<unknown> {
    return new FakeQuery(this, "select");
  }

  insert(values: unknown): FilteredQuery<unknown> {
    return new FakeQuery(this, "insert", values);
  }

  upsert(values: unknown, options: { onConflict: string }): FilteredQuery<unknown> {
    this.lastUpsertConflict = options.onConflict;
    return new FakeQuery(this, "upsert", values, options.onConflict);
  }

  update(values: unknown): FilteredQuery<unknown> {
    return new FakeQuery(this, "update", values);
  }

  delete(): FilteredQuery<unknown> {
    return new FakeQuery(this, "delete");
  }
}

export class FakeClient implements SupabaseClientLike {
  readonly transactions = new FakeTable();
  readonly goals = new FakeTable();
  readonly settings = new FakeTable();

  from(table: string): DbTable {
    if (table === "transactions") {
      return this.transactions;
    }
    if (table === "goals") {
      return this.goals;
    }
    if (table === "settings") {
      return this.settings;
    }
    throw new Error(`unexpected table: ${table}`);
  }
}

export function makeFakeStore(): { store: SupabaseStore; client: FakeClient } {
  const client = new FakeClient();
  return { store: new SupabaseStore(client), client };
}
