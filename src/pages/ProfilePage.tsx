import { useState } from "react";
import {
  ChevronRight,
  Copy,
  LogOut,
  Monitor,
  Smartphone,
  Globe,
  CheckCircle2,
} from "lucide-react";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: on ? "#8B5CF6" : "#E6EAF0",
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

function SettingRow({
  label,
  subtitle,
  right,
}: {
  label: string;
  subtitle?: string;
  right:
    | { kind: "toggle"; on: boolean; onToggle: () => void }
    | { kind: "chevron"; color?: string };
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
        <div style={{ fontSize: 14, color: "#111827" }}>{label}</div>
        {subtitle && (
          <div style={{ fontSize: 12, color: "#98A2B3", marginTop: 1 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginLeft: 12 }}>
        {right.kind === "toggle" && (
          <Toggle on={right.on} onToggle={right.onToggle} />
        )}
        {right.kind === "chevron" && (
          <ChevronRight size={16} color={right.color ?? "#98A2B3"} />
        )}
      </div>
    </div>
  );
}

const activityItems = [
  { text: "Uploaded 4K Video Batch", time: "2h ago" },
  { text: "Connected MacBook-Pro-5", time: "3h ago" },
  { text: "Created task #t-0053", time: "Yesterday" },
  { text: "Changed password", time: "3 days ago" },
  { text: "Generated API key", time: "4 days ago" },
  { text: "Login from 192.168.1.105", time: "5 days ago" },
];

const dotColors = [
  "#8B5CF6",
  "#10B981",
  "#7C5CFC",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
];

const sessions = [
  {
    icon: <Monitor size={16} color="#667085" />,
    device: "Chrome on MacBook",
    status: "Active now",
    statusColor: "#10B981",
  },
  {
    icon: <Smartphone size={16} color="#667085" />,
    device: "Safari on iPhone",
    status: "1h ago",
    statusColor: "#98A2B3",
  },
  {
    icon: <Globe size={16} color="#667085" />,
    device: "Firefox on Linux",
    status: "3h ago",
    statusColor: "#98A2B3",
  },
];

export default function ProfilePage() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [loginNotifs, setLoginNotifs] = useState(true);

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 600, color: "#111827" }}>
          Profile
        </div>
        <button
          style={{
            fontSize: 14,
            color: "#8B5CF6",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Edit
        </button>
      </div>

      {/* Hero Card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E6EAF0",
          borderRadius: 14,
          margin: "16px 16px 0",
          padding: 20,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #8B5CF6, #7C5CFC)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>
            AK
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            Alex Kim
          </div>
          <div style={{ marginTop: 3 }}>
            <span
              style={{
                backgroundColor: "#F3E8FF",
                color: "#8B5CF6",
                fontSize: 11,
                borderRadius: 99,
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 2,
                paddingBottom: 2,
              }}
            >
              Grid Administrator
            </span>
          </div>
          <div
            style={{ fontSize: 13, color: "#667085", marginTop: 5 }}
          >
            alex.kim@gridlab.local
          </div>
          <div style={{ fontSize: 13, color: "#98A2B3", marginTop: 1 }}>
            GridLab Research
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "flex",
          gap: 12,
          margin: "12px 16px 0",
        }}
      >
        {[
          { value: "47", label: "Tasks Created" },
          { value: "8", label: "Devices Managed" },
          { value: "14d", label: "Uptime" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              border: "1px solid #E6EAF0",
              borderRadius: 10,
              padding: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: 11, color: "#98A2B3", marginTop: 2 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div
        style={{
          margin: "16px 16px 0",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* API Keys */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E6EAF0",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>
              API Keys
            </div>
            <button
              style={{
                backgroundColor: "#F3E8FF",
                color: "#8B5CF6",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 6,
                paddingBottom: 6,
                cursor: "pointer",
              }}
            >
              New
            </button>
          </div>
          {[
            { name: "Production Key", masked: "sk_live_••••••••ABCD" },
            { name: "Dev Key", masked: "sk_live_••••••••XY12" },
          ].map((key, i) => (
            <div
              key={key.name}
              style={{
                paddingTop: 12,
                paddingBottom: 12,
                borderTop: i === 0 ? "1px solid #E6EAF0" : undefined,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>
                  {key.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#98A2B3",
                    fontFamily: "monospace",
                    marginTop: 2,
                  }}
                >
                  {key.masked}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  style={{
                    fontSize: 11,
                    color: "#8B5CF6",
                    background: "none",
                    border: "1px solid #E6EAF0",
                    borderRadius: 6,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 4,
                    paddingBottom: 4,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <Copy size={11} />
                  Copy
                </button>
                <button
                  style={{
                    fontSize: 11,
                    color: "#EF4444",
                    background: "none",
                    border: "1px solid #E6EAF0",
                    borderRadius: 6,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 4,
                    paddingBottom: 4,
                    cursor: "pointer",
                  }}
                >
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E6EAF0",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#111827",
              marginBottom: 12,
            }}
          >
            Recent Activity
          </div>
          {activityItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                paddingTop: 10,
                paddingBottom: 10,
                borderTop: i === 0 ? "1px solid #E6EAF0" : undefined,
                borderBottom:
                  i < activityItems.length - 1
                    ? "1px solid #E6EAF0"
                    : undefined,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: dotColors[i],
                  flexShrink: 0,
                  marginRight: 10,
                }}
              />
              <div
                style={{ flex: 1, fontSize: 13, color: "#111827" }}
              >
                {item.text}
              </div>
              <div style={{ fontSize: 12, color: "#98A2B3", marginLeft: 8 }}>
                {item.time}
              </div>
            </div>
          ))}
        </div>

        {/* Security */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E6EAF0",
            borderRadius: 14,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#111827",
              paddingTop: 16,
              paddingBottom: 8,
            }}
          >
            Security
          </div>
          <div style={{ borderTop: "1px solid #E6EAF0" }}>
            <SettingRow
              label="Two-Factor Auth"
              right={{
                kind: "toggle",
                on: twoFactor,
                onToggle: () => setTwoFactor((v) => !v),
              }}
            />
          </div>
          <div style={{ borderTop: "1px solid #E6EAF0" }}>
            <SettingRow
              label="Biometric Login"
              right={{
                kind: "toggle",
                on: biometric,
                onToggle: () => setBiometric((v) => !v),
              }}
            />
          </div>
          <div style={{ borderTop: "1px solid #E6EAF0" }}>
            <SettingRow
              label="Login Notifications"
              right={{
                kind: "toggle",
                on: loginNotifs,
                onToggle: () => setLoginNotifs((v) => !v),
              }}
            />
          </div>
          <div style={{ borderTop: "1px solid #E6EAF0" }}>
            <SettingRow
              label="Change Password"
              right={{ kind: "chevron" }}
            />
          </div>
        </div>

        {/* Sessions */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E6EAF0",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>
              Active Sessions
            </div>
            <button
              style={{
                fontSize: 13,
                color: "#EF4444",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Revoke All
            </button>
          </div>
          {sessions.map((session, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                paddingTop: 10,
                paddingBottom: 10,
                borderTop: "1px solid #E6EAF0",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: "#F1F4F9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {session.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>
                  {session.device}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: session.statusColor,
                    marginTop: 1,
                  }}
                >
                  {session.status}
                </div>
              </div>
              <button
                style={{
                  fontSize: 11,
                  color: "#EF4444",
                  background: "none",
                  border: "1px solid #E6EAF0",
                  borderRadius: 6,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 4,
                  paddingBottom: 4,
                  cursor: "pointer",
                }}
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "calc(100% - 32px)",
          height: 48,
          margin: "16px 16px 96px",
          backgroundColor: "#FEF2F2",
          border: "none",
          borderRadius: 12,
          color: "#EF4444",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <LogOut size={18} />
        Log Out
      </button>
    </div>
  );
}
