import { createClient } from "@supabase/supabase-js";
import { mountApp } from "./components/App";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config";
import { AppStore } from "./lib/store";
import { LocalStore } from "./lib/storage/local";
import { SupabaseStore } from "./lib/storage/supabase";
import type { SupabaseClientLike } from "./lib/storage/supabase";

// Why a timeout instead of just try/catch: SupabaseStore has no reachability
// probe, so a stalled network leaves init() pending forever and the page blank.
// Racing init against a short timeout lets a healthy cloud respond quickly
// while a hung or unreachable instance falls back to LocalStore so the page
// still renders.
const CLOUD_INIT_TIMEOUT_MS = 2500;

async function chooseBackend(): Promise<AppStore> {
  // The real SupabaseClient's generated generics are too deep for TS to check
  // structurally against SupabaseClientLike, so widen only at this boundary
  // (same rationale as the defaultClient() cast inside supabase.ts).
  const client = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
  ) as unknown as SupabaseClientLike;
  const store = new AppStore(new SupabaseStore(client));
  try {
    await withTimeout(store.init(), CLOUD_INIT_TIMEOUT_MS);
    return store;
  } catch (error) {
    console.error("Supabase unavailable; falling back to local storage", error);
    await store.setBackend(new LocalStore());
    return store;
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`backend init timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (reason) => {
        clearTimeout(timer);
        reject(reason);
      },
    );
  });
}

const root = document.getElementById("root");
if (!root) throw new Error("missing #root element");

// mountApp re-runs store.init() before first render by contract; that second
// read is idempotent and cheap, and guards against backend swap mid-flight.
void chooseBackend().then((store) => {
  mountApp(root, store);
});