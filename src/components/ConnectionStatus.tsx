import type { ReactElement } from "react";

export type ConnectionKind = "cloud" | "local";

export interface ConnectionStatusProps {
  kind: ConnectionKind;
}

const CONNECTION_LABELS: Record<ConnectionKind, string> = {
  cloud: "คลาวด์",
  local: "เครื่องนี้",
};

const CONNECTION_DOT_CLASSES: Record<ConnectionKind, string> = {
  cloud: "status-dot-cloud",
  local: "status-dot-local",
};

export function ConnectionStatus({ kind }: ConnectionStatusProps): ReactElement {
  return (
    <span className="badge" aria-label={`การเชื่อมต่อ: ${CONNECTION_LABELS[kind]}`}>
      <span className={`status-dot ${CONNECTION_DOT_CLASSES[kind]}`} aria-hidden="true" />
      {CONNECTION_LABELS[kind]}
    </span>
  );
}
