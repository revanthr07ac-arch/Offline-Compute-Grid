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

  const [recentTasks, setRecentTasks] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("ocg_tasks");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 4).map((t) => ({
            id: t.id,
            name: t.name,
            status: t.status === "running" ? "Running" : t.status === "completed" ? "Completed" : t.status === "pending" ? "Pending" : "Failed",
            pct: t.progress,
            speed: t.eta || "2.4 GB/s",
          }));
        }
      }
    } catch {}
    return [
      { id: "t1", name: "4K Video Transcoding", status: "Running", pct: 67, speed: "2.4 GB/s" },
      { id: "t2", name: "Federated Sensor Aggregate #41", status: "Completed", pct: 100, speed: "1.8 GB/s" },
      { id: "t3", name: "OCR Batch Processing Q3", status: "Completed", pct: 100, speed: "3.1 GB/s" },
    ];
  });

  // Sync tasks on storage changes
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem("ocg_tasks");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRecentTasks(
              parsed.slice(0, 4).map((t) => ({
                id: t.id,
                name: t.name,
                status: t.status === "running" ? "Running" : t.status === "completed" ? "Completed" : t.status === "pending" ? "Pending" : "Failed",
                pct: t.progress,
                speed: t.eta || "2.4 GB/s",
              }))
            );
          }
        }
      } catch {}
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

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
    <div className="px-3.5 sm:px-6 py-4 sm:py-6 max-w-7xl mx-auto space-y-5">
      {/* ── Section 0: Gemini AI Grid Copilot Banner ── */}
      <div
        className="bg-gradient-to-r from-[#181922] via-[#1A1C24] to-[#16171E] border border-[#2B2D38] hover:border-[#FF7A00]/40 transition-all rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-black/30"
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

      {/* ── Section 1: CURRENT JOB Card ── */}
      <div
        className="bg-[#18191E] border border-[#282A32] rounded-2xl p-4 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
          <div className="text-[11px] font-bold text-[#8E929E] tracking-wider uppercase">
            CURRENT JOB
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className="bg-[#FF7A00] text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(255,122,0,0.4)]"
            >
              {jobStatus === "running" ? "Processing" : "Paused"}
            </span>

            <button
              onClick={handleToggleJob}
              className="border border-[#282A32] hover:border-[#FF7A00] rounded-lg px-2.5 py-1 text-slate-300 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {jobStatus === "running" ? <Pause size={13} /> : <Play size={13} />}
              {jobStatus === "running" ? "Pause" : "Resume"}
            </button>

            <button
              onClick={handleAbortJob}
              title="Abort Job"
              className="border border-[#282A32] hover:border-red-500 rounded-lg p-1.5 text-red-500 text-xs cursor-pointer transition-colors"
            >
              <XCircle size={14} />
            </button>
          </div>
        </div>

        <div className="text-base sm:text-lg font-bold text-white mb-3">
          4K Video Transcoding — Episode 12
        </div>

        {/* Glowing Orange Progress Bar */}
        <div className="h-2 bg-[#141519] rounded-md overflow-hidden mb-2.5">
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
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300 font-medium mb-3.5">
          <span>{jobProgress}% • ETA 41 min</span>
          <span className="font-bold text-white">2.4 GB/s</span>
        </div>

        {/* Metadata Badges */}
        <div className="flex gap-2 flex-wrap">
          {["5 Workers", "25 Chunks", "GPU Accelerated"].map((tag) => (
            <span
              key={tag}
              className="bg-[#20222A] border border-[#2E313C] text-slate-300 text-xs font-semibold rounded-lg px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Section 2: 4 Telemetry Mini-Charts ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <OrangeMetricCard label="COMPUTE LOAD" value="84%" data={computeLoadData} />
        <OrangeMetricCard label="MEMORY MESH" value="76%" data={memoryMeshData} />
        <OrangeMetricCard label="P2P TRAFFIC" value="90 MB/s" data={p2pTrafficData} />
        <OrangeMetricCard label="DISK THROUGHPUT" value="55 MB/s" data={diskThroughputData} />
      </div>

      {/* ── Section 3: Grid Monitor & Master Node ── */}
      <div className="bg-[#18191E] border border-[#24262E] rounded-2xl p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-0.5">
              Grid Monitor
            </h2>
            <div className="text-xs sm:text-sm text-[#8E929E]">
              Cluster Telemetry & Workload Overview
            </div>
          </div>
          <span
            className="bg-[rgba(255,122,0,0.15)] text-[#FF7A00] border border-[rgba(255,122,0,0.35)] rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] shadow-[0_0_6px_#FF7A00]" />
            Live Grid Online
          </span>
        </div>

        {/* 6 Grid Metric Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-5">
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
              className="bg-[#141519] border border-[#24262E] rounded-xl p-3 sm:p-3.5 flex flex-col justify-between"
            >
              <div className="w-7 h-7 rounded-lg bg-[rgba(255,122,0,0.12)] flex items-center justify-center text-[#FF7A00] mb-2">
                <Icon size={15} />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-white leading-tight">
                  {val}
                </div>
                <div className="text-[11px] font-medium text-slate-300 mt-1 line-clamp-1">
                  {label}
                </div>
                <div className="text-[10px] text-[#8E929E] mt-0.5">
                  {sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Master Node Banner Card */}
        <div className="bg-[#141519] border border-[#282A32] rounded-xl p-4 sm:p-4.5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[11px] font-bold text-[#8E929E] tracking-wider uppercase">
              MASTER NODE
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#FF7A00] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
              Active Controller
            </div>
          </div>

          <div className="text-base font-bold text-white mb-0.5">
            DESKTOP-A7X
          </div>
          <div className="text-xs text-[#8E929E] mb-3">
            192.168.1.101 • Port 3001
          </div>

          <div className="flex gap-4 sm:gap-7 flex-wrap mb-3">
            <div>
              <div className="text-[10px] text-[#8E929E] font-semibold">CPU UTILIZATION</div>
              <div className="text-sm sm:text-base font-bold text-white">78%</div>
            </div>
            <div>
              <div className="text-[10px] text-[#8E929E] font-semibold">RAM ALLOCATION</div>
              <div className="text-sm sm:text-base font-bold text-white">65%</div>
            </div>
            <div>
              <div className="text-[10px] text-[#8E929E] font-semibold">CLUSTER UPTIME</div>
              <div className="text-sm sm:text-base font-bold text-white">14h 23m</div>
            </div>
          </div>

          <div className="text-xs text-slate-300 flex items-center gap-2">
            <Users size={14} className="text-[#FF7A00]" />
            <span>5 Active Worker Nodes Offloading Tasks</span>
          </div>
        </div>
      </div>

      {/* ── Section 4: Interactive Mesh Topology ── */}
      <div>
        <MeshTopology onSelectWorker={(workerName) => setSelectedNode(workerName)} />
      </div>

      {/* ── Section 5: Recent Tasks ── */}
      <div className="bg-[#18191E] border border-[#24262E] rounded-2xl p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-base sm:text-lg font-bold text-white">
            Recent Tasks
          </span>
          <button
            onClick={() => navigate("/tasks")}
            className="text-xs sm:text-sm font-semibold text-[#FF7A00] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {recentTasks.map((task) => (
            <div
              key={task.id || task.name}
              onClick={() => navigate("/tasks")}
              className="bg-[#141519] border border-[#24262E] hover:border-[#FF7A00] rounded-xl p-3 sm:p-4 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[rgba(255,122,0,0.12)] flex items-center justify-center text-[#FF7A00] flex-shrink-0">
                  <Activity size={17} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-white truncate">
                    {task.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        task.status === "Running"
                          ? "bg-[rgba(255,122,0,0.18)] text-[#FF7A00]"
                          : task.status === "Completed"
                          ? "bg-[rgba(16,185,129,0.18)] text-[#10B981]"
                          : "bg-[#282A32] text-[#8E929E]"
                      }`}
                    >
                      {task.status}
                    </span>
                    <span className="text-[11px] text-[#8E929E] truncate">{task.speed}</span>
                  </div>
                </div>
              </div>

              <div className="w-20 sm:w-24 text-right flex-shrink-0 ml-3">
                <div className="h-1.5 bg-[#20222A] rounded-full overflow-hidden mb-1">
                  <div
                    style={{
                      width: `${task.pct}%`,
                      height: "100%",
                      backgroundColor: task.status === "Running" ? "#FF7A00" : "#10B981",
                    }}
                  />
                </div>
                <span className="text-[11px] text-[#8E929E] font-mono">{task.pct}%</span>
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
