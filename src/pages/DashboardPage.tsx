import { Users, Monitor, Cpu, MemoryStick, Activity, Zap, HardDrive, CheckCircle2 } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

// ─── Chart Data ───────────────────────────────────────────────────────────────
const cpuData = Array.from({ length: 20 }, (_, i) => ({ v: Math.round(40 + Math.sin(i / 3) * 20 + Math.random() * 15) }));
const memData = Array.from({ length: 20 }, (_, i) => ({ v: Math.round(40 + Math.sin(i / 3) * 20 + Math.random() * 15) }));
const netData = Array.from({ length: 20 }, (_, i) => ({ v: Math.round(40 + Math.sin(i / 3) * 20 + Math.random() * 15) }));
const diskData = Array.from({ length: 20 }, (_, i) => ({ v: Math.round(40 + Math.sin(i / 3) * 20 + Math.random() * 15) }));

// ─── Metric Cards ─────────────────────────────────────────────────────────────
const metricCards = [
  { label: "Connected Devices", value: "8", sub: "+2 today", icon: Monitor, color: "#4F6FFF" },
  { label: "CPU Cores", value: "48", sub: "3.2 GHz avg", icon: Cpu, color: "#7C5CFC" },
  { label: "Available RAM", value: "124 GB", sub: "of 192 GB", icon: MemoryStick, color: "#10B981" },
  { label: "Running Tasks", value: "3", sub: "2 queued", icon: Activity, color: "#F59E0B" },
  { label: "Processing", value: "2.4 GH/s", sub: "peak 3.1", icon: Zap, color: "#4F6FFF" },
  { label: "Storage", value: "247 GB", sub: "512 GB total", icon: HardDrive, color: "#0EA5E9" },
];

// ─── Mini Progress Bar ─────────────────────────────────────────────────────────
function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ width: 60, height: 4, borderRadius: 2, background: "#F1F4F9", overflow: "hidden" }}>
      <div className="progress-bar-fill" style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2 }} />
    </div>
  );
}

