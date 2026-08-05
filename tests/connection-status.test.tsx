import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { ConnectionStatus } from "../src/components/ConnectionStatus";

describe("ConnectionStatus", () => {
  test("renders the cloud badge with its dot, label and aria context", () => {
    const markup = renderToString(<ConnectionStatus kind="cloud" />);
    expect(markup).toContain('<span class="badge"');
    expect(markup).toContain('class="status-dot status-dot-cloud"');
    expect(markup).toContain("คลาวด์");
    expect(markup).toContain('aria-label="การเชื่อมต่อ: คลาวด์"');
    expect(markup).toContain('aria-hidden="true"');
  });

  test("renders the local badge with its dot, label and aria context", () => {
    const markup = renderToString(<ConnectionStatus kind="local" />);
    expect(markup).toContain('class="status-dot status-dot-local"');
    expect(markup).toContain("เครื่องนี้");
    expect(markup).toContain('aria-label="การเชื่อมต่อ: เครื่องนี้"');
  });
});
