import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Monitor,
  Cpu,
  MemoryStick,
  Activity,
  Zap,
  HardDrive,
  Users,
  Play,
  Pause,
  XCircle,
  ArrowRight,
  RefreshCw,
  Sliders,
  Sparkles,
  Bot,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { useToast } from "../components/Toast";

// ─── Chart Data with Vibrant Solar Orange Curves ─────────────────────────────
const computeLoadData = [
  { v: 62 }, { v: 68 }, { v: 75 }, { v: 72 }, { v: 84 }, { v: 80 }, { v: 78 },
  { v: 82 }, { v: 76 }, { v: 68 }, { v: 70 }, { v: 62 }, { v: 54 }, { v: 58 },
  { v: 64 }, { v: 66 }, { v: 70 }, { v: 74 }, { v: 80 }, { v: 84 },
];

const memoryMeshData = [
  { v: 70 }, { v: 72 }, { v: 75 }, { v: 78 }, { v: 80 }, { v: 79 }, { v: 76 },
  { v: 78 }, { v: 74 }, { v: 72 }, { v: 73 }, { v: 70 }, { v: 68 }, { v: 65 },
  { v: 68 }, { v: 71 }, { v: 74 }, { v: 76 }, { v: 78 }, { v: 76 },
];

const p2pTrafficData = [
  { v: 55 }, { v: 68 }, { v: 78 }, { v: 84 }, { v: 90 }, { v: 88 }, { v: 82 },
  { v: 76 }, { v: 68 }, { v: 60 }, { v: 52 }, { v: 48 }, { v: 55 }, { v: 64 },
  { v: 60 }, { v: 68 }, { v: 72 }, { v: 80 }, { v: 86 }, { v: 90 },
];

const diskThroughputData = [
  { v: 40 }, { v: 48 }, { v: 56 }, { v: 65 }, { v: 68 }, { v: 66 }, { v: 62 },
  { v: 58 }, { v: 52 }, { v: 46 }, { v: 44 }, { v: 40 }, { v: 45 }, { v: 48 },
  { v: 50 }, { v: 54 }, { v: 58 }, { v: 60 }, { v: 58 }, { v: 55 },
];

