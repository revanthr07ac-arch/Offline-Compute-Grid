import { useState, useEffect, useRef } from "react";
import { Search, Download, Trash2, X } from "lucide-react";

type LogLevel = "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "DEBUG";

interface LogEntry {
  id: number;
  ts: string;
  level: LogLevel;
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

const WORKERS = ["worker-01", "worker-02", "worker-03", "scheduler", "monitor", "net-scan"];

const LIVE_POOL: Array<{ level: LogLevel; message: string }> = [
  { level: "INFO", message: "Heartbeat received from worker-02" },
  { level: "SUCCESS", message: "Task video_transcode_44 completed in 3m 12s" },
  { level: "DEBUG", message: "Memory usage sampled: 71.4% RSS" },
  { level: "WARNING", message: "Task queue depth exceeded threshold: 24 pending" },
  { level: "ERROR", message: "Connection timeout to RPi-Zero-6 after 30s" },
  { level: "INFO", message: "Network scan discovered 2 new peers" },
  { level: "SUCCESS", message: "Checkpoint saved to /data/checkpoints/run_441" },
  { level: "DEBUG", message: "Scheduler rebalance triggered: 3 tasks migrated" },
];

const STATIC_LOGS: LogEntry[] = [
  { id: 1, ts: "14:20:00.001", level: "INFO", worker: "scheduler", message: "System startup complete — 6 workers online" },
  { id: 2, ts: "14:20:00.142", level: "INFO", worker: "monitor", message: "Health check initialized, interval 10s" },
  { id: 3, ts: "14:20:01.203", level: "SUCCESS", worker: "worker-01", message: "Worker registered: Laptop-1 (8 cores, 16 GB)" },
  { id: 4, ts: "14:20:01.344", level: "SUCCESS", worker: "worker-02", message: "Worker registered: PC-2 (12 cores, 32 GB)" },
  { id: 5, ts: "14:20:01.500", level: "SUCCESS", worker: "worker-03", message: "Worker registered: RPi-3 (4 cores, 4 GB)" },
  { id: 6, ts: "14:20:02.010", level: "INFO", worker: "scheduler", message: "Task queue opened — accepting submissions" },
  { id: 7, ts: "14:20:03.512", level: "INFO", worker: "net-scan", message: "Network scan started on 192.168.1.0/24" },
  { id: 8, ts: "14:20:04.001", level: "DEBUG", worker: "net-scan", message: "Probing 192.168.1.101 — response 2ms" },
  { id: 9, ts: "14:20:04.250", level: "DEBUG", worker: "net-scan", message: "Probing 192.168.1.102 — response 4ms" },
  { id: 10, ts: "14:20:04.801", level: "SUCCESS", worker: "net-scan", message: "Discovered 4 new peers in subnet" },
  { id: 11, ts: "14:20:05.103", level: "INFO", worker: "scheduler", message: "Task submitted: 4K Video Transcoding (priority HIGH)" },
  { id: 12, ts: "14:20:05.200", level: "INFO", worker: "scheduler", message: "Task assigned to worker-01 (Laptop-1)" },
  { id: 13, ts: "14:20:05.340", level: "INFO", worker: "worker-01", message: "Starting task: 4K Video Transcoding" },
  { id: 14, ts: "14:20:10.001", level: "INFO", worker: "scheduler", message: "Task submitted: Python Data Pipeline v2" },
  { id: 15, ts: "14:20:10.120", level: "INFO", worker: "scheduler", message: "Task assigned to worker-03 (RPi-3)" },
  { id: 16, ts: "14:20:10.280", level: "WARNING", worker: "monitor", message: "RPi-3 memory usage at 78% — approaching limit" },
  { id: 17, ts: "14:20:12.505", level: "ERROR", worker: "worker-03", message: "OOM kill signal received — task aborted" },
  { id: 18, ts: "14:20:12.600", level: "ERROR", worker: "scheduler", message: "Task failed: Python Data Pipeline v2 — OOM on RPi-3" },
  { id: 19, ts: "14:20:12.800", level: "INFO", worker: "scheduler", message: "Rescheduling failed task — retry 1/3" },
  { id: 20, ts: "14:20:13.001", level: "INFO", worker: "scheduler", message: "Task re-assigned to worker-02 (PC-2)" },
  { id: 21, ts: "14:20:15.002", level: "DEBUG", worker: "worker-02", message: "Loading dataset from /data/ml_dataset.zip" },
  { id: 22, ts: "14:20:15.440", level: "DEBUG", worker: "worker-02", message: "Dataset loaded: 2.1 GB in 1.2s" },
  { id: 23, ts: "14:20:18.001", level: "INFO", worker: "monitor", message: "Heartbeat missed: RPi-Zero-6 (attempt 1/3)" },
  { id: 24, ts: "14:20:28.001", level: "WARNING", worker: "monitor", message: "Heartbeat missed: RPi-Zero-6 (attempt 2/3)" },
  { id: 25, ts: "14:20:38.001", level: "ERROR", worker: "monitor", message: "Worker disconnected: RPi-Zero-6 — removing from pool" },
  { id: 26, ts: "14:20:38.200", level: "WARNING", worker: "scheduler", message: "Worker pool reduced to 5 nodes — rebalancing tasks" },
  { id: 27, ts: "14:21:00.001", level: "INFO", worker: "worker-01", message: "Progress: 4K Video Transcoding — 12% complete" },
  { id: 28, ts: "14:21:00.050", level: "DEBUG", worker: "worker-01", message: "Encoder: libx264, CRF 18, preset slow" },
  { id: 29, ts: "14:21:10.003", level: "INFO", worker: "worker-02", message: "Pipeline stage 1/4 complete: data ingestion" },
  { id: 30, ts: "14:21:15.001", level: "WARNING", worker: "monitor", message: "GAMING-PC-7 disk usage at 88% — storage alert" },
  { id: 31, ts: "14:21:20.003", level: "DEBUG", worker: "scheduler", message: "Load balancer: CPU variance 34% — triggering rebalance" },
  { id: 32, ts: "14:21:20.200", level: "INFO", worker: "scheduler", message: "Task migrated: OCR Batch from worker-03 to Mac-5" },
  { id: 33, ts: "14:21:22.001", level: "INFO", worker: "worker-02", message: "Pipeline stage 2/4 complete: feature extraction" },
  { id: 34, ts: "14:21:30.001", level: "SUCCESS", worker: "worker-02", message: "Task completed: OCR Batch Q4 Reports (2h 14m)" },
  { id: 35, ts: "14:21:30.100", level: "INFO", worker: "scheduler", message: "Result uploaded to /data/processed/ocr_q4_output.zip" },
  { id: 36, ts: "14:21:35.001", level: "INFO", worker: "net-scan", message: "Peer MacBook-Pro-5 joined the grid (192.168.1.118)" },
  { id: 37, ts: "14:21:35.200", level: "SUCCESS", worker: "scheduler", message: "Worker registered: MacBook-Pro-5 (10 cores, 64 GB)" },
  { id: 38, ts: "14:21:40.001", level: "INFO", worker: "scheduler", message: "Task submitted: Thumbnail Generation batch (200 items)" },
  { id: 39, ts: "14:21:40.140", level: "INFO", worker: "scheduler", message: "Distributing across 3 workers" },
  { id: 40, ts: "14:21:41.003", level: "DEBUG", worker: "worker-01", message: "Memory checkpoint saved: /tmp/ckpt_441" },
  { id: 41, ts: "14:21:50.003", level: "INFO", worker: "worker-02", message: "Pipeline stage 3/4 complete: model inference" },
  { id: 42, ts: "14:21:55.001", level: "WARNING", worker: "monitor", message: "CPU temperature alert: RPi-3 at 82°C" },
  { id: 43, ts: "14:22:00.001", level: "INFO", worker: "worker-01", message: "Progress: 4K Video Transcoding — 38% complete" },
  { id: 44, ts: "14:22:05.003", level: "DEBUG", worker: "net-scan", message: "Bandwidth probe: Laptop-1 ↔ PC-2: 940 Mbps" },
  { id: 45, ts: "14:22:10.001", level: "INFO", worker: "worker-02", message: "Pipeline stage 4/4 complete: output serialization" },
  { id: 46, ts: "14:22:10.200", level: "SUCCESS", worker: "worker-02", message: "Task completed: Python Data Pipeline v2 (retry 1)" },
  { id: 47, ts: "14:22:15.003", level: "INFO", worker: "scheduler", message: "All pipeline outputs validated — 3 artifacts generated" },
  { id: 48, ts: "14:22:20.003", level: "DEBUG", worker: "monitor", message: "System stats: avg CPU 67%, avg MEM 71%" },
  { id: 49, ts: "14:22:25.001", level: "INFO", worker: "scheduler", message: "Task submitted: Invoice PDF Merge (890 MB)" },
  { id: 50, ts: "14:22:25.140", level: "INFO", worker: "scheduler", message: "Task assigned to MacBook-Pro-5" },
  { id: 51, ts: "14:22:30.003", level: "DEBUG", worker: "worker-01", message: "Frame buffer flushed — 1440 frames encoded" },
  { id: 52, ts: "14:22:40.001", level: "WARNING", worker: "monitor", message: "Network jitter detected: PC-2 latency spike 180ms" },
  { id: 53, ts: "14:22:45.003", level: "INFO", worker: "monitor", message: "Latency normalized: PC-2 back to 4ms" },
  { id: 54, ts: "14:22:50.001", level: "INFO", worker: "worker-01", message: "Progress: 4K Video Transcoding — 61% complete" },
  { id: 55, ts: "14:23:00.003", level: "DEBUG", worker: "scheduler", message: "Queue depth: 3 pending, 4 active, 12 completed" },
  { id: 56, ts: "14:23:01.001", level: "INFO", worker: "scheduler", message: "Adaptive scheduling: boosting Laptop-1 priority" },
  { id: 57, ts: "14:23:10.001", level: "SUCCESS", worker: "worker-01", message: "Task completed: Thumbnail Generation batch (14m 20s)" },
  { id: 58, ts: "14:23:20.003", level: "INFO", worker: "monitor", message: "System healthy — all workers responding" },
  { id: 59, ts: "14:23:25.001", level: "INFO", worker: "worker-01", message: "Progress: 4K Video Transcoding — 79% complete" },
  { id: 60, ts: "14:23:30.003", level: "DEBUG", worker: "net-scan", message: "Periodic scan complete — no new peers found" },
];

const LEVEL_COLORS: Record<LogLevel, string> = {
  INFO: "#667085",
  SUCCESS: "#10B981",
  WARNING: "#F59E0B",
  ERROR: "#EF4444",
  DEBUG: "#7C5CFC",
};

const ALL_LEVELS: Array<"ALL" | LogLevel> = ["ALL", "INFO", "SUCCESS", "WARNING", "ERROR", "DEBUG"];

let nextId = 61;

function randomLiveLog(): LogEntry {
  const entry = LIVE_POOL[Math.floor(Math.random() * LIVE_POOL.length)];
  const worker = WORKERS[Math.floor(Math.random() * WORKERS.length)];
  return { id: nextId++, ts: makeTs(), level: entry.level, worker, message: entry.message };
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(STATIC_LOGS);
  const [levelFilter, setLevelFilter] = useState<"ALL" | LogLevel>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setLogs((prev) => [...prev, randomLiveLog()]);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const visible = logs.filter((l) => {
    if (levelFilter !== "ALL" && l.level !== levelFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!l.message.toLowerCase().includes(q) && !l.worker.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div style={{ background: "#F7F9FC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E6EAF0", padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#111827" }}>Logs</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setAutoScroll((v) => !v)}
              style={{
                padding: "4px 10px",
                borderRadius: 20,
                border: "none",
                background: autoScroll ? "#EEF3FF" : "#F1F4F9",
                color: autoScroll ? "#4F6FFF" : "#667085",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Auto ↓
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <Download size={16} color="#667085" />
            </button>
            <button
              onClick={() => setLogs([])}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
            >
              <X size={16} color="#EF4444" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E6EAF0",
          padding: "8px 16px",
          display: "flex",
          gap: 6,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {ALL_LEVELS.map((lvl) => {
          const color = lvl === "ALL" ? "#667085" : LEVEL_COLORS[lvl];
          const active = levelFilter === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              style={{
                flexShrink: 0,
                padding: "4px 10px",
                borderRadius: 20,
                border: active ? "none" : `1px solid ${lvl === "ALL" ? "#E6EAF0" : color}`,
                background: active ? color : "transparent",
                color: active ? "#FFFFFF" : color,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {lvl}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E6EAF0",
          padding: "8px 16px 10px",
        }}
      >
        <div style={{ position: "relative" }}>
          <Search
            size={14}
            color="#98A2B3"
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            style={{
              width: "100%",
              height: 36,
              background: "#F1F4F9",
              border: "none",
              borderRadius: 10,
              paddingLeft: 32,
              paddingRight: 12,
              fontSize: 13,
              color: "#111827",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Log terminal */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 16px 96px",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {visible.map((log) => (
          <div
            key={log.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              padding: "3px 6px",
              borderRadius: 4,
              lineHeight: 1.8,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#F7F9FC";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            {/* Timestamp */}
            <span
              style={{
                fontSize: 10,
                color: "#98A2B3",
                width: 88,
                flexShrink: 0,
                paddingTop: 1,
              }}
            >
              {log.ts}
            </span>

            {/* Level */}
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                width: 70,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: LEVEL_COLORS[log.level],
                  flexShrink: 0,
                  marginTop: 1,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: LEVEL_COLORS[log.level],
                }}
              >
                {log.level}
              </span>
            </span>

            {/* Worker */}
            <span
              style={{
                fontSize: 11,
                color: "#4F6FFF",
                width: 76,
                flexShrink: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {log.worker}
            </span>

            {/* Message */}
            <span
              style={{
                fontSize: 11,
                color: log.level === "ERROR" || log.level === "WARNING" ? "#111827" : "#667085",
                flex: 1,
                wordBreak: "break-word",
              }}
            >
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
