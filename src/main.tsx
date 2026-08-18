import { createClient } from "@supabase/supabase-js";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { mountApp } from "./components/App";
import { ConnectionError } from "./components/ConnectionError";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config";
import { AppStore } from "./lib/store";
import { SupabaseStore } from "./lib/storage/supabase";
import type { SupabaseClientLike } from "./lib/storage/supabase";
import { withTimeout } from "./lib/with-timeout";

// Supabase is the only backend; there is deliberately no local fallback. A
// stalled or unreachable cloud surfaces a connection error with a retry action
// instead of silently degrading to localStorage, so the timeout below bounds
// the wait before the error screen appears.
const CLOUD_INIT_TIMEOUT_MS = 2500;

const LOADING_LABEL = "กำลังเชื่อมต่อฐานข้อมูล…";

function createBackendStore(): AppStore {
  // The real SupabaseClient's generated generics are too deep for TS to check
  // structurally against SupabaseClientLike, so widen only at this boundary
  // (same rationale as the defaultClient() cast inside supabase.ts).
  const client = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
  ) as unknown as SupabaseClientLike;
  return new AppStore(new SupabaseStore(client));
}

async function boot(root: Root): Promise<void> {
  const store = createBackendStore();
  try {
    await withTimeout(store.init(), CLOUD_INIT_TIMEOUT_MS);
    mountApp(root, store);
  } catch (error) {
    console.error("Supabase unavailable; not falling back to local storage", error);
    root.render(<ConnectionError onRetry={() => void boot(root)} />);
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("missing #root element");

const root = createRoot(rootElement);
root.render(
  <div className="flex min-h-screen items-center justify-center bg-surface text-ink-dim">
    {LOADING_LABEL}
  </div>,
);
void boot(root);
