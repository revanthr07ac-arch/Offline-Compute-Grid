import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronRight,
  AlertCircle,
  PauseCircle,
  XCircle,
  Download,
  FileText,
  RefreshCw,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  Cpu
} from "lucide-react";
import { useToast } from "../components/Toast";

export interface Task {
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
  error?: string;
}

const DEFAULT_TASKS: Task[] = [
  {
    id: "t1",
    name: "4K Video Transcoding — Episode 12",
    type: "FFmpeg H.265",
    priority: "high",
    progress: 67,
    eta: "41 min",
    workers: 5,
    size: "8.4 GB",
    by: "REVANTH R",
    status: "running",
  },
  {
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
  },
  {
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
  },
  {
    id: "t4",
    name: "3D Blender Render — Frame 01-250",
    type: "Cycles GPU",
    priority: "high",
    progress: 0,
    eta: "Queued",
    workers: 6,
    size: "1.2 GB",
    by: "REVANTH R",
    status: "pending",
  },
  {
    id: "t5",
    name: "Dataset SHA256 Verification",
    type: "Integrity Hash",
    priority: "low",
    progress: 0,
    eta: "Queued",
    workers: 2,
    size: "14.5 GB",
    by: "admin",
    status: "pending",
  },
  {
    id: "t6",
    name: "Genomic Sequence Alignment",
    type: "BioPython Cluster",
    priority: "medium",
    progress: 0,
    eta: "Queued",
    workers: 4,
    size: "3.4 GB",
    by: "REVANTH R",
    status: "pending",
  },
  {
    id: "t7",
    name: "Audio Mastering — Master Stem 04",
    type: "DSP Batch",
    priority: "medium",
    progress: 100,
    eta: "Completed",
    workers: 2,
    size: "720 MB",
    by: "monk av",
    status: "completed",
  },
  {
    id: "t8",
    name: "Point Cloud Meshing — Scan 88",
    type: "Open3D Mesh",
    priority: "high",
    progress: 100,
    eta: "Completed",
    workers: 5,
    size: "3.8 GB",
    by: "REVANTH R",
    status: "completed",
  },
  {
    id: "t9",
    name: "Satellite Image Orthorectification",
    type: "GDAL Raster",
    priority: "critical",
    progress: 100,
    eta: "Completed",
    workers: 6,
    size: "9.2 GB",
    by: "admin",
    status: "completed",
  },
  {
    id: "t10",
    name: "Raytracing Light Baking — Scene 02",
    type: "OptiX Bake",
    priority: "critical",
    progress: 42,
    eta: "Failed",
    workers: 3,
    size: "4.5 GB",
    by: "REVANTH R",
    status: "failed",
    error: "CUDA out-of-memory exception on worker Node-03 (GTX 1660)",
  },
  {
    id: "t11",
    name: "Cryptographic Salt Generation",
    type: "OpenSSL PRNG",
    priority: "low",
    progress: 15,
    eta: "Aborted",
    workers: 0,
    size: "50 MB",
    by: "REVANTH POOJARY",
    status: "cancelled",
  },
];

type TabKey = "running" | "pending" | "completed" | "failed" | "cancelled";

const PRIORITY_BADGES: Record<
  Task["priority"],
  { bg: string; border: string; color: string; label: string }
> = {
  critical: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)", color: "#EF4444", label: "Critical" },
  high: { bg: "rgba(255,122,0,0.15)", border: "rgba(255,122,0,0.3)", color: "#FF7A00", label: "High" },
  medium: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", color: "#F59E0B", label: "Medium" },
  low: { bg: "rgba(142,146,158,0.15)", border: "rgba(142,146,158,0.3)", color: "#8E929E", label: "Low" },
};

interface TaskManagerPageProps {
  onTaskSelect: (id: string) => void;
  onCreateTask: () => void;
}

