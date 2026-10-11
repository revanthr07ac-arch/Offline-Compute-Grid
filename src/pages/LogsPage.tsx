import { useState, useEffect, useRef } from "react";
import { Search, Download, Trash2, X, Terminal, Pause, Play, CheckCircle2, RefreshCw } from "lucide-react";
import { useToast } from "../components/Toast";

type LogLevel = "ALL" | "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "DEBUG";

interface LogEntry {
  id: number;
  ts: string;
  level: Exclude<LogLevel, "ALL">;
  worker: string;
  message: string;
}

function makeTs() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const ms = String(now.getMilliseconds()).padStart(3, "0");
  return `${h}:${m}:${s}.${ms}`;
}

const WORKERS = ["master-a7x", "mac-studio", "rtx-worker", "laptop-dev", "rpi4-node", "net-scan"];

const LIVE_POOL: Array<{ level: Exclude<LogLevel, "ALL">; message: string }> = [
  { level: "INFO", message: "Cluster heartbeat received from mac-studio via P2P link" },
  { level: "SUCCESS", message: "Task 4K_video_transcode chunk #26 verified sha256:88fa..." },
  { level: "DEBUG", message: "Worker memory telemetry sampled: 67.2% VRAM utilized" },
  { level: "WARNING", message: "P2P network jitter detected on rpi4-node (latency 120ms)" },
  { level: "INFO", message: "Chunk cache synchronized across 5 online worker nodes" },
  { level: "SUCCESS", message: "Master state checkpoint saved to local SQLite DB" },
  { level: "DEBUG", message: "Scheduler load balancer: GPU variance 12% — within optimal range" },
];

const INITIAL_LOGS: LogEntry[] = [
  { id: 1, ts: "14:20:00.001", level: "INFO", worker: "master-a7x", message: "Grid engine initialized — 8 worker slots online" },
  { id: 2, ts: "14:20:00.142", level: "INFO", worker: "scheduler", message: "Decentralized task queue opened on port 3001" },
  { id: 3, ts: "14:20:01.203", level: "SUCCESS", worker: "mac-studio", message: "Node registered: Apple M2 Max (12 cores, 64 GB unified)" },
  { id: 4, ts: "14:20:01.344", level: "SUCCESS", worker: "rtx-worker", message: "Node registered: RTX 4090 (24 GB VRAM, CUDA 12.4)" },
  { id: 5, ts: "14:20:01.500", level: "SUCCESS", worker: "laptop-dev", message: "Node registered: Laptop-Dev (8 cores, 16 GB)" },
  { id: 6, ts: "14:20:02.010", level: "INFO", worker: "scheduler", message: "Auto-discovery broadcasted UDP beacon to 192.168.1.255" },
  { id: 7, ts: "14:20:03.512", level: "INFO", worker: "net-scan", message: "Subnet topology map built — 0 NAT traversal errors" },
  { id: 8, ts: "14:20:05.103", level: "INFO", worker: "master-a7x", message: "Task submitted: 4K Video Transcoding — Episode 12 (Priority: HIGH)" },
  { id: 9, ts: "14:20:05.200", level: "INFO", worker: "scheduler", message: "Partitioned video into 38 chunk segments of 250 MB each" },
  { id: 10, ts: "14:20:05.340", level: "SUCCESS", worker: "mac-studio", message: "Chunk #01 dispatched via zero-copy DMA memory bridge" },
  { id: 11, ts: "14:20:10.001", level: "INFO", worker: "rtx-worker", message: "CUDA hardware encoder initialized: NVENC H.265 slow preset" },
  { id: 12, ts: "14:20:16.280", level: "WARNING", worker: "rpi4-node", message: "Thermal sensor warning: Core temperature 74°C" },
  { id: 13, ts: "14:20:20.003", level: "SUCCESS", worker: "mac-studio", message: "Chunk #01 encode completed — 98.4 MB output written to NVMe" },
  { id: 14, ts: "14:20:25.001", level: "INFO", worker: "scheduler", message: "Aggregate cluster throughput: 2.4 GB/s across active workers" },
  { id: 15, ts: "14:20:30.000", level: "DEBUG", worker: "master-a7x", message: "Sync heartbeat acknowledged by all nodes: latency 1ms" },
];

