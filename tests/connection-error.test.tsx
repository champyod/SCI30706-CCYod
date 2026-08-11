import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { ConnectionError } from "../src/components/ConnectionError";

describe("ConnectionError", () => {
  test("renders the connection-error title", () => {
    const html = renderToString(<ConnectionError onRetry={() => {}} />);
    expect(html).toContain("ไม่สามารถเชื่อมต่อฐานข้อมูลได้");
  });

  test("renders the hint text", () => {
    const html = renderToString(<ConnectionError onRetry={() => {}} />);
    expect(html).toContain("กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
  });

  test("renders a retry button wired to onRetry", () => {
    const html = renderToString(<ConnectionError onRetry={() => {}} />);
    expect(html).toContain("ลองอีกครั้ง");
    expect(html).toContain("type=\"button\"");
  });
});
