import { useState } from "react";
import {
  ChevronLeft,
  UploadCloud,
  CheckCircle2,
  Check,
} from "lucide-react";

const STEP_TITLES = [
  "Upload",
  "Configure",
  "Workers",
  "Review",
  "Done",
];

const TYPE_PILLS = ["Video", "Image", "Python", "Document", "Compression", "Custom"];
const PRIORITY_OPTIONS = [
  { key: "critical", label: "Critical", bg: "#FEF2F2", color: "#EF4444" },
  { key: "high", label: "High", bg: "#FFF7ED", color: "#F59E0B" },
  { key: "medium", label: "Medium", bg: "#F3E8FF", color: "#8B5CF6" },
  { key: "low", label: "Low", bg: "#F1F4F9", color: "#667085" },
];
const FILE_TYPE_CARDS = [
  { emoji: "📷", label: "Images", ext: ".jpg .png" },
  { emoji: "🎬", label: "Videos", ext: ".mp4 .mkv" },
  { emoji: "📄", label: "Documents", ext: ".pdf" },
  { emoji: "🐍", label: "Python", ext: ".py" },
];
const SOURCE_BUTTONS = ["Camera", "Files App", "Gallery"];
const WORKER_OPTIONS = [
  { id: "w1", name: "RPi-4 Node A", cpu: 28, ram: 45, online: true, color: "#8B5CF6" },
  { id: "w2", name: "RPi-4 Node B", cpu: 51, ram: 62, online: true, color: "#7C5CFC" },
  { id: "w3", name: "x86 Worker-1", cpu: 14, ram: 33, online: true, color: "#10B981" },
  { id: "w4", name: "x86 Worker-2", cpu: 67, ram: 78, online: true, color: "#F59E0B" },
  { id: "w5", name: "RPi-3 Backup", cpu: 5, ram: 18, online: false, color: "#98A2B3" },
];

interface CreateTaskPageProps {
  onBack: () => void;
  onSubmitted: (taskId: string) => void;
}

