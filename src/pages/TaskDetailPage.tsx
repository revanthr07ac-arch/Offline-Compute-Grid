import React, { useState } from "react";
import {
  ChevronLeft,
  PauseCircle,
  PlayCircle,
  XCircle,
  Download,
  FileText,
  Server,
  Cpu,
  Layers,
  Clock,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Share2
} from "lucide-react";
import { useToast } from "../components/Toast";

interface TaskData {
  id: string;
  name: string;
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  progress: number;
  eta: string;
  workers: number;
  size: string;
  by: string;
  status: "running" | "pending" | "completed" | "failed" | "cancelled";
  speed: string;
  chunks: string;
  errors: number;
  inputPath: string;
  outputPath: string;
  created: string;
}

const TASK_MAP: Record<string, TaskData> = {
  t1: {
    id: "t1",
    name: "4K Video Transcoding — Episode 12",
    type: "FFmpeg H.265 / NVENC",
    priority: "high",
    progress: 67,
    eta: "41 min",
    workers: 5,
    size: "8.4 GB",
    by: "REVANTH R",
    status: "running",
    speed: "2.4 GB/s",
    chunks: "25/38",
    errors: 0,
    inputPath: "/mnt/nas/videos/episode-12-raw.mkv",
    outputPath: "/mnt/nas/output/episode-12-4k.mp4",
    created: "2026-10-11 14:15",
  },
  t2: {
    id: "t2",
    name: "ML Model Training — ResNet50 Mesh",
    type: "PyTorch DDP",
    priority: "critical",
    progress: 34,
    eta: "2h 15m",
    workers: 4,
    size: "2.1 GB",
    by: "monk av",
    status: "running",
    speed: "0.8 GB/s",
    chunks: "12/35",
    errors: 0,
    inputPath: "/mnt/data/datasets/imagenet-subset",
    outputPath: "/mnt/models/resnet50-v3.pt",
    created: "2026-10-11 13:00",
  },
  t3: {
    id: "t3",
    name: "Document OCR Batch — Q4 Scans",
    type: "Tesseract OCR",
    priority: "medium",
    progress: 89,
    eta: "8 min",
    workers: 3,
    size: "450 MB",
    by: "REVANTH POOJARY",
    status: "running",
    speed: "0.3 GB/s",
    chunks: "34/38",
    errors: 1,
    inputPath: "/mnt/docs/q4-scans/",
    outputPath: "/mnt/docs/q4-ocr-output/",
    created: "2026-10-11 15:30",
  },
};

const DEFAULT_TASK: TaskData = TASK_MAP["t1"];

const INITIAL_WORKERS = [
  { name: "DESKTOP-A7X (Master)", ip: "192.168.1.101", contrib: 35, role: "Controller & Coordinator" },
  { name: "Mac-Studio", ip: "192.168.1.108", contrib: 28, role: "Metal GPU Compute" },
  { name: "Worker-Rig-RTX", ip: "192.168.1.110", contrib: 22, role: "CUDA Kernel Worker" },
  { name: "Laptop-Dev", ip: "192.168.1.104", contrib: 15, role: "Chunk Pre-fetch" },
  { name: "RPi-4 Node A", ip: "192.168.1.105", contrib: 0, role: "Telemetry Monitor" },
];

const INITIAL_LOGS = [
  { level: "INFO", time: "16:42:01", text: "Chunk 25 dispatched to Mac-Studio (Metal GPU acceleration enabled)" },
  { level: "INFO", time: "16:42:08", text: "Chunk 24 completed successfully — 99.8 MB output written to NVMe cache" },
  { level: "WARN", time: "16:42:15", text: "Worker-Rig-RTX memory utilization peaked at 88% — throttling chunk batch" },
  { level: "INFO", time: "16:42:24", text: "P2P direct sync handshake acknowledged between DESKTOP-A7X and Mac-Studio" },
  { level: "SUCCESS", time: "16:42:30", text: "Chunk 23 integrity checksum verified: sha256:7c98b..." },
];

interface TaskDetailPageProps {
  taskId: string;
  onBack: () => void;
}