// ─── Performance Chart Card ───────────────────────────────────────────────────
function ChartCard({ label, value, data, color }: { label: string; value: string; data: { v: number }[]; color: string }) {
  return (
    <div className="card-sm" style={{ padding: 12 }}>
      <div style={{ fontSize: 11, color: "#98A2B3", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{value}</div>
      <ResponsiveContainer width="100%" height={60}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`fill-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#fill-${color.replace("#", "")})`}
            dot={false}
            isAnimationActive={true}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Network Topology SVG ─────────────────────────────────────────────────────
function NetworkTopology() {
  const master = { x: 180, y: 110 };
  const workers = [
    { label: "Laptop", x: 60,  y: 45,  r: 14, stroke: "#E6EAF0", fill: "#FFFFFF", status: "idle" },
    { label: "PC",     x: 165, y: 30,  r: 14, stroke: "#E6EAF0", fill: "#FFFFFF", status: "idle" },
    { label: "Mac",    x: 285, y: 45,  r: 14, stroke: "#10B981", fill: "#ECFDF5", status: "online" },
    { label: "RPi",    x: 320, y: 130, r: 12, stroke: "#E6EAF0", fill: "#FFFFFF", status: "idle" },
    { label: "Android",x: 270, y: 200, r: 12, stroke: "#F59E0B", fill: "#FFFBEB", status: "busy" },
    { label: "Tablet", x: 90,  y: 200, r: 12, stroke: "#E6EAF0", fill: "#FFFFFF", status: "idle" },
    { label: "NAS",    x: 30,  y: 130, r: 12, stroke: "#EF4444", fill: "#F9FAFB", status: "offline" },
  ];
  const statusDotColor: Record<string, string> = {
    online: "#10B981", busy: "#F59E0B", idle: "#98A2B3", offline: "#EF4444",
  };
  const activeIds = [2, 4]; // Mac and Android

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <svg width="100%" viewBox="0 0 360 220" style={{ display: "block" }}>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4F6FFF" />
            <stop offset="100%" stopColor="#7C5CFC" />
          </linearGradient>
          <filter id="master-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#4F6FFF" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Lines: all workers */}
        {workers.map((w, i) => (
          <line
            key={`line-${i}`}
            x1={master.x} y1={master.y}
            x2={w.x} y2={w.y}
            stroke="#E6EAF0" strokeWidth={1}
            className="network-line"
          />
        ))}

        {/* Active task lines: dashed blue */}
        {activeIds.map((idx) => {
          const w = workers[idx];
          return (
            <line
              key={`active-${idx}`}
              x1={master.x} y1={master.y}
              x2={w.x} y2={w.y}
              stroke="#4F6FFF" strokeWidth={2}
              strokeOpacity={0.18}
              strokeDasharray="4 4"
              style={{ animation: "dash-move 1.2s linear infinite" }}
            />
          );
        })}

        {/* Animated particles on active lines */}
        {activeIds.map((idx) => {
          const w = workers[idx];
          const dur = 1.4 + idx * 0.3;
          return (
            <circle key={`particle-${idx}`} r={3} fill="#4F6FFF">
              <animateMotion
                dur={`${dur}s`}
                repeatCount="indefinite"
                path={`M${master.x},${master.y} L${w.x},${w.y}`}
              />
            </circle>
          );
        })}

        {/* Worker nodes */}
        {workers.map((w, i) => (
          <g key={`w-${i}`}>
            <circle cx={w.x} cy={w.y} r={w.r} fill={w.fill} stroke={w.stroke} strokeWidth={1.5} />
            {/* status dot */}
            <circle cx={w.x + w.r - 3} cy={w.y - w.r + 3} r={3} fill={statusDotColor[w.status]} />
            <text x={w.x} y={w.y + w.r + 9} textAnchor="middle" fill="#667085" fontSize={9}>{w.label}</text>
          </g>
        ))}

        {/* Master node */}
        <circle cx={master.x} cy={master.y} r={30} fill="none" stroke="url(#grad)" strokeWidth={1.5} />
        <circle cx={master.x} cy={master.y} r={24} fill="#FFFFFF" stroke="#4F6FFF" strokeWidth={2} filter="url(#master-shadow)" />
        <text x={master.x} y={master.y + 5} textAnchor="middle" fill="#4F6FFF" fontSize={12} fontWeight="bold">M</text>
      </svg>

      <style>{`
        @keyframes dash-move { to { stroke-dashoffset: -12; } }
      `}</style>

      <p style={{ fontSize: 10, color: "#98A2B3", textAlign: "center", marginTop: 4 }}>Tap a node to view details</p>
    </div>
  );
}

// ─── Worker Avatars ───────────────────────────────────────────────────────────
const avatarColors = ["#4F6FFF", "#7C5CFC", "#10B981", "#F59E0B", "#0EA5E9"];
const avatarInitials = ["DX", "MC", "LP", "AR", "TB"];

// ─── Task Row ─────────────────────────────────────────────────────────────────
function TaskRow({
  name, status, pct, last,
}: { name: string; status: "Running" | "Completed"; pct?: number; last?: boolean }) {
  const isRunning = status === "Running";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottom: last ? "none" : "1px solid #E6EAF0",
      }}
    >
      {/* Icon */}
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: isRunning ? "#EEF3FF" : "#ECFDF5",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {isRunning
          ? <Activity size={14} color="#4F6FFF" />
          : <CheckCircle2 size={14} color="#10B981" />}
      </div>

      {/* Name + badge */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
        <span style={{
          fontSize: 10, fontWeight: 600,
          color: isRunning ? "#4F6FFF" : "#10B981",
          background: isRunning ? "#EEF3FF" : "#ECFDF5",
          borderRadius: 20, padding: "1px 6px", display: "inline-block", marginTop: 2,
        }}>{status}</span>
      </div>

      {/* Right side */}
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        {isRunning && pct !== undefined ? (
          <>
            <div style={{ width: 72, height: 6, borderRadius: 3, background: "#F1F4F9", overflow: "hidden", marginBottom: 3 }}>
              <div className="progress-bar-fill" style={{ width: `${pct}%`, height: "100%", background: "#4F6FFF", borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, color: "#667085" }}>{pct}%</div>
          </>
        ) : (
          <CheckCircle2 size={16} color="#10B981" />
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F9FC", fontFamily: "'Inter', system-ui, sans-serif", padding: "0 16px", maxWidth: 480, margin: "0 auto" }}>

      {/* ── Section 1: Greeting Header ── */}
      <div className="animate-fade-in-up" style={{ paddingTop: 8, paddingBottom: 16, paddingLeft: 0, paddingRight: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#111827" }}>Good morning, Alex</div>
          <div style={{ fontSize: 13, color: "#98A2B3", marginTop: 2 }}>Compute Overview · Aug 23</div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          background: "#ECFDF5", borderRadius: 9999, padding: "4px 10px",
          fontSize: 11, color: "#10B981", fontWeight: 600, marginTop: 2, flexShrink: 0,
        }}>
          <span className="pulse-dot" />
          LAN Connected
        </div>
      </div>

      {/* ── Section 2: Scrollable Metric Cards ── */}
      <div
        className="animate-fade-in-up"
        style={{
          display: "flex", overflowX: "auto", gap: 12,
          marginLeft: -16, marginRight: -16,
          paddingLeft: 16, paddingRight: 16,
          paddingBottom: 4,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        } as React.CSSProperties}
      >
        <style>{`
          .metric-scroll::-webkit-scrollbar { display: none; }
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        `}</style>
        {metricCards.map(({ label, value, sub, icon: Icon, color }) => (
          <div
            key={label}
            style={{
              background: "#FFFFFF", border: "1px solid #E6EAF0", borderRadius: 14,
              padding: 16, minWidth: 130, flexShrink: 0,
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: `${color}1F`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color, marginBottom: 8,
            }}>
              <Icon size={16} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11, color: "#98A2B3", marginTop: 3 }}>{label}</div>
            <div style={{ fontSize: 11, color: "#98A2B3", marginTop: 2, opacity: 0.7 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Section 3: Master Node ── */}
      <div className="card animate-fade-in-up" style={{ padding: 16, marginBottom: 12, marginTop: 16 }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: "#98A2B3", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>Master Node</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#10B981", fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />
            Online
          </div>
        </div>

        <div className="mono" style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>DESKTOP-A7X</div>
        <div className="mono" style={{ fontSize: 13, color: "#667085", marginBottom: 12 }}>192.168.1.101</div>

        {/* Inline metrics */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "CPU", val: "78%", pct: 78 },
            { label: "RAM", val: "65%", pct: 65 },
            { label: "Uptime", val: "14h 23m", pct: null },
          ].map(({ label, val, pct }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ fontSize: 10, color: "#98A2B3", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{val}</div>
              {pct !== null && <MiniBar pct={pct} color="#4F6FFF" />}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, fontSize: 12, color: "#667085" }}>
          <Users size={12} />
          5 workers connected
        </div>
      </div>

      {/* ── Section 4: Network Topology ── */}
      <div className="card animate-fade-in-up" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Network</div>
          <div style={{
            fontSize: 11, fontWeight: 700, color: "#10B981",
            border: "1px solid #10B981", borderRadius: 4, padding: "1px 6px",
            animation: "blink 1.4s ease-in-out infinite",
          }}>LIVE</div>
        </div>
        <NetworkTopology />
      </div>

      {/* ── Section 5: Current Job ── */}
      <div className="card animate-fade-in-up" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontSize: 12, color: "#98A2B3", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>Current Job</div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#4F6FFF", background: "#EEF3FF", borderRadius: 20, padding: "2px 8px" }}>Running</span>
        </div>

        <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 12 }}>4K Video Transcoding — Episode 12</div>

        {/* Progress bar */}
        <div style={{ width: "100%", height: 8, borderRadius: 4, background: "#F1F4F9", overflow: "hidden", marginBottom: 6 }}>
          <div className="progress-bar-fill" style={{ width: "67%", height: "100%", background: "#4F6FFF", borderRadius: 4 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: "#667085" }}>67% · ETA 41 min</span>
          <span style={{ fontSize: 13, color: "#667085" }}>2.4 GB/s</span>
        </div>

        {/* Worker avatars */}
        <div style={{ display: "flex", marginBottom: 10 }}>
          {avatarInitials.map((init, i) => (
            <div
              key={i}
              style={{
                width: 24, height: 24, borderRadius: "50%",
                background: avatarColors[i],
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: "#FFFFFF",
                border: "2px solid #FFFFFF",
                marginLeft: i === 0 ? 0 : -6, zIndex: 5 - i,
              }}
            >
              {init}
            </div>
          ))}
        </div>

        {/* Stat pills */}
        <div style={{ display: "flex", gap: 8 }}>
          {["5 Workers", "25 Chunks"].map((label) => (
            <div
              key={label}
              style={{ fontSize: 11, fontWeight: 600, color: "#667085", background: "#F7F9FC", border: "1px solid #E6EAF0", borderRadius: 20, padding: "3px 10px" }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 6: Performance Mini-Charts 2×2 ── */}
      <div className="animate-fade-in-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <ChartCard label="CPU" value="67%" data={cpuData} color="#4F6FFF" />
        <ChartCard label="Memory" value="71%" data={memData} color="#7C5CFC" />
        <ChartCard label="Network" value="142 MB/s" data={netData} color="#10B981" />
        <ChartCard label="Disk I/O" value="54 MB/s" data={diskData} color="#F59E0B" />
      </div>

      {/* ── Section 7: Recent Tasks ── */}
      <div className="card animate-fade-in-up" style={{ padding: 16, marginBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>Recent Tasks</div>
          <span style={{ fontSize: 13, color: "#4F6FFF", cursor: "pointer", fontWeight: 500 }}>View All</span>
        </div>
        <TaskRow name="4K Video Transcoding" status="Running" pct={67} />
        <TaskRow name="ML Model Training" status="Completed" />
        <TaskRow name="OCR Batch Reports" status="Running" pct={89} last />
      </div>

      {/* Bottom clearance for mobile nav */}
      <div style={{ paddingBottom: 96 }} />
    </div>
  );
}
