import { describe, expect, mock, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { SavingsCard } from "../src/components/SavingsCard";

describe("SavingsCard", () => {
  test("renders the saved balance", () => {
    const markup = renderToString(<SavingsCard balance={1250.5} onSave={mock(() => {})} />);
    expect(markup).toContain("1,250.50");
  });

  test("renders the unlimited badge", () => {
    const markup = renderToString(<SavingsCard balance={0} onSave={mock(() => {})} />);
    expect(markup).toContain(">Unlimited</span>");
  });

  test("renders the save form with an amount input", () => {
    const markup = renderToString(<SavingsCard balance={0} onSave={mock(() => {})} />);
    expect(markup).toContain("<form");
    expect(markup).toContain('name="save-amount"');
    expect(markup).toContain('type="submit"');
    expect(markup).toContain(">Save</button>");
  });

  test("renders no delete action", () => {
    const markup = renderToString(<SavingsCard balance={0} onSave={mock(() => {})} />);
    expect(markup).not.toContain("Trash2");
  });
});