export default function TaskManagerPage({
  onTaskSelect,
  onCreateTask,
}: TaskManagerPageProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>("running");
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("ocg_tasks");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_TASKS;
  });

  const [selectedError, setSelectedError] = useState<{ name: string; error: string } | null>(null);

  useEffect(() => {
    localStorage.setItem("ocg_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const counts: Record<TabKey, number> = {
    running: tasks.filter((t) => t.status === "running").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    failed: tasks.filter((t) => t.status === "failed").length,
    cancelled: tasks.filter((t) => t.status === "cancelled").length,
  };

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "running", label: "Running", count: counts.running },
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "completed", label: "Completed", count: counts.completed },
    { key: "failed", label: "Failed", count: counts.failed },
    { key: "cancelled", label: "Cancelled", count: counts.cancelled },
  ];

  const filtered = tasks.filter(
    (t) =>
      t.status === activeTab &&
      (searchQuery === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.by.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePause = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: "pending", eta: "Paused" } : t
      )
    );
    showToast({
      type: "warning",
      message: "Task paused. State snapshot saved to master node."
    });
  };

  const handleStart = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: "running", eta: "Resuming...", progress: Math.max(t.progress, 5) }
          : t
      )
    );
    showToast({
      type: "success",
      message: "Task scheduled and dispatched across active workers."
    });
  };

  const handleCancel = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: "cancelled", eta: "Aborted" } : t
      )
    );
    showToast({
      type: "info",
      message: "Task aborted. Worker memory released."
    });
  };

  const handleRetry = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "running",
              progress: 10,
              eta: "45 min",
              error: undefined
            }
          : t
      )
    );
    showToast({
      type: "success",
      message: "Retrying task with fallback allocation policy."
    });
  };

  const handleDownloadOutput = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const data = `Offline Compute Grid Task Execution Result\nTask: ${task.name}\nType: ${task.type}\nStatus: ${task.status}\nCompleted By: ${task.by}\nChecksum: sha256:d8a23fa90812984b910e\nGrid Nodes Assigned: ${task.workers}`;
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${task.name.replace(/\s+/g, "_")}_output.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast({
      type: "success",
      message: `Downloaded output package for "${task.name}".`
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] pb-24">
      {/* Sticky Header with Search */}
      <div className="sticky top-0 z-30 bg-[#111217]/95 backdrop-blur-md border-b border-[#24262E] px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#FFFFFF]">Tasks</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#18191E] border border-[#282A32] text-xs font-semibold text-[#8E929E]">
              {tasks.length} total
            </span>
          </div>
          <button
            onClick={onCreateTask}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-[#FFFFFF] flex items-center gap-1.5 shadow-[0_2px_12px_rgba(255,122,0,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={14} /> New Task
          </button>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E929E]"
          />
          <input
            type="text"
            placeholder="Search tasks by name, type, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#18191E] border border-[#282A32] rounded-xl pl-10 pr-4 text-sm text-[#FFFFFF] placeholder-[#667085] focus:outline-none focus:border-[#FF7A00] transition-colors"
          />
        </div>
      </div>

      {/* Segmented Tab Navigation */}
      <div className="bg-[#111217] border-b border-[#24262E] px-4 flex gap-1 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? "border-[#FF7A00] text-[#FF7A00]"
                  : "border-transparent text-[#8E929E] hover:text-[#FFFFFF]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-[#FF7A00]/20 text-[#FF7A00]"
                    : "bg-[#18191E] text-[#8E929E]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-3.5">
        {filtered.length === 0 ? (
          <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-12 text-center">
            <Layers size={44} className="mx-auto text-[#8E929E] opacity-40 mb-3" />
            <h3 className="text-base font-semibold text-[#FFFFFF]">No {activeTab} tasks</h3>
            <p className="text-xs text-[#8E929E] mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No tasks matching "${searchQuery}" in this view.`
                : `There are currently no tasks with status "${activeTab}".`}
            </p>
            <button
              onClick={onCreateTask}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white shadow-md cursor-pointer"
            >
              <Plus size={14} /> Submit New Task
            </button>
          </div>
        ) : (
          filtered.map((task) => {
            const priorityBadge = PRIORITY_BADGES[task.priority];
            return (
              <div
                key={task.id}
                onClick={() => onTaskSelect(task.id)}
                className="group bg-[#14151B] hover:bg-[#18191E] border border-[#24262E] hover:border-[#FF7A00]/50 rounded-2xl p-4.5 transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_20px_rgba(255,122,0,0.15)] relative"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-sm font-bold text-[#FFFFFF] group-hover:text-[#FFA033] transition-colors truncate">
                        {task.name}
                      </h3>
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
                        style={{
                          background: priorityBadge.bg,
                          border: `1px solid ${priorityBadge.border}`,
                          color: priorityBadge.color,
                        }}
                      >
                        {priorityBadge.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-[#8E929E] flex-wrap">
                      <span className="font-medium text-[#E5E7EB]">{task.type}</span>
                      <span>•</span>
                      <span>{task.size}</span>
                      <span>•</span>
                      <span>by <span className="text-[#FF7A00] font-medium">{task.by}</span></span>
                    </div>
                  </div>

                  <ChevronRight
                    size={16}
                    className="text-[#8E929E] group-hover:text-[#FF7A00] group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1"
                  />
                </div>

                {/* Progress bar for running tasks */}
                {task.status === "running" && (
                  <div className="mt-3.5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#FF7A00]">
                        {task.progress}% Processing
                      </span>
                      <span className="text-[#8E929E] flex items-center gap-1 text-[11px]">
                        <Clock size={12} /> ETA {task.eta}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#1F2128] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF5500] shadow-[0_0_8px_rgba(255,122,0,0.6)] transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Error Banner for failed tasks */}
                {task.status === "failed" && task.error && (
                  <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <AlertCircle size={15} className="flex-shrink-0" />
                      <span className="truncate">{task.error}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedError({ name: task.name, error: task.error! });
                      }}
                      className="text-[11px] underline font-semibold flex-shrink-0 hover:text-red-300"
                    >
                      Diagnose
                    </button>
                  </div>
                )}

                {/* Completed status indicator */}
                {task.status === "completed" && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 size={14} /> Completed successfully • verified by cluster master
                  </div>
                )}

                {/* Worker Allocation & Actions Row */}
                <div className="mt-3.5 pt-3 border-t border-[#20222A] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#8E929E]">
                    <Cpu size={14} className="text-[#FF7A00]" />
                    <span>
                      {task.workers > 0 ? `${task.workers} Worker Node(s) Assigned` : "Waiting for worker allocation"}
                    </span>
                  </div>

                  {/* Contextual Action Buttons */}
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {task.status === "running" && (
                      <>
                        <button
                          onClick={(e) => handlePause(task.id, e)}
                          className="px-3 py-1.5 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-[#8E929E] hover:text-[#FFFFFF] hover:border-[#FF7A00] flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <PauseCircle size={13} /> Pause
                        </button>
                        <button
                          onClick={(e) => handleCancel(task.id, e)}
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs font-semibold text-red-400 hover:bg-red-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <XCircle size={13} /> Cancel
                        </button>
                      </>
                    )}

                    {task.status === "pending" && (
                      <>
                        <button
                          onClick={(e) => handleStart(task.id, e)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-[#FFFFFF] flex items-center gap-1.5 shadow-sm hover:brightness-110 transition-all cursor-pointer"
                        >
                          <Play size={13} /> Start Now
                        </button>
                        <button
                          onClick={(e) => handleCancel(task.id, e)}
                          className="px-3 py-1.5 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-[#8E929E] hover:text-red-400 hover:border-red-500/30 transition-all cursor-pointer"
                        >
                          Remove
                        </button>
                      </>
                    )}

                    {task.status === "completed" && (
                      <button
                        onClick={(e) => handleDownloadOutput(task, e)}
                        className="px-3 py-1.5 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-[#FF7A00] hover:bg-[#20222A] flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Download size={13} /> Download Output
                      </button>
                    )}

                    {task.status === "failed" && (
                      <button
                        onClick={(e) => handleRetry(task.id, e)}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-[#FFFFFF] flex items-center gap-1.5 shadow-sm hover:brightness-110 transition-all cursor-pointer"
                      >
                        <RefreshCw size={13} /> Retry Task
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onCreateTask}
        title="Submit New Task"
        className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF7A00] to-[#FF5500] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(255,122,0,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Plus size={22} />
      </button>

      {/* Error Diagnosis Modal */}
      {selectedError && (
        <div
          onClick={() => setSelectedError(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#14151B] border border-red-500/30 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle size={22} />
              <h3 className="text-sm font-bold text-white truncate">{selectedError.name}</h3>
            </div>
            <div className="bg-[#0B0C0E] border border-[#24262E] rounded-xl p-3.5 font-mono text-xs text-red-300 break-words leading-relaxed">
              {selectedError.error}
            </div>
            <p className="text-xs text-[#8E929E]">
              Recommendation: Reduce batch chunk size or route workload exclusively to high-VRAM nodes (e.g. Master Node DESKTOP-A7X).
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedError(null)}
                className="px-4 py-2 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedError(null);
                  showToast({ type: "success", message: "Node allocation rules updated." });
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white"
              >
                Auto-Fix & Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
