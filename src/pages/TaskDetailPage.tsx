import React from "react";
import { ChevronLeft, MoreVertical, PauseCircle, XCircle } from "lucide-react";

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
  status: string;
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
    type: "Video",
    priority: "high",
    progress: 67,
    eta: "41 min",
    workers: 5,
    size: "8.4 GB",
    by: "admin",
    status: "running",
    speed: "2.4 GB/s",
    chunks: "25/38",
    errors: 0,
    inputPath: "/mnt/nas/videos/episode-12-raw.mkv",
    outputPath: "/mnt/nas/output/episode-12-4k.mp4",
    created: "2026-08-23 09:14",
  },
  t2: {
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
    speed: "0.8 GB/s",
    chunks: "12/35",
    errors: 0,
    inputPath: "/mnt/data/datasets/imagenet-subset",
    outputPath: "/mnt/models/resnet50-v3.pt",
    created: "2026-08-23 08:00",
  },
  t3: {
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
    speed: "0.3 GB/s",
    chunks: "34/38",
    errors: 1,
    inputPath: "/mnt/docs/q4-scans/",
    outputPath: "/mnt/docs/q4-ocr-output/",
    created: "2026-08-23 10:30",
  },
};

const DEFAULT_TASK = TASK_MAP["t1"];

const PRIORITY_STYLES: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  critical: { bg: "#FEF2F2", color: "#EF4444", label: "Critical" },
  high: { bg: "#FFF7ED", color: "#F59E0B", label: "High" },
  medium: { bg: "#F3E8FF", color: "#8B5CF6", label: "Medium" },
  low: { bg: "#F1F4F9", color: "#667085", label: "Low" },
};

const WORKER_DATA = [
  { name: "RPi-4 Node A", ip: "192.168.1.101", color: "#8B5CF6", contrib: 35 },
  { name: "RPi-4 Node B", ip: "192.168.1.102", color: "#7C5CFC", contrib: 28 },
  { name: "x86 Worker-1", ip: "192.168.1.110", color: "#10B981", contrib: 22 },
  { name: "x86 Worker-2", ip: "192.168.1.111", color: "#F59E0B", contrib: 15 },
  { name: "RPi-3 Backup", ip: "192.168.1.105", color: "#0EA5E9", contrib: 0 },
];

const LOG_LINES = [
  { level: "INFO", color: "#8B5CF6", bg: "#F3E8FF", text: "Chunk 25 dispatched to RPi-4 Node A" },
  { level: "INFO", color: "#8B5CF6", bg: "#F3E8FF", text: "Chunk 24 completed — 99.8 MB written" },
  { level: "WARNING", color: "#F59E0B", bg: "#FFF7ED", text: "RPi-3 Backup high temp: 72°C" },
  { level: "SUCCESS", color: "#10B981", bg: "#ECFDF5", text: "Chunk 23 verified, checksum OK" },
];

const DETAIL_ROWS = (task: TaskData) => [
  { label: "Type", value: task.type, mono: false },
  { label: "Priority", value: PRIORITY_STYLES[task.priority]?.label ?? task.priority, mono: false },
  { label: "File Size", value: task.size, mono: false },
  { label: "Input Path", value: task.inputPath, mono: true },
  { label: "Output Path", value: task.outputPath, mono: true },
  { label: "Created", value: task.created, mono: false },
  { label: "Submitted by", value: task.by, mono: false },
];

interface TaskDetailPageProps {
  taskId: string;
  onBack: () => void;
}

