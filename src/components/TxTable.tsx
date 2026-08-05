import {
  createColumnHelper,
  createTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/table-core";
import type { Cell, ColumnDef, Header, SortingState, TableState } from "@tanstack/table-core";
import type { ReactElement, ReactNode } from "react";
import { Icon } from "./Icon";
import { TX_TYPE_LABELS, txAmountClass, txAmountParts, txBadgeClass } from "./tx-logic";
import type { Tx } from "../lib/types";

export interface TxTableProps {
  transactions: Tx[];
  onDelete: (id: string) => void;
}

const DEFAULT_SORTING: SortingState = [{ id: "date", desc: true }];

const EMPTY_TABLE_MESSAGE = "ยังไม่มีรายการ";

// The table renders statically (SSR-safe); sorting stays at its default, so
// every state slice is a fixed constant and updates are intentionally ignored.
const STATIC_TABLE_STATE: TableState = {
  columnVisibility: {},
  columnOrder: [],
  columnPinning: {},
  rowPinning: {},
  columnFilters: [],
  globalFilter: undefined,
  sorting: DEFAULT_SORTING,
  expanded: {},
  grouping: [],
  columnSizing: {},
  columnSizingInfo: {
    columnSizingStart: [],
    startOffset: null,
    startSize: null,
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: false,
  },
  pagination: { pageIndex: 0, pageSize: 10 },
  rowSelection: {},
};

function ignoreStateChange(): void {
  // Static render: no user-triggered state updates reach this table.
}

const columnHelper = createColumnHelper<Tx>();

// ColumnDef<Tx, any> is table-core's documented column array type; accessor
// column defs are invariant in TValue, so a narrower annotation would fail.
function buildColumns(onDelete: (id: string) => void): ColumnDef<Tx, any>[] {
  return [
    columnHelper.accessor("date", {
      header: "วันที่",
      cell: ({ getValue }) => String(getValue()),
    }),
    columnHelper.accessor("type", {
      header: "ประเภท",
      cell: ({ row }) => (
        <span className={txBadgeClass(row.original.type)}>{TX_TYPE_LABELS[row.original.type]}</span>
      ),
    }),
    columnHelper.accessor("category", {
      header: "หมวดหมู่",
      cell: ({ getValue }) => String(getValue()),
    }),
    columnHelper.accessor("note", {
      header: "หมายเหตุ",
      cell: ({ getValue }) => String(getValue()),
    }),
    columnHelper.accessor("amount", {
      header: "จำนวน",
      cell: ({ row }) => {
        const { sign, formatted } = txAmountParts(row.original);
        // Single text node: adjacent text children would get SSR comment separators.
        return <span className={txAmountClass(row.original.type)}>{`${sign}${formatted}`}</span>;
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          type="button"
          className="btn tx-delete-btn"
          aria-label="ลบรายการ"
          onClick={() => onDelete(row.original.id)}
        >
          <Icon name="Trash2" size={16} />
        </button>
      ),
    }),
  ];
}

// table-core has no flexRender (that lives in the react adapter), so templates
// are resolved manually; plain accessors fall back to the raw value.
function renderCellContent(cell: Cell<Tx, unknown>): ReactNode {
  const template = cell.column.columnDef.cell;
  if (template === undefined) {
    return String(cell.getValue());
  }
  if (typeof template === "string") {
    return template;
  }
  return template(cell.getContext());
}

function renderHeaderContent(header: Header<Tx, unknown>): ReactNode {
  const template = header.column.columnDef.header;
  if (typeof template === "function") {
    return template(header.getContext());
  }
  return template ?? "";
}

export function TxTable({ transactions, onDelete }: TxTableProps): ReactElement {
  const table = createTable({
    columns: buildColumns(onDelete),
    data: transactions,
    state: STATIC_TABLE_STATE,
    onStateChange: ignoreStateChange,
    renderFallbackValue: null,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const headerGroup = table.getHeaderGroups()[0];
  const rows = table.getRowModel().rows;
  return (
    <table className="table">
      {headerGroup !== undefined && (
        <thead>
          <tr>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>{renderHeaderContent(header)}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={headerGroup?.headers.length ?? 0}>{EMPTY_TABLE_MESSAGE}</td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{renderCellContent(cell)}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