// ─── Mini Area Chart Component ───────────────────────────────────────────────
function OrangeMetricCard({
  label,
  value,
  data,
}: {
  label: string;
  value: string;
  data: { v: number }[];
}) {
  return (
    <div
      style={{
        backgroundColor: "#18191E",
        border: "1px solid #24262E",
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 140,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#8E929E",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF" }}>
          {value}
        </div>
      </div>

      <div style={{ height: 54, width: "100%", marginTop: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`orangeGrad-${label.replace(/\s+/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF7A00" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#FF7A00" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="#FF7A00"
              strokeWidth={2}
              fill={`url(#orangeGrad-${label.replace(/\s+/g, "")})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Interactive Mesh Topology (Image 2) ──────────────────────────────────────
function MeshTopology({ onSelectWorker }: { onSelectWorker: (name: string) => void }) {
  const master = { x: 300, y: 190 };
  const nodes = [
    { name: "Laptop",  x: 180, y: 110, r: 24, stroke: "#32353E", fill: "#18191E", type: "idle",   active: false },
    { name: "PC",      x: 300, y: 80,  r: 24, stroke: "#32353E", fill: "#18191E", type: "idle",   active: false },
    { name: "Mac",     x: 440, y: 110, r: 24, stroke: "#FF7A00", fill: "#24160E", type: "online", active: true },
    { name: "RPi",     x: 480, y: 230, r: 20, stroke: "#32353E", fill: "#18191E", type: "idle",   active: false },
    { name: "Android", x: 420, y: 310, r: 22, stroke: "#FF7A00", fill: "#24160E", type: "busy",   active: true },
    { name: "Tablet",  x: 190, y: 310, r: 20, stroke: "#32353E", fill: "#18191E", type: "idle",   active: false },
    { name: "NAS",     x: 130, y: 220, r: 22, stroke: "#EF4444", fill: "#2A1414", type: "offline",active: false },
  ];

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#18191E",
        border: "1px solid #24262E",
        borderRadius: 16,
        padding: "20px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>
          Mesh Topology
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#FF7A00",
            backgroundColor: "rgba(255, 122, 0, 0.15)",
            border: "1px solid rgba(255, 122, 0, 0.4)",
            borderRadius: 6,
            padding: "3px 8px",
            letterSpacing: "0.06em",
          }}
        >
          LIVE SYNC
        </span>
      </div>

      <div style={{ width: "100%", maxWidth: 620, margin: "0 auto" }}>
        <svg viewBox="0 0 600 380" style={{ width: "100%", height: "auto", display: "block" }}>
          {/* Background connection rays */}
          {nodes.map((node, i) => (
            <line
              key={`conn-${i}`}
              x1={master.x}
              y1={master.y}
              x2={node.x}
              y2={node.y}
              stroke={node.active ? "#FF7A00" : "#282A32"}
              strokeWidth={node.active ? 2.5 : 1.5}
              strokeDasharray={node.active ? "6 6" : "none"}
              opacity={node.active ? 0.9 : 0.4}
            />
          ))}

          {/* Peripheral Nodes */}
          {nodes.map((node) => (
            <g
              key={node.name}
              onClick={() => onSelectWorker(node.name)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                stroke={node.stroke}
                strokeWidth={node.active ? 3 : 2}
                fill={node.fill}
              />
              <text
                x={node.x}
                y={node.y + node.r + 18}
                textAnchor="middle"
                fill="#CBD5E1"
                fontSize="14"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                {node.name}
              </text>
            </g>
          ))}

          {/* Central Master Node "M" with Radiant Orange Glow */}
          <circle
            cx={master.x}
            cy={master.y}
            r="48"
            fill="rgba(255, 122, 0, 0.18)"
          />
          <circle
            cx={master.x}
            cy={master.y}
            r="34"
            fill="url(#masterGrad)"
            stroke="#FF8A00"
            strokeWidth="3"
            style={{ filter: "drop-shadow(0 0 16px rgba(255, 122, 0, 0.6))" }}
          />
          <defs>
            <radialGradient id="masterGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFA033" />
              <stop offset="100%" stopColor="#FF5500" />
            </radialGradient>
          </defs>
          <text
            x={master.x}
            y={master.y + 9}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="26"
            fontWeight="900"
            fontFamily="system-ui, sans-serif"
          >
            M
          </text>
        </svg>
      </div>
    </div>
  );
}

// ─── Main Dashboard Page Component ───────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [jobStatus, setJobStatus] = useState<"running" | "paused">("running");
  const [jobProgress, setJobProgress] = useState(67);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Poll job progress
  useEffect(() => {
    const timer = setInterval(() => {
      if (jobStatus === "running") {
        setJobProgress((prev) => (prev >= 99 ? 67 : prev + 1));
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [jobStatus]);

  const handleToggleJob = () => {
    if (jobStatus === "running") {
      setJobStatus("paused");
      showToast({ type: "info", message: "Paused job: 4K Video Transcoding" });
    } else {
      setJobStatus("running");
      showToast({ type: "success", message: "Resumed job: 4K Video Transcoding" });
    }
  };

  const handleAbortJob = () => {
    showToast({ type: "warning", message: "Job aborted and chunks cleared." });
    setJobProgress(0);
    setJobStatus("paused");
  };

  return (
    <div style={{ padding: "20px 24px", maxWidth: 1400, margin: "0 auto" }}>
      {/* ── Section 0: Gemini AI Grid Copilot Banner ── */}
      <div
        className="bg-gradient-to-r from-[#181922] via-[#1A1C24] to-[#16171E] border border-[#2B2D38] hover:border-[#FF7A00]/40 transition-all rounded-2xl p-4 mb-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-black/30"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF4500]/10 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00] flex-shrink-0 shadow-[0_0_15px_rgba(255,122,0,0.25)]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Gemini Grid Copilot
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active Grounding
              </span>
            </div>
            <p className="text-xs text-[#9DA2B0] mt-0.5">
              Analyzing 8 edge nodes • Wi-Fi cloudlet latency optimal (8-14ms) • 0 packet drops
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => {
              const btn = document.getElementById("gemini-agent-toggle-btn");
              if (btn) btn.click();
            }}
            className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#FF7A00]/25 cursor-pointer"
          >
            <Bot size={14} />
            <span>Consult AI Agent</span>
          </button>
        </div>
      </div>

      {/* ── Section 1: CURRENT JOB Card (Image 1) ── */}
      <div
        style={{
          backgroundColor: "#18191E",
          border: "1px solid #282A32",
          borderRadius: 16,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8E929E", letterSpacing: "0.08em" }}>
            CURRENT JOB
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                backgroundColor: "#FF7A00",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 700,
                padding: "3px 12px",
                borderRadius: 20,
                boxShadow: "0 0 10px rgba(255, 122, 0, 0.4)",
              }}
            >
              {jobStatus === "running" ? "Processing" : "Paused"}
            </span>

            <button
              onClick={handleToggleJob}
              style={{
                background: "none",
                border: "1px solid #282A32",
                borderRadius: 8,
                padding: "4px 10px",
                color: "#CBD5E1",
                cursor: "pointer",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {jobStatus === "running" ? <Pause size={13} /> : <Play size={13} />}
              {jobStatus === "running" ? "Pause" : "Resume"}
            </button>

            <button
              onClick={handleAbortJob}
              style={{
                background: "none",
                border: "1px solid #282A32",
                borderRadius: 8,
                padding: "4px 8px",
                color: "#EF4444",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              <XCircle size={14} />
            </button>
          </div>
        </div>

        <div style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", marginBottom: 14 }}>
          4K Video Transcoding — Episode 12
        </div>

        {/* Glowing Orange Progress Bar */}
        <div
          style={{
            height: 8,
            backgroundColor: "#141519",
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: `${jobProgress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #FF8A00 0%, #FF5500 100%)",
              boxShadow: "0 0 12px rgba(255, 122, 0, 0.6)",
              borderRadius: 6,
              transition: "width 0.4s ease",
            }}
          />
        </div>

        {/* ETA & Speed */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: "#CBD5E1", fontWeight: 500 }}>
            {jobProgress}% • ETA 41 min
          </span>
          <span style={{ fontSize: 13, color: "#CBD5E1", fontWeight: 700 }}>
            2.4 GB/s
          </span>
        </div>

        {/* Metadata Badges */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["5 Workers", "25 Chunks", "GPU Accelerated"].map((tag) => (
            <span
              key={tag}
              style={{
                backgroundColor: "#20222A",
                border: "1px solid #2E313C",
                color: "#CBD5E1",
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 8,
                padding: "4px 12px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Section 2: 4 Telemetry Mini-Charts (Image 1) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <OrangeMetricCard label="COMPUTE LOAD" value="84%" data={computeLoadData} />
        <OrangeMetricCard label="MEMORY MESH" value="76%" data={memoryMeshData} />
        <OrangeMetricCard label="P2P TRAFFIC" value="90 MB/s" data={p2pTrafficData} />
        <OrangeMetricCard label="DISK THROUGHPUT" value="55 MB/s" data={diskThroughputData} />
      </div>

      {/* ── Section 3: Grid Monitor & Master Node (Image 3) ── */}
      <div
        style={{
          backgroundColor: "#18191E",
          border: "1px solid #24262E",
          borderRadius: 16,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF", margin: "0 0 4px" }}>
              Grid Monitor
            </h2>
            <div style={{ fontSize: 13, color: "#8E929E" }}>
              Cluster Telemetry & Workload Overview
            </div>
          </div>
          <span
            style={{
              backgroundColor: "rgba(255, 122, 0, 0.15)",
              color: "#FF7A00",
              border: "1px solid rgba(255, 122, 0, 0.35)",
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF7A00", boxShadow: "0 0 6px #FF7A00" }} />
            Live Grid Online
          </span>
        </div>

        {/* 6 Grid Metric Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            { label: "Connected Devices", val: "8", sub: "7 online", icon: Monitor },
            { label: "CPU Cores", val: "48", sub: "3.2 GHz avg", icon: Cpu },
            { label: "Available RAM", val: "124 GB", sub: "of 192 GB", icon: MemoryStick },
            { label: "Running Tasks", val: "0", sub: "0 queued", icon: Activity },
            { label: "Processing", val: "2.4 GH/s", sub: "peak 3.1", icon: Zap },
            { label: "Storage", val: "247 GB", sub: "512 GB total", icon: HardDrive },
          ].map(({ label, val, sub, icon: Icon }) => (
            <div
              key={label}
              style={{
                backgroundColor: "#141519",
                border: "1px solid #24262E",
                borderRadius: 12,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  backgroundColor: "rgba(255, 122, 0, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FF7A00",
                  marginBottom: 8,
                }}
              >
                <Icon size={16} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1 }}>
                {val}
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#CBD5E1", marginTop: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: 11, color: "#8E929E", marginTop: 2 }}>
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* Master Node Banner Card */}
        <div
          style={{
            backgroundColor: "#141519",
            border: "1px solid #282A32",
            borderRadius: 12,
            padding: 18,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#8E929E", letterSpacing: "0.08em" }}>
              MASTER NODE
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#FF7A00", fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF7A00" }} />
              Active Controller
            </div>
          </div>

          <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", marginBottom: 2 }}>
            DESKTOP-A7X
          </div>
          <div style={{ fontSize: 13, color: "#8E929E", marginBottom: 14 }}>
            192.168.1.101 • Port 3001
          </div>

          <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: "#8E929E", fontWeight: 600 }}>CPU UTILIZATION</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>78%</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#8E929E", fontWeight: 600 }}>RAM ALLOCATION</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>65%</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#8E929E", fontWeight: 600 }}>CLUSTER UPTIME</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>14h 23m</div>
            </div>
          </div>

          <div style={{ fontSize: 12, color: "#CBD5E1", display: "flex", alignItems: "center", gap: 6 }}>
            <Users size={14} color="#FF7A00" />
            <span>5 Active Worker Nodes Offloading Tasks</span>
          </div>
        </div>
      </div>

      {/* ── Section 4: Interactive Mesh Topology (Image 2) ── */}
      <div style={{ marginBottom: 20 }}>
        <MeshTopology onSelectWorker={(workerName) => setSelectedNode(workerName)} />
      </div>

      {/* ── Section 5: Recent Tasks (Image 1) ── */}
      <div
        style={{
          backgroundColor: "#18191E",
          border: "1px solid #24262E",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>
            Recent Tasks
          </span>
          <button
            onClick={() => navigate("/tasks")}
            style={{
              background: "none",
              border: "none",
              color: "#FF7A00",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            View All →
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { name: "4K Video Transcoding", status: "Running", pct: 67, speed: "2.4 GB/s" },
            { name: "Federated Sensor Aggregate #41", status: "Completed", pct: 100, speed: "1.8 GB/s" },
            { name: "OCR Batch Processing Q3", status: "Completed", pct: 100, speed: "3.1 GB/s" },
          ].map((task) => (
            <div
              key={task.name}
              onClick={() => navigate("/tasks")}
              style={{
                backgroundColor: "#141519",
                border: "1px solid #24262E",
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "border-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#FF7A00")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#24262E")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: "rgba(255, 122, 0, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FF7A00",
                  }}
                >
                  <Activity size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>
                    {task.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span
                      style={{
                        backgroundColor: task.status === "Running" ? "rgba(255, 122, 0, 0.18)" : "rgba(16, 185, 129, 0.18)",
                        color: task.status === "Running" ? "#FF7A00" : "#10B981",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 12,
                      }}
                    >
                      {task.status}
                    </span>
                    <span style={{ fontSize: 12, color: "#8E929E" }}>{task.speed}</span>
                  </div>
                </div>
              </div>

              <div style={{ width: 100, textAlign: "right" }}>
                <div
                  style={{
                    height: 5,
                    backgroundColor: "#20222A",
                    borderRadius: 3,
                    overflow: "hidden",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      width: `${task.pct}%`,
                      height: "100%",
                      backgroundColor: task.status === "Running" ? "#FF7A00" : "#10B981",
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, color: "#8E929E" }}>{task.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node Inspection Modal */}
      {selectedNode && (
        <div className="modal-backdrop" onClick={() => setSelectedNode(null)}>
          <div className="modal-content animate-fade-in-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", marginBottom: 8 }}>
              {selectedNode} Node Details
            </div>
            <div style={{ fontSize: 13, color: "#8E929E", marginBottom: 16 }}>
              Worker status on local cluster mesh
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#CBD5E1", fontSize: 13 }}>
                <span>Status:</span>
                <span style={{ color: "#10B981", fontWeight: 600 }}>Active Online</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#CBD5E1", fontSize: 13 }}>
                <span>Latency:</span>
                <span>2ms roundtrip</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#CBD5E1", fontSize: 13 }}>
                <span>Assigned Tasks:</span>
                <span>2 active chunks</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="btn-secondary" onClick={() => setSelectedNode(null)}>
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setSelectedNode(null);
                  navigate("/devices");
                }}
              >
                Manage Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