const LEVEL_COLORS: Record<string, { text: string; bg: string; dot: string }> = {
  INFO: { text: "#38BDF8", bg: "rgba(56,189,248,0.12)", dot: "#38BDF8" },
  SUCCESS: { text: "#10B981", bg: "rgba(16,185,129,0.12)", dot: "#10B981" },
  WARNING: { text: "#FF7A00", bg: "rgba(255,122,0,0.15)", dot: "#FF7A00" },
  ERROR: { text: "#EF4444", bg: "rgba(239,68,68,0.15)", dot: "#EF4444" },
  DEBUG: { text: "#8E929E", bg: "rgba(142,146,158,0.12)", dot: "#8E929E" },
};

export default function LogsPage() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [activeLevel, setActiveLevel] = useState<LogLevel>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Live log simulation
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const template = LIVE_POOL[Math.floor(Math.random() * LIVE_POOL.length)];
      const worker = WORKERS[Math.floor(Math.random() * WORKERS.length)];
      const newEntry: LogEntry = {
        id: Date.now() + Math.random(),
        ts: makeTs(),
        level: template.level,
        worker,
        message: template.message,
      };
      setLogs((prev) => [...prev.slice(-150), newEntry]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isLive]);

  // Autoscroll
  useEffect(() => {
    if (autoScroll) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = activeLevel === "ALL" || log.level === activeLevel;
    const matchesSearch =
      searchQuery === "" ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.worker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleDownload = () => {
    const content = filteredLogs
      .map((l) => `[${l.ts}] [${l.level.padEnd(7)}] [${l.worker}] ${l.message}`)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `offline_compute_grid_${Date.now()}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast({ type: "success", message: `Downloaded ${filteredLogs.length} log lines.` });
  };

  const handleClear = () => {
    setLogs([]);
    showToast({ type: "info", message: "Terminal buffer cleared." });
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] pb-24 flex flex-col">
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 bg-[#111217]/95 backdrop-blur-md border-b border-[#24262E] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-[#FF7A00]" />
          <h1 className="text-base font-bold text-[#FFFFFF]">Cluster System Logs</h1>
          <span className="px-2 py-0.5 rounded-full bg-[#18191E] border border-[#282A32] text-[11px] font-mono text-[#8E929E]">
            {filteredLogs.length} events
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Stream Toggle */}
          <button
            onClick={() => {
              setIsLive(!isLive);
              showToast({
                type: isLive ? "warning" : "success",
                message: isLive ? "Live logging paused." : "Live logging resumed.",
              });
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLive
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : "bg-[#18191E] border-[#282A32] text-[#8E929E]"
            }`}
          >
            {isLive ? <Pause size={13} /> : <Play size={13} />}
            <span>{isLive ? "Live Stream" : "Paused"}</span>
          </button>

          {/* Download Logs */}
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-[#FF7A00] hover:bg-[#20222A] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={14} /> Export
          </button>

          {/* Clear Buffer */}
          <button
            onClick={handleClear}
            className="p-2 rounded-xl bg-[#18191E] border border-[#282A32] text-xs text-[#8E929E] hover:text-red-400 transition-colors cursor-pointer"
            title="Clear buffer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111217] border-b border-[#24262E] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E929E]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by worker, keyword, or opcode..."
            className="w-full h-8.5 bg-[#18191E] border border-[#282A32] rounded-xl pl-9 pr-3 text-xs text-white placeholder-[#667085] focus:outline-none focus:border-[#FF7A00]"
          />
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {(["ALL", "INFO", "SUCCESS", "WARNING", "ERROR", "DEBUG"] as LogLevel[]).map((lvl) => {
            const isActive = activeLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FF7A00] text-black shadow-sm"
                    : "bg-[#18191E] border border-[#282A32] text-[#8E929E] hover:text-white"
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-2 text-xs text-[#8E929E] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="accent-[#FF7A00]"
          />
          Auto-scroll
        </label>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 bg-[#090A0D] p-4 overflow-y-auto font-mono text-xs leading-relaxed space-y-1">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-[#8E929E]">
            No log entries match the current filter criteria.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const cfg = LEVEL_COLORS[log.level] || LEVEL_COLORS.INFO;
            return (
              <div
                key={log.id}
                className="flex items-start gap-2.5 px-2 py-1 rounded-lg hover:bg-[#14151B] transition-colors"
              >
                <span className="text-[#667085] text-[11px] select-none flex-shrink-0 pt-0.5">
                  {log.ts}
                </span>

                <span
                  className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
                  style={{ background: cfg.bg, color: cfg.text }}
                >
                  {log.level}
                </span>

                <span className="text-[#FF7A00] font-semibold flex-shrink-0 truncate max-w-[120px]">
                  [{log.worker}]
                </span>

                <span className="text-[#E5E7EB] break-all">{log.message}</span>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