export default function TaskDetailPage({ taskId, onBack }: TaskDetailPageProps) {
  const [task, setTask] = React.useState<TaskData | null>(null);

  React.useEffect(() => {
    const fetchTask = () => {
      fetch(`/api/tasks/${taskId}`)
        .then(res => res.json())
        .then(data => setTask(data))
        .catch(err => console.error("Failed to fetch task", err));
    };
    fetchTask();
    const interval = setInterval(fetchTask, 3000);
    return () => clearInterval(interval);
  }, [taskId]);

  if (!task) return <div style={{ padding: 24 }}>Loading task details...</div>;
  const priority = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.medium;

  const statusBg =
    task.status === "running"
      ? "#ECFDF5"
      : task.status === "failed"
      ? "#FEF2F2"
      : "#F1F4F9";
  const statusColor =
    task.status === "running"
      ? "#10B981"
      : task.status === "failed"
      ? "#EF4444"
      : "#667085";

  return (
    <div style={{ minHeight: "100vh", background: "#F7F9FC" }}>
      {/* Header */}
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
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: "#111827",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={22} />
        </button>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
            lineHeight: 1.35,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {task.name}
        </span>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            color: "#667085",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Status card */}
      <div className="card" style={{ margin: "16px 16px 0", padding: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
          {task.name}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          <span
            style={{
              background: statusBg,
              color: statusColor,
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 6,
              padding: "3px 9px",
              textTransform: "capitalize",
            }}
          >
            {task.status}
          </span>
          <span
            style={{
              background: priority.bg,
              color: priority.color,
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 6,
              padding: "3px 9px",
            }}
          >
            {priority.label}
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            background: "#F1F4F9",
            height: 8,
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
              background: "#8B5CF6",
              borderRadius: 4,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 6,
          }}
        >
          <span style={{ fontSize: 13, color: "#667085" }}>
            {task.progress}% complete
          </span>
          <span style={{ fontSize: 13, color: "#667085" }}>ETA {task.eta}</span>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            marginTop: 16,
          }}
        >
          {[
            { label: "Speed", value: task.speed },
            { label: "Chunks", value: task.chunks },
            { label: "Errors", value: String(task.errors) },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#F7F9FC",
                borderRadius: 10,
                padding: "10px 8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#111827",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: "#98A2B3", marginTop: 2 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workers card */}
      <div className="card" style={{ margin: "12px 16px 0", padding: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
            Assigned Workers
          </span>
          <span
            style={{
              background: "#F3E8FF",
              color: "#8B5CF6",
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 99,
              padding: "2px 8px",
            }}
          >
            {task.workers}
          </span>
        </div>
        {WORKER_DATA.slice(0, task.workers).map((w, i) => (
          <div
            key={w.ip}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingTop: i === 0 ? 0 : 10,
              paddingBottom: i < task.workers - 1 ? 10 : 0,
              borderBottom:
                i < task.workers - 1 ? "1px solid #E6EAF0" : "none",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: w.color,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {w.name[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                {w.name}
              </div>
              <div
                className="mono"
                style={{ fontSize: 12, color: "#98A2B3", marginTop: 1 }}
              >
                {w.ip}
              </div>
            </div>
            {/* Contribution bar */}
            <div
              style={{
                width: 40,
                height: 4,
                background: "#F1F4F9",
                borderRadius: 2,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: `${w.contrib}%`,
                  height: "100%",
                  background: w.color,
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Details card */}
      <div className="card" style={{ margin: "12px 16px 0", padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12 }}>
          Task Details
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
          }}
        >
          {DETAIL_ROWS(task).map((row, i) => (
            <div
              key={row.label}
              style={{
                gridColumn: row.mono ? "1 / -1" : undefined,
                paddingTop: 10,
                paddingBottom: 10,
                borderBottom:
                  i < DETAIL_ROWS(task).length - 1
                    ? "1px solid #E6EAF0"
                    : "none",
              }}
            >
              <div style={{ fontSize: 11, color: "#98A2B3", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                {row.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#111827",
                  fontFamily: row.mono
                    ? "JetBrains Mono, monospace"
                    : undefined,
                  wordBreak: "break-all",
                }}
              >
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs preview card */}
      <div className="card" style={{ margin: "12px 16px 0", padding: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
            Recent Logs
          </span>
          <span
            style={{
              fontSize: 13,
              color: "#8B5CF6",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            View All
          </span>
        </div>
        <div
          style={{
            background: "#F7F9FC",
            borderRadius: 10,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {LOG_LINES.map((log, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, marginTop: 1 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: log.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: log.color,
                    background: log.bg,
                    borderRadius: 4,
                    padding: "1px 5px",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {log.level}
                </span>
              </div>
              <span
                className="mono"
                style={{ fontSize: 11, color: "#667085", lineHeight: 1.5 }}
              >
                {log.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action section */}
      <div
        style={{
          marginLeft: 16,
          marginRight: 16,
          marginTop: 16,
          marginBottom: 96,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <button
          className="btn-secondary"
          style={{
            height: 48,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 15,
          }}
        >
          <PauseCircle size={18} />
          Pause Task
        </button>
        <button
          style={{
            height: 48,
            width: "100%",
            background: "#FEF2F2",
            color: "#EF4444",
            border: "none",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <XCircle size={18} />
          Cancel Task
        </button>
      </div>
    </div>
  );
}
