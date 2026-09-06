import React from "react";

type StatusType =
  | "online"
  | "offline"
  | "busy"
  | "idle"
  | "warning"
  | "error"
  | "connecting";

interface StatusBadgeProps {
  status: StatusType;
  size?: "sm" | "md";
}

interface StatusConfig {
  label: string;
  dotColor: string;
  bg: string;
  textColor: string;
  pulse: boolean;
}

const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
  online: {
    label: "Online",
    dotColor: "#10B981",
    bg: "#ECFDF5",
    textColor: "#10B981",
    pulse: false,
  },
  offline: {
    label: "Offline",
    dotColor: "#98A2B3",
    bg: "#F1F4F9",
    textColor: "#98A2B3",
    pulse: false,
  },
  busy: {
    label: "Busy",
    dotColor: "#4F6FFF",
    bg: "#EEF3FF",
    textColor: "#4F6FFF",
    pulse: false,
  },
  idle: {
    label: "Idle",
    dotColor: "#667085",
    bg: "#F1F4F9",
    textColor: "#667085",
    pulse: false,
  },
  warning: {
    label: "Warning",
    dotColor: "#F59E0B",
    bg: "#FFF7ED",
    textColor: "#F59E0B",
    pulse: false,
  },
  error: {
    label: "Error",
    dotColor: "#EF4444",
    bg: "#FEF2F2",
    textColor: "#EF4444",
    pulse: false,
  },
  connecting: {
    label: "Connecting",
    dotColor: "#0EA5E9",
    bg: "#ECFEFF",
    textColor: "#0EA5E9",
    pulse: true,
  },
};

function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const fontSize = size === "sm" ? 10 : 12;
  const dotSize = size === "sm" ? 6 : 7;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: config.bg,
        color: config.textColor,
        borderRadius: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 4,
        paddingBottom: 4,
        fontSize,
        fontWeight: 500,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      <span
        className={config.pulse ? "pulse-dot" : undefined}
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: config.dotColor,
          flexShrink: 0,
          display: "inline-block",
        }}
      />
      {config.label}
    </span>
  );
}

export default StatusBadge;
