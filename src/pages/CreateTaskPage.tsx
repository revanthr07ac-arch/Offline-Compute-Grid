import { useState, useRef } from "react";
import {
  ChevronLeft,
  UploadCloud,
  CheckCircle2,
  Check,
  Server,
  Cpu,
  Layers,
  ArrowRight,
  FileCode,
  Sliders,
  Sparkles,
  X,
  Bot,
  RefreshCw,
} from "lucide-react";
import { useToast } from "../components/Toast";
import { generateOptimalTaskConfig } from "../services/geminiService";

const STEP_TITLES = [
  "Payload",
  "Configuration",
  "Node Allocation",
  "Review & Dispatch",
  "Complete",
];

const TYPE_PILLS = [
  "4K Video Transcode",
  "PyTorch DDP",
  "OCR Batch",
  "Blender Render",
  "Data Hash",
  "Custom Binary"
];

const PRIORITY_OPTIONS = [
  { key: "critical", label: "Critical", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)", color: "#EF4444" },
  { key: "high", label: "High", bg: "rgba(255,122,0,0.15)", border: "rgba(255,122,0,0.3)", color: "#FF7A00" },
  { key: "medium", label: "Medium", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", color: "#F59E0B" },
  { key: "low", label: "Low", bg: "rgba(142,146,158,0.15)", border: "rgba(142,146,158,0.3)", color: "#8E929E" },
];

const WORKER_OPTIONS = [
  { id: "w1", name: "DESKTOP-A7X (Master)", cpu: 78, ram: 65, online: true, role: "Coordinator & High VRAM" },
  { id: "w2", name: "Mac-Studio (M2 Max)", cpu: 42, ram: 58, online: true, role: "Metal GPU Compute" },
  { id: "w3", name: "Worker-Rig-RTX", cpu: 84, ram: 76, online: true, role: "CUDA Acceleration" },
  { id: "w4", name: "Laptop-Dev", cpu: 32, ram: 44, online: true, role: "General Worker" },
  { id: "w5", name: "RPi-4 Node A", cpu: 18, ram: 25, online: true, role: "Edge Chunk Node" },
];

interface CreateTaskPageProps {
  onBack: () => void;
  onSubmitted: (taskId: string) => void;
}

export default function CreateTaskPage({ onBack, onSubmitted }: CreateTaskPageProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>(["batch_input_stream.raw"]);
  const [taskName, setTaskName] = useState("Distributed H.265 Render Batch");
  const [taskType, setTaskType] = useState("4K Video Transcode");
  const [priority, setPriority] = useState<"critical" | "high" | "medium" | "low">("high");
  const [splitSize, setSplitSize] = useState(250); // MB
  const [description, setDescription] = useState("Automated multi-worker split & encode across LAN grid nodes.");
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>(["w1", "w2", "w3", "w4"]);
  const [submittedId] = useState(() => `t-${Math.floor(Math.random() * 9000 + 1000)}`);
  const [isOptimizingWithAI, setIsOptimizingWithAI] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);

  const handleAiAutoConfig = async () => {
    setIsOptimizingWithAI(true);
    try {
      const config = await generateOptimalTaskConfig(
        taskName || "Distributed Cluster Computation",
        WORKER_OPTIONS
      );
      setTaskName(config.taskName);
      setTaskType(config.taskType);
      setPriority(config.priority);
      setSplitSize(config.splitSize);
      if (config.selectedWorkerIds?.length) {
        setSelectedWorkers(config.selectedWorkerIds);
      }
      setAiReasoning(config.reasoning);
      showToast({ type: "success", message: "Gemini AI configured task parameters for optimal throughput!" });
    } catch {
      showToast({ type: "error", message: "Failed to optimize task with Gemini." });
    } finally {
      setIsOptimizingWithAI(false);
    }
  };

  const toggleWorker = (id: string) => {
    setSelectedWorkers((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const handleSelectAllWorkers = () => {
    if (selectedWorkers.length === WORKER_OPTIONS.length) {
      setSelectedWorkers(["w1"]);
    } else {
      setSelectedWorkers(WORKER_OPTIONS.map((w) => w.id));
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const names = Array.from(e.dataTransfer.files).map((f) => f.name);
      setSelectedFiles((prev) => [...prev, ...names]);
      showToast({ type: "success", message: `Added ${names.length} file(s).` });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((f) => f.name);
      setSelectedFiles((prev) => [...prev, ...names]);
      showToast({ type: "success", message: `Added ${names.length} file(s).` });
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedFiles.length === 0) {
      showToast({ type: "warning", message: "Please select at least one file or payload." });
      return;
    }
    if (currentStep === 2 && !taskName.trim()) {
      showToast({ type: "warning", message: "Please provide a task name." });
      return;
    }
    if (currentStep === 3 && selectedWorkers.length === 0) {
      showToast({ type: "warning", message: "Please select at least one worker node." });
      return;
    }

    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
    } else if (currentStep === 4) {
      // Create actual task in localStorage
      const newTask = {
        id: submittedId,
        name: taskName.trim(),
        type: taskType,
        priority: priority,
        progress: 0,
        eta: "Starting...",
        workers: selectedWorkers.length,
        size: `${selectedFiles.length * 1.4} GB`,
        by: "REVANTH R",
        status: "running" as const,
      };

      try {
        const saved = localStorage.getItem("ocg_tasks");
        const existing = saved ? JSON.parse(saved) : [];
        localStorage.setItem("ocg_tasks", JSON.stringify([newTask, ...existing]));
      } catch {}

      setCurrentStep(5);
      showToast({ type: "success", message: "Task compiled and dispatched to cluster!" });
      setTimeout(() => onSubmitted(submittedId), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] pb-24 flex flex-col">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Top step navigation header */}
      <div className="sticky top-0 z-30 bg-[#111217]/95 backdrop-blur-md border-b border-[#24262E] px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#8E929E] hover:text-[#FFFFFF] cursor-pointer"
          >
            <ChevronLeft size={18} /> Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAiAutoConfig}
              disabled={isOptimizingWithAI}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white hover:brightness-110 shadow-md shadow-[#FF7A00]/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isOptimizingWithAI ? (
                <RefreshCw size={13} className="animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              <span>Auto-Tune with Gemini</span>
            </button>
            <span className="text-xs font-bold text-[#FF7A00] hidden sm:inline">
              Step {currentStep} of {STEP_TITLES.length}: {STEP_TITLES[currentStep - 1]}
            </span>
          </div>
        </div>

        {aiReasoning && (
          <div className="mt-2 mb-1 px-3 py-1.5 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 flex items-center justify-between text-xs text-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <Bot size={14} className="text-[#FF7A00]" />
              <span>
                <strong>Gemini Recommendation:</strong> {aiReasoning}
              </span>
            </div>
            <button
              onClick={() => setAiReasoning(null)}
              className="text-[#8E929E] hover:text-white ml-2"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Step Progress Line */}
        <div className="grid grid-cols-5 gap-1.5">
          {STEP_TITLES.map((title, i) => {
            const stepNum = i + 1;
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;
            return (
              <div key={title} className="flex flex-col gap-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isDone
                      ? "bg-gradient-to-r from-[#FF7A00] to-[#FF5500]"
                      : isCurrent
                      ? "bg-[#FF7A00] shadow-[0_0_8px_rgba(255,122,0,0.6)]"
                      : "bg-[#24262E]"
                  }`}
                />
                <span className={`text-[10px] truncate hidden md:inline ${
                  isCurrent ? "text-[#FF7A00] font-bold" : "text-[#8E929E]"
                }`}>
                  {title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 pt-6 flex-1">
        {/* STEP 1: UPLOAD */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-[#FFFFFF]">Select Input Data or Binaries</h2>
              <p className="text-xs text-[#8E929E] mt-0.5">
                Drop datasets, raw video streams, or scripts to distribute across cluster memory.
              </p>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[#FF7A00] bg-[#FF7A00]/10"
                  : "border-[#282A32] bg-[#14151B] hover:border-[#FF7A00]/60 hover:bg-[#18191E]"
              }`}
            >
              <UploadCloud size={36} className="mx-auto text-[#FF7A00] mb-3" />
              <p className="text-sm font-semibold text-[#FFFFFF]">
                Click or drag files here to upload
              </p>
              <p className="text-xs text-[#8E929E] mt-1">
                Supports video (.mp4, .mkv), archives (.zip, .tar), models (.pt, .onnx), code (.py)
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="bg-[#14151B] border border-[#24262E] rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#8E929E]">
                  <span>Queued Payloads ({selectedFiles.length})</span>
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="text-[#FF7A00] hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                {selectedFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-[#0B0C0E] border border-[#20222A] rounded-lg px-3 py-2 text-xs"
                  >
                    <span className="font-mono text-[#FFFFFF] truncate max-w-[260px]">{f}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i));
                      }}
                      className="text-[#8E929E] hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: CONFIGURE */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-[#FFFFFF]">Task Parameters</h2>
              <p className="text-xs text-[#8E929E] mt-0.5">
                Configure job priority and chunk splitting policy.
              </p>
            </div>

            <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8E929E] block mb-1.5">
                  Job Name
                </label>
                <input
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="e.g. 4K Video Transcoding Batch"
                  className="w-full h-10 bg-[#0B0C0E] border border-[#282A32] rounded-xl px-3 text-sm text-[#FFFFFF] focus:outline-none focus:border-[#FF7A00]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8E929E] block mb-1.5">
                  Workload Engine Preset
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {TYPE_PILLS.map((type) => (
                    <button
                      key={type}
                      onClick={() => setTaskType(type)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                        taskType === type
                          ? "bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-white shadow-sm"
                          : "bg-[#0B0C0E] border border-[#282A32] text-[#8E929E] hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8E929E] block mb-1.5">
                  Execution Priority
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRIORITY_OPTIONS.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setPriority(p.key as any)}
                      className={`py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                        priority === p.key
                          ? "border border-[#FF7A00] text-[#FF7A00] bg-[#FF7A00]/15"
                          : "bg-[#0B0C0E] border border-[#282A32] text-[#8E929E]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-[#8E929E]">Chunk Partition Size</span>
                  <span className="font-mono text-[#FF7A00] font-bold">{splitSize} MB per Chunk</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={splitSize}
                  onChange={(e) => setSplitSize(Number(e.target.value))}
                  className="w-full accent-[#FF7A00] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8E929E] block mb-1.5">
                  Task Execution Notes
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0B0C0E] border border-[#282A32] rounded-xl p-3 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#FF7A00]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: WORKERS */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#FFFFFF]">Select Compute Nodes</h2>
                <p className="text-xs text-[#8E929E] mt-0.5">
                  Choose which LAN devices will participate in the workload mesh.
                </p>
              </div>
              <button
                onClick={handleSelectAllWorkers}
                className="text-xs text-[#FF7A00] hover:underline font-semibold"
              >
                {selectedWorkers.length === WORKER_OPTIONS.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="space-y-2.5">
              {WORKER_OPTIONS.map((node) => {
                const isSelected = selectedWorkers.includes(node.id);
                return (
                  <div
                    key={node.id}
                    onClick={() => toggleWorker(node.id)}
                    className={`bg-[#14151B] border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#FF7A00] shadow-[0_0_12px_rgba(255,122,0,0.15)] bg-[#18191E]"
                        : "border-[#24262E] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-[#FF7A00] border-[#FF7A00] text-black"
                            : "border-[#282A32] bg-[#0B0C0E]"
                        }`}
                      >
                        {isSelected && <Check size={14} className="stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#FFFFFF]">{node.name}</p>
                        <p className="text-[11px] text-[#8E929E]">{node.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-[#8E929E] block">CPU</span>
                        <span className="text-[#FF7A00] font-bold">{node.cpu}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8E929E] block">RAM</span>
                        <span className="text-[#E5E7EB] font-bold">{node.ram}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & DISPATCH */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-[#FFFFFF]">Review & Confirm Dispatch</h2>
              <p className="text-xs text-[#8E929E] mt-0.5">
                Verify cluster allocation details before broadcasting job instructions.
              </p>
            </div>

            <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 space-y-3.5">
              <div className="flex justify-between items-center pb-3 border-b border-[#24262E]">
                <span className="text-xs text-[#8E929E]">Task Name</span>
                <span className="text-xs font-bold text-[#FFFFFF]">{taskName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#24262E]">
                <span className="text-xs text-[#8E929E]">Engine</span>
                <span className="text-xs font-bold text-[#FF7A00]">{taskType}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#24262E]">
                <span className="text-xs text-[#8E929E]">Priority Level</span>
                <span className="text-xs font-bold uppercase text-[#FF7A00]">{priority}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#24262E]">
                <span className="text-xs text-[#8E929E]">Payloads Queued</span>
                <span className="text-xs font-mono text-[#FFFFFF]">{selectedFiles.length} file(s)</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#24262E]">
                <span className="text-xs text-[#8E929E]">Worker Allocation</span>
                <span className="text-xs font-bold text-emerald-400">{selectedWorkers.length} nodes assigned</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#8E929E]">Chunk Granularity</span>
                <span className="text-xs font-mono text-[#E5E7EB]">{splitSize} MB chunks</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: DONE */}
        {currentStep === 5 && (
          <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#FF7A00]/15 border border-[#FF7A00]/40 mx-auto flex items-center justify-center text-[#FF7A00] shadow-[0_0_24px_rgba(255,122,0,0.4)]">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-lg font-bold text-[#FFFFFF]">Task Successfully Dispatched!</h2>
            <p className="text-xs text-[#8E929E] max-w-sm mx-auto">
              Broadcasted task <span className="text-[#FF7A00] font-mono">{submittedId}</span> to {selectedWorkers.length} worker nodes. Opening live inspector...
            </p>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Footer */}
      {currentStep < 5 && (
        <div className="sticky bottom-0 bg-[#111217]/95 backdrop-blur-md border-t border-[#24262E] px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => currentStep > 1 && setCurrentStep((s) => s - 1)}
            disabled={currentStep === 1}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentStep === 1
                ? "opacity-30 text-[#8E929E] cursor-not-allowed"
                : "bg-[#18191E] border border-[#282A32] text-white hover:bg-[#20222A]"
            }`}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white shadow-[0_2px_12px_rgba(255,122,0,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {currentStep === 4 ? "Dispatch Workload" : "Continue"}
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