export default function TaskDetailPage({ taskId, onBack }: TaskDetailPageProps) {
  const { showToast } = useToast();

  const [task, setTask] = useState<TaskData>(() => {
    try {
      const saved = localStorage.getItem("ocg_tasks");
      if (saved) {
        const parsed = JSON.parse(saved);
        const found = parsed.find((t: any) => t.id === taskId);
        if (found) {
          return {
            ...DEFAULT_TASK,
            ...found,
            speed: found.speed || "1.8 GB/s",
            chunks: found.chunks || "12/25",
            errors: found.errors || 0,
            inputPath: found.inputPath || "/mnt/grid/payload.bin",
            outputPath: found.outputPath || "/mnt/grid/output.out",
            created: found.created || "Just now",
          };
        }
      }
    } catch {}

    return TASK_MAP[taskId] || {
      ...DEFAULT_TASK,
      id: taskId,
      name: `Task #${taskId.toUpperCase()}`,
    };
  });

  const [isPaused, setIsPaused] = useState(task.status !== "running");
  const [logs, setLogs] = useState(INITIAL_LOGS);

  const handleTogglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      setTask((prev) => ({ ...prev, status: "running", eta: "40 min" }));
      setLogs((prev) => [
        { level: "INFO", time: new Date().toLocaleTimeString(), text: "Task execution resumed across active grid nodes." },
        ...prev,
      ]);
      showToast({ type: "success", message: "Task execution resumed." });
    } else {
      setIsPaused(true);
      setTask((prev) => ({ ...prev, status: "pending", eta: "Paused" }));
      setLogs((prev) => [
        { level: "WARN", time: new Date().toLocaleTimeString(), text: "Task execution paused by operator. Snapshots persisted." },
        ...prev,
      ]);
      showToast({ type: "warning", message: "Task execution paused." });
    }
  };

  const handleCancelTask = () => {
    setTask((prev) => ({ ...prev, status: "cancelled", eta: "Aborted" }));
    setIsPaused(true);
    setLogs((prev) => [
      { level: "WARN", time: new Date().toLocaleTimeString(), text: "Task aborted by operator. Temporary cache released." },
      ...prev,
    ]);
    showToast({ type: "info", message: "Task cancelled and worker allocations released." });
  };

  const handleDownloadLogs = () => {
    const logContent = logs.map((l) => `[${l.time}] [${l.level}] ${l.text}`).join("\n");
    const blob = new Blob([logContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${task.id}_execution_logs.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast({ type: "success", message: "Execution logs downloaded." });
  };

  const handleDownloadOutput = () => {
    const data = `Task Output Artifact\nTask: ${task.name}\nSize: ${task.size}\nWorker Nodes: ${task.workers}\nState: Completed verification.`;
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${task.name.replace(/\s+/g, "_")}.dat`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast({ type: "success", message: "Output file downloaded." });
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] pb-24">
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 bg-[#111217]/95 backdrop-blur-md border-b border-[#24262E] px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8E929E] hover:text-[#FFFFFF] transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} /> Back to Tasks
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadLogs}
            className="p-2 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-medium text-[#8E929E] hover:text-[#FFFFFF] hover:border-[#FF7A00] transition-colors"
            title="Download Logs"
          >
            <FileText size={15} />
          </button>
          <button
            onClick={handleDownloadOutput}
            className="px-3 py-1.5 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-[#FF7A00] hover:bg-[#20222A] flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} /> Download Output
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-5 space-y-4">
        {/* Task Header Card */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-[#FF7A00]/15 border border-[#FF7A00]/30 text-[#FF7A00] text-[10px] font-bold uppercase tracking-wider">
                  {task.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#18191E] border border-[#282A32] text-[#8E929E] text-[10px] font-bold uppercase tracking-wider">
                  Priority: {task.priority}
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  task.status === "running" ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400" :
                  task.status === "completed" ? "bg-blue-500/15 border border-blue-500/30 text-blue-400" :
                  "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                }`}>
                  {task.status}
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-bold text-[#FFFFFF]">
                {task.name}
              </h1>
              <p className="text-xs text-[#8E929E] mt-1">
                Initiated by <span className="text-[#FF7A00]">{task.by}</span> • {task.created}
              </p>
            </div>

            {/* Main Progress Bar & Metrics */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePause}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isPaused
                    ? "bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-white shadow-[0_2px_12px_rgba(255,122,0,0.4)]"
                    : "bg-[#18191E] border border-[#282A32] text-[#FF7A00] hover:bg-[#20222A]"
                }`}
              >
                {isPaused ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
                {isPaused ? "Resume Task" : "Pause Task"}
              </button>
              <button
                onClick={handleCancelTask}
                className="px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <XCircle size={16} /> Abort
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 pt-4 border-t border-[#20222A]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#FF7A00] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-ping" />
                {task.progress}% Overall Progress
              </span>
              <span className="text-xs text-[#8E929E]">
                ETA: {task.eta} • Speed: {task.speed}
              </span>
            </div>
            <div className="h-3 w-full bg-[#0D0E12] rounded-full overflow-hidden p-0.5 border border-[#24262E]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF7A00] via-[#FFA033] to-[#FF5500] shadow-[0_0_12px_rgba(255,122,0,0.6)] transition-all duration-500"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="bg-[#0B0C0E] border border-[#20222A] rounded-xl p-3">
              <span className="text-[10px] text-[#8E929E] font-semibold uppercase tracking-wider">Chunks Completed</span>
              <p className="text-sm font-bold text-[#FFFFFF] mt-0.5">{task.chunks}</p>
            </div>
            <div className="bg-[#0B0C0E] border border-[#20222A] rounded-xl p-3">
              <span className="text-[10px] text-[#8E929E] font-semibold uppercase tracking-wider">Assigned Workers</span>
              <p className="text-sm font-bold text-[#FF7A00] mt-0.5">{task.workers} Nodes</p>
            </div>
            <div className="bg-[#0B0C0E] border border-[#20222A] rounded-xl p-3">
              <span className="text-[10px] text-[#8E929E] font-semibold uppercase tracking-wider">Input Dataset</span>
              <p className="text-xs font-mono text-[#E5E7EB] truncate mt-0.5" title={task.inputPath}>{task.inputPath}</p>
            </div>
            <div className="bg-[#0B0C0E] border border-[#20222A] rounded-xl p-3">
              <span className="text-[10px] text-[#8E929E] font-semibold uppercase tracking-wider">Output Destination</span>
              <p className="text-xs font-mono text-[#E5E7EB] truncate mt-0.5" title={task.outputPath}>{task.outputPath}</p>
            </div>
          </div>
        </div>

        {/* Worker Nodes Contribution Matrix */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Server size={18} className="text-[#FF7A00]" />
              <h2 className="text-sm font-bold text-[#FFFFFF]">Assigned Worker Cluster</h2>
            </div>
            <span className="text-xs text-[#8E929E]">Load distributed via P2P Mesh</span>
          </div>

          <div className="space-y-3">
            {INITIAL_WORKERS.map((worker, i) => (
              <div
                key={i}
                className="bg-[#0D0E12] border border-[#20222A] rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#18191E] border border-[#282A32] flex items-center justify-center text-xs font-bold text-[#FF7A00]">
                    0{i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#FFFFFF]">{worker.name}</span>
                      <span className="text-[10px] text-[#8E929E] font-mono">{worker.ip}</span>
                    </div>
                    <span className="text-[11px] text-[#8E929E]">{worker.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-56">
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#8E929E]">Contribution</span>
                      <span className="text-[#FF7A00] font-bold">{worker.contrib}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#18191E] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FFA033] rounded-full"
                        style={{ width: `${worker.contrib}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Execution Logs Terminal */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#FF7A00]" />
              <h2 className="text-sm font-bold text-[#FFFFFF]">Telemetry & Node Logs</h2>
            </div>
            <button
              onClick={() => {
                setLogs((prev) => [
                  {
                    level: "INFO",
                    time: new Date().toLocaleTimeString(),
                    text: `Heartbeat synchronized from worker cluster (all 5 nodes active).`
                  },
                  ...prev
                ]);
                showToast({ type: "info", message: "Fetched latest telemetry." });
              }}
              className="text-xs text-[#FF7A00] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} /> Refresh Stream
            </button>
          </div>

          <div className="bg-[#0B0C0E] border border-[#20222A] rounded-xl p-3.5 max-h-64 overflow-y-auto space-y-2 font-mono text-xs">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-[#667085] text-[10px] flex-shrink-0 pt-0.5">{log.time}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider flex-shrink-0 ${
                    log.level === "INFO"
                      ? "bg-blue-500/15 text-blue-400"
                      : log.level === "WARN"
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-[#D1D5DB] break-all">{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