export default function CreateTaskPage({ onBack, onSubmitted }: CreateTaskPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("Video");
  const [priority, setPriority] = useState("medium");
  const [splitSize, setSplitSize] = useState(10);
  const [description, setDescription] = useState("");
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>(["w1", "w2", "w3"]);
  const [submittedId] = useState(() => `task-${String(Math.floor(Math.random() * 9000) + 1000)}`);

  const totalChunks = Math.ceil((splitSize > 0 ? 8400 / splitSize : 0));
  const chunkSizeMB = splitSize;

  function toggleWorker(id: string) {
    setSelectedWorkers((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  }

  function handleNext() {
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
    } else if (currentStep === 4) {
      setCurrentStep(5);
      setTimeout(() => onSubmitted(submittedId), 1000);
    }
  }

  const prioStyle = PRIORITY_OPTIONS.find((p) => p.key === priority);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F9FC", display: "flex", flexDirection: "column" }}>
      {/* Step indicator header */}
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
          paddingBottom: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 12,
          }}
        >
          <button
            onClick={currentStep === 1 ? onBack : () => setCurrentStep((s) => s - 1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#111827",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ChevronLeft size={22} />
          </button>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>
            {STEP_TITLES[currentStep - 1]}
          </span>
          <span style={{ fontSize: 13, color: "#98A2B3" }}>
            {currentStep < 5 ? `${currentStep} of 5` : ""}
          </span>
        </div>
        {/* Step progress segments */}
        <div style={{ display: "flex", gap: 3, paddingBottom: 0, marginBottom: 0 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                background: i < currentStep ? "#8B5CF6" : "#F1F4F9",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: currentStep === 5 ? 32 : 96 }}>
        {/* STEP 1 — Upload */}
        {currentStep === 1 && (
          <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#111827" }}>Choose File</div>
              <div style={{ fontSize: 13, color: "#98A2B3", marginTop: 4 }}>
                Select files to process
              </div>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const names = Array.from(e.dataTransfer.files).map((f) => f.name);
                setSelectedFiles((prev) => [...prev, ...names]);
              }}
              style={{
                background: isDragging ? "#F3E8FF" : "#F7F9FC",
                border: `2px dashed ${isDragging ? "#8B5CF6" : "#E6EAF0"}`,
                borderRadius: 16,
                padding: "40px 24px",
                textAlign: "center",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onClick={() => setSelectedFiles((prev) => [...prev, `file-${Date.now()}.mp4`])}
            >
              <UploadCloud size={48} color="#8B5CF6" style={{ margin: "0 auto 12px" }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>
                Tap to choose file
              </div>
              <div style={{ fontSize: 13, color: "#98A2B3", marginTop: 4 }}>
                or drag & drop here
              </div>
            </div>

            {/* File type cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {FILE_TYPE_CARDS.map((ft) => (
                <div
                  key={ft.label}
                  className="card-sm"
                  onClick={() => setSelectedFileType(ft.label)}
                  style={{
                    padding: 16,
                    textAlign: "center",
                    cursor: "pointer",
                    border: selectedFileType === ft.label
                      ? "2px solid #8B5CF6"
                      : "1px solid #E6EAF0",
                    background: selectedFileType === ft.label ? "#F3E8FF" : "#FFFFFF",
                  }}
                >
                  <div style={{ fontSize: 28 }}>{ft.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginTop: 6 }}>
                    {ft.label}
                  </div>
                  <div style={{ fontSize: 11, color: "#98A2B3", marginTop: 2 }}>
                    {ft.ext}
                  </div>
                </div>
              ))}
            </div>

            {/* Source buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SOURCE_BUTTONS.map((src) => (
                <button
                  key={src}
                  style={{
                    height: 44,
                    background: "#F1F4F9",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#111827",
                    cursor: "pointer",
                  }}
                >
                  {src}
                </button>
              ))}
            </div>

            {/* File chips */}
            {selectedFiles.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {selectedFiles.map((f, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#F3E8FF",
                      color: "#8B5CF6",
                      fontSize: 12,
                      fontWeight: 500,
                      borderRadius: 99,
                      padding: "4px 10px",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2 — Configure */}
        {currentStep === 2 && (
          <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#667085", display: "block", marginBottom: 6 }}>
                Task Name
              </label>
              <input
                className="input-field"
                style={{ height: 44, paddingLeft: 16, paddingRight: 16 }}
                placeholder="e.g. 4K Video Transcoding — Episode 12"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#667085", display: "block", marginBottom: 8 }}>
                Task Type
              </label>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
                {TYPE_PILLS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTaskType(t)}
                    style={{
                      flexShrink: 0,
                      padding: "7px 14px",
                      borderRadius: 99,
                      border: taskType === t ? "1.5px solid #8B5CF6" : "1.5px solid #E6EAF0",
                      background: taskType === t ? "#F3E8FF" : "#FFFFFF",
                      color: taskType === t ? "#8B5CF6" : "#667085",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#667085", display: "block", marginBottom: 8 }}>
                Priority
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {PRIORITY_OPTIONS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPriority(p.key)}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 99,
                      border: priority === p.key ? `1.5px solid ${p.color}` : "1.5px solid #E6EAF0",
                      background: priority === p.key ? p.bg : "#FFFFFF",
                      color: priority === p.key ? p.color : "#667085",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#667085", display: "block", marginBottom: 6 }}>
                Split Size
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={splitSize}
                  onChange={(e) => setSplitSize(Number(e.target.value))}
                  style={{ flex: 1, accentColor: "#8B5CF6" }}
                />
                <span style={{ fontSize: 13, color: "#111827", fontWeight: 600, minWidth: 28, textAlign: "right" }}>
                  {splitSize}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#98A2B3" }}>
                {totalChunks} chunks · ~{chunkSizeMB} MB each
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#667085", display: "block", marginBottom: 6 }}>
                Description
              </label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Optional task description…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: "none", paddingLeft: 12, paddingTop: 10, paddingRight: 12, paddingBottom: 10, lineHeight: 1.5 }}
              />
            </div>
          </div>
        )}

        {/* STEP 3 — Workers */}
        {currentStep === 3 && (
          <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#111827" }}>Select Workers</div>
              <button
                onClick={() => setSelectedWorkers(WORKER_OPTIONS.filter((w) => w.online).map((w) => w.id))}
                style={{
                  background: "#F3E8FF",
                  color: "#8B5CF6",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Auto Select
              </button>
            </div>

            {WORKER_OPTIONS.map((w) => {
              const selected = selectedWorkers.includes(w.id);
              return (
                <div
                  key={w.id}
                  className="card-sm"
                  onClick={() => toggleWorker(w.id)}
                  style={{
                    padding: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    border: selected ? `1.5px solid #8B5CF6` : "1px solid #E6EAF0",
                    background: selected ? "#F3E8FF08" : "#FFFFFF",
                    opacity: w.online ? 1 : 0.5,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: w.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {w.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>
                      {w.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#98A2B3", marginTop: 2 }}>
                      CPU {w.cpu}% · RAM {w.ram}%
                    </div>
                  </div>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: w.online ? "#10B981" : "#98A2B3",
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 5,
                      border: selected ? "none" : "1.5px solid #E6EAF0",
                      background: selected ? "#8B5CF6" : "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {selected && <Check size={12} color="#fff" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}

            <div
              style={{
                fontSize: 13,
                color: "#667085",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              {selectedWorkers.length} of {WORKER_OPTIONS.length} workers selected
            </div>
          </div>
        )}

        {/* STEP 4 — Review */}
        {currentStep === 4 && (
          <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#111827" }}>Review</div>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              {[
                {
                  section: "File",
                  value: selectedFiles.length > 0 ? selectedFiles[0] : "No file selected",
                  step: 1,
                },
                { section: "Task Name", value: taskName || "(untitled)", step: 2 },
                { section: "Type", value: taskType, step: 2 },
                {
                  section: "Priority",
                  value: PRIORITY_OPTIONS.find((p) => p.key === priority)?.label ?? priority,
                  step: 2,
                },
                { section: "Split Size", value: `${splitSize} chunks · ~${chunkSizeMB} MB each`, step: 2 },
                {
                  section: "Workers",
                  value: `${selectedWorkers.length} workers selected`,
                  step: 3,
                },
                {
                  section: "Est. Time",
                  value: "~41 min",
                  step: undefined,
                },
              ].map((row, i, arr) => (
                <div
                  key={row.section}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderBottom: i < arr.length - 1 ? "1px solid #E6EAF0" : "none",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: "#98A2B3" }}>{row.section}</div>
                    <div style={{ fontSize: 14, color: "#111827", fontWeight: 500, marginTop: 2 }}>
                      {row.value}
                    </div>
                  </div>
                  {row.step !== undefined && (
                    <button
                      onClick={() => setCurrentStep(row.step!)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#8B5CF6",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5 — Success */}
        {currentStep === 5 && (
          <div
            style={{
              padding: "48px 24px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              textAlign: "center",
            }}
          >
            <CheckCircle2 size={64} color="#10B981" />
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
              Task Submitted!
            </div>
            <div
              className="mono"
              style={{
                fontSize: 14,
                color: "#667085",
                background: "#F1F4F9",
                padding: "6px 16px",
                borderRadius: 8,
              }}
            >
              {submittedId}
            </div>
            <div style={{ fontSize: 13, color: "#98A2B3" }}>
              Estimated runtime: ~41 min
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", marginTop: 16 }}>
              <button
                className="btn-primary"
                style={{ height: 48, width: "100%" }}
                onClick={() => onSubmitted(submittedId)}
              >
                View Task
              </button>
              <button
                className="btn-secondary"
                style={{ height: 48, width: "100%" }}
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedFiles([]);
                  setTaskName("");
                  setSelectedWorkers(["w1", "w2", "w3"]);
                }}
              >
                Create Another
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Next / Submit button */}
      {currentStep < 5 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "12px 16px 24px",
            background: "#FFFFFF",
            borderTop: "1px solid #E6EAF0",
            zIndex: 20,
          }}
        >
          <button
            className="btn-primary"
            style={{ height: 48, width: "100%" }}
            onClick={handleNext}
          >
            {currentStep === 4 ? "Submit Task" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
