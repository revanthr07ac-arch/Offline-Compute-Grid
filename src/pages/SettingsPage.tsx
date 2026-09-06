import { useState } from "react";
import { ChevronRight } from "lucide-react";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: on ? "#4F6FFF" : "#E6EAF0",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          position: "absolute",
          top: 3,
          left: on ? 23 : 3,
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
}

type RowRight =
  | { kind: "toggle"; on: boolean; onToggle: () => void }
  | { kind: "value"; text: string; mono?: boolean; color?: string }
  | { kind: "chevron"; color?: string };

function SettingRow({
  label,
  subtitle,
  right,
}: {
  label: string;
  subtitle?: string;
  right: RowRight;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 14,
        paddingBottom: 14,
        minHeight: 52,
        opacity: pressed && right.kind !== "toggle" ? 0.7 : 1,
        transition: "opacity 0.1s",
        cursor: right.kind === "toggle" ? "default" : "pointer",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            color:
              right.kind === "chevron" && right.color
                ? right.color
                : "#111827",
          }}
        >
          {label}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12, color: "#98A2B3", marginTop: 1 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginLeft: 12,
        }}
      >
        {right.kind === "toggle" && (
          <Toggle on={right.on} onToggle={right.onToggle} />
        )}
        {right.kind === "value" && (
          <span
            style={{
              fontSize: 14,
              color: right.color ?? "#667085",
              fontFamily: right.mono ? "monospace" : undefined,
            }}
          >
            {right.text}
          </span>
        )}
        {right.kind === "chevron" && (
          <ChevronRight size={16} color={right.color ?? "#98A2B3"} />
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      style={{
        fontSize: 11,
        color: "#98A2B3",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        paddingBottom: 8,
        paddingLeft: 4,
      }}
    >
      {title}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E6EAF0",
        borderRadius: 14,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      {children}
    </div>
  );
}

function DividedRows({ rows }: { rows: React.ReactNode[] }) {
  return (
    <>
      {rows.map((row, i) => (
        <div
          key={i}
          style={
            i < rows.length - 1
              ? { borderBottom: "1px solid #E6EAF0" }
              : undefined
          }
        >
          {row}
        </div>
      ))}
    </>
  );
}

