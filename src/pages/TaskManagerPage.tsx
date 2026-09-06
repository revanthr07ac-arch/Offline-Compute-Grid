import { useState } from "react";
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
} from "lucide-react";

interface Task {
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

const ALL_TASKS: Task[] = [
  {
    id: "t1",
    name: "4K Video Transcoding — Episode 12",
    type: "Video",
    priority: "high",
    progress: 67,
    eta: "41 min",
    workers: 5,
    size: "8.4 GB",
    by: "admin",
    status: "running",
  },
  {
    id: "t2",
    name: "ML Model Training — ResNet50",
    type: "Python",
    priority: "critical",
    progress: 34,
    eta: "2h 15m",
    workers: 3,
    size: "2.1 GB",
    by: "ml-engineer",
    status: "running",
  },
  {
    id: "t3",
    name: "Document OCR Batch — Q4",
    type: "Document",
    priority: "medium",
    progress: 89,
    eta: "8 min",
    workers: 2,
    size: "450 MB",
    by: "analyst",
    status: "running",
  },
  {
    id: "t4",
    name: "Image Compression — Product Photos",
    type: "Image",
    priority: "low",
    progress: 0,
    eta: "25 min",
    workers: 0,
    size: "1.2 GB",
    by: "designer",
    status: "pending",
  },
  {
    id: "t5",
    name: "Audio Normalization — Podcast S3",
    type: "Audio",
    priority: "medium",
    progress: 0,
    eta: "12 min",
    workers: 0,
    size: "340 MB",
    by: "editor",
    status: "pending",
  },
  {
    id: "t6",
    name: "Database Backup Compression",
    type: "Compression",
    priority: "high",
    progress: 0,
    eta: "45 min",
    workers: 0,
    size: "5.6 GB",
    by: "admin",
    status: "pending",
  },
  {
    id: "t7",
    name: "Logo Asset Export — Brand Kit",
    type: "Image",
    priority: "low",
    progress: 100,
    eta: "Done",
    workers: 2,
    size: "80 MB",
    by: "designer",
    status: "completed",
  },
  {
    id: "t8",
    name: "Report Generation — Monthly",
    type: "Document",
    priority: "medium",
    progress: 100,
    eta: "Done",
    workers: 1,
    size: "120 MB",
    by: "analyst",
    status: "completed",
  },
  {
    id: "t9",
    name: "Thumbnail Batch — Season 2",
    type: "Image",
    priority: "low",
    progress: 100,
    eta: "Done",
    workers: 3,
    size: "200 MB",
    by: "editor",
    status: "completed",
  },
  {
    id: "t10",
    name: "Config Backup — Cluster A",
    type: "Compression",
    priority: "medium",
    progress: 100,
    eta: "Done",
    workers: 1,
    size: "15 MB",
    by: "admin",
    status: "completed",
  },
  {
    id: "t11",
    name: "Training Data Archive",
    type: "Python",
    priority: "high",
    progress: 100,
    eta: "Done",
    workers: 4,
    size: "3.2 GB",
    by: "ml-engineer",
    status: "completed",
  },
  {
    id: "t12",
    name: "Python Data Pipeline v2",
    type: "Python",
    priority: "critical",
    progress: 23,
    eta: "N/A",
    workers: 2,
    size: "890 MB",
    by: "ml-engineer",
    status: "failed",
    error: "OOM on RPi-3",
  },
];

const TABS = [
  { key: "running" as const, label: "Running", count: 3 },
  { key: "pending" as const, label: "Pending", count: 3 },
  { key: "completed" as const, label: "Completed", count: 5 },
  { key: "failed" as const, label: "Failed", count: 1 },
  { key: "cancelled" as const, label: "Cancelled", count: 0 },
];

type TabKey = "running" | "pending" | "completed" | "failed" | "cancelled";

const PRIORITY_STYLES: Record<
  Task["priority"],
  { bg: string; color: string; label: string }
> = {
  critical: { bg: "#FEF2F2", color: "#EF4444", label: "Critical" },
  high: { bg: "#FFF7ED", color: "#F59E0B", label: "High" },
  medium: { bg: "#EEF3FF", color: "#4F6FFF", label: "Medium" },
  low: { bg: "#F1F4F9", color: "#667085", label: "Low" },
};

const WORKER_COLORS = [
  "#4F6FFF",
  "#7C5CFC",
  "#10B981",
  "#F59E0B",
  "#0EA5E9",
  "#EF4444",
];

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const s = PRIORITY_STYLES[priority];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 11,
        fontWeight: 600,
        borderRadius: 6,
        padding: "2px 7px",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {s.label}
    </span>
  );
}

