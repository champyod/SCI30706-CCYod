import type { ReactElement } from "react";

const CONNECT_ERROR_TITLE = "ไม่สามารถเชื่อมต่อฐานข้อมูลได้";
const CONNECT_ERROR_HINT = "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต แล้วลองอีกครั้ง";
const RETRY_LABEL = "ลองอีกครั้ง";

interface ConnectionErrorProps {
  onRetry: () => void;
}

/** Full-page error shown when the Supabase backend cannot be reached at boot. */
export function ConnectionError({ onRetry }: ConnectionErrorProps): ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md rounded-2xl border border-edge bg-card p-8 text-center shadow-sm">
        <h1 className="text-lg font-bold text-ink">{CONNECT_ERROR_TITLE}</h1>
        <p className="mt-2 text-sm text-ink-dim">{CONNECT_ERROR_HINT}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 cursor-pointer rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary transition-opacity hover:opacity-90"
        >
          {RETRY_LABEL}
        </button>
      </div>
    </div>
  );
}