export default function SettingsPage() {
  const [autoDiscovery, setAutoDiscovery] = useState(true);
  const [confirmDestructive, setConfirmDestructive] = useState(true);
  const [masterNode, setMasterNode] = useState(true);
  const [authentication, setAuthentication] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [enableWorker, setEnableWorker] = useState(true);
  const [autoAccept, setAutoAccept] = useState(true);
  const [notifTaskCompleted, setNotifTaskCompleted] = useState(true);
  const [notifWorkerDisconnected, setNotifWorkerDisconnected] = useState(true);
  const [notifTaskFailed, setNotifTaskFailed] = useState(true);
  const [notifStorageFull, setNotifStorageFull] = useState(true);
  const [notifSound, setNotifSound] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  return (
    <div
      style={{
        backgroundColor: "#F7F9FC",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E6EAF0",
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 12,
          paddingBottom: 12,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 600, color: "#111827" }}>
          Settings
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 12,
          paddingBottom: 96,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* GENERAL */}
        <div>
          <SectionHeader title="General" />
          <Card>
            <DividedRows
              rows={[
                <SettingRow
                  label="Language"
                  right={{ kind: "value", text: "English" }}
                />,
                <SettingRow
                  label="Auto Discovery"
                  right={{
                    kind: "toggle",
                    on: autoDiscovery,
                    onToggle: () => setAutoDiscovery((v) => !v),
                  }}
                />,
                <SettingRow
                  label="Heartbeat Interval"
                  right={{ kind: "chevron" }}
                />,
                <SettingRow
                  label="Default Priority"
                  right={{ kind: "value", text: "Medium" }}
                />,
                <SettingRow
                  label="Confirm Destructive Actions"
                  right={{
                    kind: "toggle",
                    on: confirmDestructive,
                    onToggle: () => setConfirmDestructive((v) => !v),
                  }}
                />,
              ]}
            />
          </Card>
        </div>

        {/* NETWORK */}
        <div>
          <SectionHeader title="Network" />
          <Card>
            <DividedRows
              rows={[
                <SettingRow
                  label="LAN Status"
                  right={{ kind: "value", text: "● Connected", color: "#10B981" }}
                />,
                <SettingRow
                  label="Network"
                  right={{ kind: "value", text: "HomeNetwork-5G" }}
                />,
                <SettingRow
                  label="IP Address"
                  right={{ kind: "value", text: "192.168.1.101", mono: true }}
                />,
                <SettingRow
                  label="Master Node"
                  right={{
                    kind: "toggle",
                    on: masterNode,
                    onToggle: () => setMasterNode((v) => !v),
                  }}
                />,
                <SettingRow
                  label="Discovery Port"
                  right={{ kind: "value", text: "9000", mono: true }}
                />,
                <SettingRow
                  label="Heartbeat Interval"
                  right={{ kind: "value", text: "5s" }}
                />,
              ]}
            />
          </Card>
        </div>

        {/* SECURITY */}
        <div>
          <SectionHeader title="Security" />
          <Card>
            <DividedRows
              rows={[
                <SettingRow
                  label="Authentication"
                  right={{
                    kind: "toggle",
                    on: authentication,
                    onToggle: () => setAuthentication((v) => !v),
                  }}
                />,
                <SettingRow
                  label="Biometric Login"
                  subtitle="Face ID / Fingerprint"
                  right={{
                    kind: "toggle",
                    on: biometric,
                    onToggle: () => setBiometric((v) => !v),
                  }}
                />,
                <SettingRow
                  label="Two-Factor Auth"
                  right={{
                    kind: "toggle",
                    on: twoFactor,
                    onToggle: () => setTwoFactor((v) => !v),
                  }}
                />,
                <SettingRow
                  label="Change Password"
                  right={{ kind: "chevron" }}
                />,
                <SettingRow
                  label="Active Sessions"
                  right={{ kind: "value", text: "3 active" }}
                />,
                <SettingRow label="API Keys" right={{ kind: "chevron" }} />,
              ]}
            />
          </Card>
        </div>

        {/* WORKER CONFIGURATION */}
        <div>
          <SectionHeader title="Worker Configuration" />
          <Card>
            <DividedRows
              rows={[
                <SettingRow
                  label="Enable Worker"
                  right={{
                    kind: "toggle",
                    on: enableWorker,
                    onToggle: () => setEnableWorker((v) => !v),
                  }}
                />,
                <SettingRow
                  label="Max CPU Usage"
                  right={{ kind: "value", text: "80%" }}
                />,
                <SettingRow
                  label="Max RAM Usage"
                  right={{ kind: "value", text: "70%" }}
                />,
                <SettingRow
                  label="Battery Threshold"
                  right={{ kind: "value", text: "20%" }}
                />,
                <SettingRow
                  label="Auto Accept Tasks"
                  right={{
                    kind: "toggle",
                    on: autoAccept,
                    onToggle: () => setAutoAccept((v) => !v),
                  }}
                />,
              ]}
            />
          </Card>
        </div>

        {/* NOTIFICATIONS */}
        <div>
          <SectionHeader title="Notifications" />
          <Card>
            <DividedRows
              rows={[
                <SettingRow
                  label="Task Completed"
                  right={{
                    kind: "toggle",
                    on: notifTaskCompleted,
                    onToggle: () => setNotifTaskCompleted((v) => !v),
                  }}
                />,
                <SettingRow
                  label="Worker Disconnected"
                  right={{
                    kind: "toggle",
                    on: notifWorkerDisconnected,
                    onToggle: () => setNotifWorkerDisconnected((v) => !v),
                  }}
                />,
                <SettingRow
                  label="Task Failed"
                  right={{
                    kind: "toggle",
                    on: notifTaskFailed,
                    onToggle: () => setNotifTaskFailed((v) => !v),
                  }}
                />,
                <SettingRow
                  label="Storage Full"
                  right={{
                    kind: "toggle",
                    on: notifStorageFull,
                    onToggle: () => setNotifStorageFull((v) => !v),
                  }}
                />,
                <SettingRow
                  label="Sound"
                  right={{
                    kind: "toggle",
                    on: notifSound,
                    onToggle: () => setNotifSound((v) => !v),
                  }}
                />,
              ]}
            />
          </Card>
        </div>

        {/* DATABASE */}
        <div>
          <SectionHeader title="Database" />
          <Card>
            <DividedRows
              rows={[
                <SettingRow
                  label="Last Backup"
                  right={{ kind: "value", text: "Jun 12, 2025 14:30" }}
                />,
                <SettingRow
                  label="Backup Size"
                  right={{ kind: "value", text: "2.4 GB" }}
                />,
                <SettingRow
                  label="Auto Backup"
                  right={{
                    kind: "toggle",
                    on: autoBackup,
                    onToggle: () => setAutoBackup((v) => !v),
                  }}
                />,
                <SettingRow
                  label="Export Database"
                  right={{ kind: "chevron", color: "#4F6FFF" }}
                />,
                <SettingRow
                  label="Restore Database"
                  right={{ kind: "chevron" }}
                />,
              ]}
            />
          </Card>
        </div>

        {/* ABOUT */}
        <div>
          <SectionHeader title="About" />
          <Card>
            <DividedRows
              rows={[
                <SettingRow
                  label="Version"
                  right={{ kind: "value", text: "1.0.0 (build 42)" }}
                />,
                <SettingRow
                  label="Platform"
                  right={{ kind: "value", text: "PWA / Web" }}
                />,
                <SettingRow
                  label="License"
                  right={{ kind: "value", text: "MIT" }}
                />,
                <SettingRow
                  label="Check for Updates"
                  right={{ kind: "chevron", color: "#4F6FFF" }}
                />,
                <SettingRow
                  label="Reset All Settings"
                  right={{ kind: "chevron", color: "#EF4444" }}
                />,
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