function WorkerAvatars({ count }: { count: number }) {
  if (count === 0) {
    return (
      <span style={{ fontSize: 12, color: "#98A2B3", fontStyle: "italic" }}>
        Unassigned
      </span>
    );
  }
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: Math.min(count, 6) }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: WORKER_COLORS[i % WORKER_COLORS.length],
            border: "1.5px solid #FFFFFF",
          }}
        />
      ))}
    </div>
  );
}

function TaskCard({
  task,
  onSelect,
}: {
  task: Task;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="card animate-fade-in-up"
      style={{ padding: 16, position: "relative", cursor: "pointer" }}
      onClick={() => onSelect(task.id)}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
            lineHeight: 1.35,
            flex: 1,
          }}
        >
          {task.name}
        </span>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 4,
          fontSize: 12,
          color: "#98A2B3",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span>{task.type}</span>
        <span>·</span>
        <span>{task.size}</span>
        <span>·</span>
        <span>by {task.by}</span>
      </div>

      {/* Progress bar */}
      {(task.status === "running" || task.status === "failed") && (
        <>
          <div
            style={{
              background: "#F1F4F9",
              height: 6,
              borderRadius: 4,
              marginTop: 12,
              overflow: "hidden",
            }}
          >
            <div
              className="progress-bar-fill"
              style={{
                width: `${task.progress}%`,
                height: "100%",
                background: task.status === "failed" ? "#EF4444" : "#4F6FFF",
                borderRadius: 4,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 12,
              color: "#667085",
              display: "block",
              marginTop: 4,
            }}
          >
            {task.progress}% · {task.eta}
          </span>
        </>
      )}

      {/* Completed green check */}
      {task.status === "completed" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 8,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5l2 2 4-4"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: 12, color: "#10B981", fontWeight: 500 }}>
            Completed
          </span>
        </div>
      )}

      {/* Error banner */}
      {task.status === "failed" && task.error && (
        <div
          style={{
            background: "#FEF2F2",
            color: "#EF4444",
            fontSize: 12,
            padding: "8px 10px",
            borderRadius: 8,
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <AlertCircle size={13} />
          {task.error}
        </div>
      )}

      {/* Workers */}
      <div style={{ marginTop: 10 }}>
        <WorkerAvatars count={task.workers} />
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 12,
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {task.status === "running" && (
          <>
            <button
              className="btn-secondary"
              style={{ height: 32, fontSize: 12, padding: "0 12px", display: "flex", alignItems: "center", gap: 4 }}
            >
              <PauseCircle size={12} />
              Pause
            </button>
            <button
              style={{
                height: 32,
                fontSize: 12,
                padding: "0 12px",
                background: "#FEF2F2",
                color: "#EF4444",
                border: "none",
                borderRadius: 8,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <XCircle size={12} />
              Cancel
            </button>
          </>
        )}
        {task.status === "pending" && (
          <>
            <button
              style={{
                height: 32,
                fontSize: 12,
                padding: "0 12px",
                background: "#EEF3FF",
                color: "#4F6FFF",
                border: "none",
                borderRadius: 8,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Play size={12} />
              Start
            </button>
            <button
              style={{
                height: 32,
                fontSize: 12,
                padding: "0 12px",
                background: "#FEF2F2",
                color: "#EF4444",
                border: "none",
                borderRadius: 8,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </>
        )}
        {task.status === "completed" && (
          <>
            <button
              className="btn-secondary"
              style={{ height: 32, fontSize: 12, padding: "0 12px", display: "flex", alignItems: "center", gap: 4 }}
            >
              <Download size={12} />
              Download
            </button>
            <button
              className="btn-secondary"
              style={{ height: 32, fontSize: 12, padding: "0 12px", display: "flex", alignItems: "center", gap: 4 }}
            >
              <FileText size={12} />
              View Logs
            </button>
          </>
        )}
        {task.status === "failed" && (
          <>
            <button
              style={{
                height: 32,
                fontSize: 12,
                padding: "0 12px",
                background: "#EEF3FF",
                color: "#4F6FFF",
                border: "none",
                borderRadius: 8,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <RefreshCw size={12} />
              Retry
            </button>
            <button
              style={{
                height: 32,
                fontSize: 12,
                padding: "0 12px",
                background: "#FEF2F2",
                color: "#EF4444",
                border: "none",
                borderRadius: 8,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              View Error
            </button>
          </>
        )}
        <ChevronRight size={14} style={{ color: "#E6EAF0", marginLeft: "auto" }} />
      </div>
    </div>
  );
}

interface TaskManagerPageProps {
  onTaskSelect: (id: string) => void;
  onCreateTask: () => void;
}

export default function TaskManagerPage({
  onTaskSelect,
  onCreateTask,
}: TaskManagerPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("running");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = ALL_TASKS.filter(
    (t) =>
      t.status === activeTab &&
      (searchQuery === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F7F9FC", position: "relative" }}>
      {/* Sticky header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "#FFFFFF",
          borderBottom: "1px solid #E6EAF0",
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 12,
          paddingBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#111827" }}>
            Tasks
          </span>
          <span
            style={{
              background: "#F1F4F9",
              color: "#667085",
              borderRadius: 999,
              padding: "2px 8px",
              fontSize: 12,
            }}
          >
            12 tasks
          </span>
        </div>
        <div style={{ position: "relative", marginTop: 8 }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#98A2B3",
            }}
          />
          <input
            type="text"
            placeholder="Search tasks…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              height: 40,
              background: "#F1F4F9",
              border: "none",
              borderRadius: 10,
              paddingLeft: 36,
              paddingRight: 12,
              fontSize: 14,
              color: "#111827",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Segmented tabs */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E6EAF0",
          paddingLeft: 16,
          paddingRight: 16,
          display: "flex",
          gap: 0,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "12px 16px",
              fontSize: 14,
              fontWeight: 500,
              border: "none",
              borderBottom: activeTab === tab.key ? "2px solid #4F6FFF" : "2px solid transparent",
              background: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              color: activeTab === tab.key ? "#4F6FFF" : "#667085",
              transition: "color 0.15s, border-color 0.15s",
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                style={{
                  marginLeft: 5,
                  background: activeTab === tab.key ? "#EEF3FF" : "#F1F4F9",
                  color: activeTab === tab.key ? "#4F6FFF" : "#98A2B3",
                  borderRadius: 99,
                  fontSize: 11,
                  padding: "1px 6px",
                  fontWeight: 600,
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 12,
          paddingBottom: 96,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              paddingTop: 48,
              color: "#98A2B3",
              fontSize: 14,
            }}
          >
            No tasks found
          </div>
        )}
        {filtered.map((task) => (
          <TaskCard key={task.id} task={task} onSelect={onTaskSelect} />
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={onCreateTask}
        style={{
          position: "fixed",
          bottom: 80,
          right: 20,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "#4F6FFF",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(79,111,255,0.4)",
          zIndex: 40,
        }}
      >
        <Plus size={22} color="#FFFFFF" />
      </button>
    </div>
  );
}
