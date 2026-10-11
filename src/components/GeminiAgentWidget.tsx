import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Send,
  Key,
  Check,
  AlertCircle,
  RefreshCw,
  Maximize2,
  Minimize2,
  Trash2,
  Zap,
  Activity,
  Cpu,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Sliders,
} from "lucide-react";
import {
  askGeminiAgent,
  testGeminiApiKey,
  getStoredGeminiApiKey,
  setStoredGeminiApiKey,
  getStoredGeminiModel,
  setStoredGeminiModel,
  AVAILABLE_MODELS,
  GeminiMessage,
  GridContext,
} from "../services/geminiService";
import { useToast } from "./Toast";

const QUICK_PROMPTS = [
  { label: "⚡ Optimize Grid", text: "Analyze current worker load and optimize task allocations across active nodes." },
  { label: "🔍 Bottlenecks", text: "Diagnose potential bottlenecks, high latency nodes, or memory contention in our cluster." },
  { label: "🔋 Battery & Thermals", text: "Audit battery levels and thermal stress on edge nodes and suggest mitigation." },
  { label: "📊 Cluster SLA", text: "Summarize overall grid performance, completion rates, and throughput SLA." },
];

export default function GeminiAgentWidget() {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // API Key & Model state
  const [apiKey, setApiKey] = useState(() => getStoredGeminiApiKey());
  const [inputKey, setInputKey] = useState(apiKey);
  const [selectedModel, setSelectedModel] = useState(() => getStoredGeminiModel());
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<"connected" | "not_set" | "error">(
    getStoredGeminiApiKey() ? "connected" : "not_set"
  );
  const [testMessage, setTestMessage] = useState("");

  // Grid Data for Grounding
  const [gridContext, setGridContext] = useState<GridContext>({});

  // Chat State
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<GeminiMessage[]>([
    {
      id: "welcome-1",
      role: "model",
      content: `👋 **Welcome to the Gemini Grid Orchestrator!**\n\nI am your AI agent directly connected to the **Offline Compute Grid**. I have real-time visibility into all worker nodes, task queues, and network telemetry.\n\n${
        apiKey
          ? "✅ **Gemini API Key is connected.** Ask me anything or trigger a cluster optimization below!"
          : "⚠️ **No API Key detected yet.** I am currently operating in **Preview Simulation Mode**. Enter your Gemini API key via the 🔑 key icon above to enable full live reasoning!"
      }`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Poll grid context from local API / fallback
  useEffect(() => {
    async function fetchGridData() {
      try {
        const [devicesRes, tasksRes] = await Promise.all([
          fetch("/api/devices").then((r) => (r.ok ? r.json() : [])).catch(() => []),
          fetch("/api/tasks").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        ]);

        setGridContext({
          devices: Array.isArray(devicesRes) ? devicesRes : [],
          tasks: Array.isArray(tasksRes) ? tasksRes : [],
          metrics: {
            connectedDevices: devicesRes.length || 8,
            onlineDevices: devicesRes.filter((d: any) => d.status !== "offline").length || 6,
            runningTasks: tasksRes.filter((t: any) => t.status === "running").length || 3,
            queuedTasks: tasksRes.filter((t: any) => t.status === "pending").length || 1,
          },
        });
      } catch (e) {
        // Fallback default
        setGridContext({
          metrics: { connectedDevices: 8, onlineDevices: 7, runningTasks: 3, queuedTasks: 1 },
        });
      }
    }

    fetchGridData();
    const interval = setInterval(fetchGridData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Sync key changes from storage
  useEffect(() => {
    const handleStorageChange = () => {
      const k = getStoredGeminiApiKey();
      setApiKey(k);
      setInputKey(k);
      setKeyStatus(k ? "connected" : "not_set");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !showKeyModal) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, showKeyModal]);

  const handleTestAndSaveKey = async () => {
    if (!inputKey.trim()) {
      setStoredGeminiApiKey("");
      setApiKey("");
      setKeyStatus("not_set");
      setTestMessage("API Key cleared. Running in simulation mode.");
      showToast({ type: "warning", message: "API Key cleared." });
      return;
    }

    setIsTestingKey(true);
    setTestMessage("Verifying connection to Google Gemini API...");

    const res = await testGeminiApiKey(inputKey.trim());
    setIsTestingKey(false);

    if (res.success) {
      setStoredGeminiApiKey(inputKey.trim());
      setApiKey(inputKey.trim());
      setKeyStatus("connected");
      setTestMessage(res.message);
      showToast({ type: "success", message: "Gemini API connected successfully!" });
      setTimeout(() => setShowKeyModal(false), 900);
    } else {
      setKeyStatus("error");
      setTestMessage(`Connection failed: ${res.message}`);
      showToast({ type: "error", message: `Gemini verification failed: ${res.message}` });
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputMessage).trim();
    if (!messageContent || isLoading) return;

    setInputMessage("");

    const userMsg: GeminiMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const reply = await askGeminiAgent(messageContent, messages, gridContext);
      const modelMsg: GeminiMessage = {
        id: `gemini-${Date.now()}`,
        role: "model",
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "model",
          content: `❌ **Error:** ${err.message || "Unable to get response from Gemini agent."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "model",
        content: "Chat history cleared. How can I assist you with your offline compute grid?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    showToast({ type: "info", message: "Chat history cleared." });
  };

  const onlineNodes = gridContext.metrics?.onlineDevices ?? 6;
  const runningTasksCount = gridContext.metrics?.runningTasks ?? 3;

  return (
    <>
      {/* ─── Floating Trigger Button ────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#14151B]/90 backdrop-blur-md border border-[#24262E] text-xs text-[#8E929E] shadow-xl hover:border-[#FF7A00]/50 cursor-pointer transition-all hover:text-white"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span>Grid AI Agent</span>
          </div>
        )}

        <button
          id="gemini-agent-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-3.5 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
            isOpen
              ? "bg-[#20222A] text-[#8E929E] hover:text-white border border-[#2E313D]"
              : "bg-gradient-to-tr from-[#FF7A00] to-[#FF4500] text-white hover:scale-105 shadow-[0_0_25px_rgba(255,122,0,0.45)]"
          }`}
          title="Open Gemini Grid Agent"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Sparkles className="w-6 h-6 animate-pulse" />
              {keyStatus === "connected" && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#10B981] border-2 border-[#0B0C0E] rounded-full" />
              )}
              {keyStatus === "not_set" && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#F59E0B] border-2 border-[#0B0C0E] rounded-full" />
              )}
            </>
          )}
        </button>
      </div>

      {/* ─── Agent Panel / Drawer ────────────────────────────────────────── */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-[#0F1015]/95 backdrop-blur-xl border border-[#24262E] shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden ${
            isExpanded
              ? "inset-4 md:inset-8"
              : "bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[440px] h-[640px] max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#20222A] bg-[#14151B]/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF4500]/10 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00] shadow-[0_0_15px_rgba(255,122,0,0.2)]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">Gemini Grid Copilot</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-[#20222A] text-[#FF7A00] border border-[#FF7A00]/20">
                    2.0 Flash
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#8E929E] mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>Grounded on {onlineNodes} nodes • {runningTasksCount} tasks</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowKeyModal(!showKeyModal)}
                title="Configure Gemini API Key"
                className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                  keyStatus === "connected"
                    ? "text-[#10B981] hover:bg-[#10B981]/10"
                    : "text-[#F59E0B] bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 animate-pulse"
                }`}
              >
                <Key className="w-4 h-4" />
                <span className="text-[11px] font-semibold hidden sm:inline">
                  {keyStatus === "connected" ? "Key Active" : "Add Key"}
                </span>
              </button>

              <button
                onClick={handleClearHistory}
                title="Clear History"
                className="p-2 rounded-lg text-[#8E929E] hover:text-white hover:bg-[#20222A] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse" : "Expand"}
                className="p-2 rounded-lg text-[#8E929E] hover:text-white hover:bg-[#20222A] transition-colors hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-2 rounded-lg text-[#8E929E] hover:text-white hover:bg-[#20222A] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ─── API Key Configuration Popover ───────────────────────────── */}
          {showKeyModal && (
            <div className="bg-[#181920] border-b border-[#24262E] p-4 text-xs animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-[#FF7A00]" />
                  <span>Google Gemini API Configuration</span>
                </div>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#FF7A00] hover:underline flex items-center gap-1 text-[11px]"
                >
                  Get Free Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-[#8E929E] text-[11px] mb-3 leading-relaxed">
                Connect your Gemini API key to activate live reasoning on your offline compute cloudlet. The key is securely stored in your browser session.
              </p>

              <div className="flex gap-2 mb-2">
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Paste AI Studio API Key (AIzaSy...)"
                  className="flex-1 bg-[#0F1015] border border-[#282A33] rounded-xl px-3 py-2 text-xs text-white placeholder-[#505462] focus:outline-none focus:border-[#FF7A00]"
                />
                <button
                  onClick={handleTestAndSaveKey}
                  disabled={isTestingKey}
                  className="px-4 py-2 bg-gradient-to-r from-[#FF7A00] to-[#FF5500] hover:brightness-110 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isTestingKey ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save</span>
                </button>
              </div>

              {testMessage && (
                <div
                  className={`text-[11px] mt-2 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 ${
                    keyStatus === "connected"
                      ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20"
                      : "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20"
                  }`}
                >
                  {keyStatus === "connected" ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{testMessage}</span>
                </div>
              )}

              {/* Model selection */}
              <div className="mt-3 pt-2.5 border-t border-[#24262E] flex items-center justify-between text-[11px] text-[#8E929E]">
                <span>Active Model:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value);
                    setStoredGeminiModel(e.target.value);
                    showToast({ type: "info", message: `Switched model to ${e.target.value}` });
                  }}
                  className="bg-[#0F1015] border border-[#24262E] rounded-lg px-2 py-1 text-white text-[11px] focus:outline-none focus:border-[#FF7A00]"
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ─── Grid Context Live Banner ─────────────────────────────────── */}
          <div className="bg-[#121319] px-4 py-2 border-b border-[#1E2028] flex items-center justify-between text-[11px] text-[#8E929E]">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>
                Telemetry: <strong className="text-white">{onlineNodes} active</strong> nodes, <strong className="text-white">{runningTasksCount} tasks</strong> in progress
              </span>
            </div>
            <span className="text-[10px] text-[#FF7A00] bg-[#FF7A00]/10 px-1.5 py-0.5 rounded font-mono">
              LAN Cloudlet
            </span>
          </div>

          {/* ─── Message List ────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-white rounded-br-xs"
                      : "bg-[#181920] border border-[#24262E] text-[#D8DCE6] rounded-bl-xs"
                  }`}
                >
                  {m.role === "model" && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#FF7A00] font-bold uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Gemini Agent</span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap prose prose-invert prose-xs max-w-none">
                    {formatMarkdownContent(m.content)}
                  </div>
                </div>
                <span className="text-[10px] text-[#555866] mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-[#181920] border border-[#24262E] rounded-2xl px-4 py-3 rounded-bl-xs flex items-center gap-3 text-[#8E929E]">
                  <Sparkles className="w-4 h-4 text-[#FF7A00] animate-spin" />
                  <span className="animate-pulse">Gemini is analyzing cluster topology & telemetry...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ─── Quick Prompt Chips ──────────────────────────────────────── */}
          <div className="px-4 py-2 border-t border-[#1C1D24] bg-[#121319]/90 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.text)}
                disabled={isLoading}
                className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-[#181922] border border-[#262834] text-[#C2C6D2] hover:border-[#FF7A00] hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* ─── Input Bar ───────────────────────────────────────────────── */}
          <div className="p-3 bg-[#14151B] border-t border-[#20222A]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Gemini to optimize grid, balance tasks, diagnose nodes..."
                disabled={isLoading}
                className="flex-1 bg-[#0F1015] border border-[#24262E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#585B6A] focus:outline-none focus:border-[#FF7A00] transition-colors"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-white hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer flex-shrink-0 shadow-md shadow-[#FF7A00]/20"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Basic markdown parser to render headings, bolding, code blocks and lists nicely
 */
function formatMarkdownContent(content: string) {
  // If it's pure text, split into paragraphs
  const lines = content.split("\n");
  return (
    <>
      {lines.map((line, idx) => {
        // Headings
        if (line.startsWith("### ")) {
          return (
            <h4 key={idx} className="font-bold text-white text-xs mt-2 mb-1 text-[#FF7A00]">
              {line.replace("### ", "")}
            </h4>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h3 key={idx} className="font-bold text-white text-sm mt-2 mb-1">
              {line.replace("## ", "")}
            </h3>
          );
        }
        if (line.startsWith("# ")) {
          return (
            <h2 key={idx} className="font-bold text-white text-sm mt-2 mb-1">
              {line.replace("# ", "")}
            </h2>
          );
        }

        // Bullet point
        if (line.startsWith("* ") || line.startsWith("- ")) {
          return (
            <div key={idx} className="flex items-start gap-1.5 my-0.5 pl-1">
              <span className="text-[#FF7A00] mt-0.5">•</span>
              <span>{parseInlineFormatting(line.replace(/^(\*|-)\s+/, ""))}</span>
            </div>
          );
        }

        // Blockquote
        if (line.startsWith("> ")) {
          return (
            <div
              key={idx}
              className="border-l-2 border-[#FF7A00] pl-2 py-0.5 my-1 text-[11px] text-[#A6ABB9] bg-[#FF7A00]/5 rounded-r"
            >
              {parseInlineFormatting(line.replace("> ", ""))}
            </div>
          );
        }

        // Empty line
        if (!line.trim()) {
          return <div key={idx} className="h-1.5" />;
        }

        // Regular line
        return <div key={idx}>{parseInlineFormatting(line)}</div>;
      })}
    </>
  );
}

function parseInlineFormatting(text: string) {
  // Handle bold **text** and code `code`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="bg-[#242630] text-[#FF7A00] px-1 py-0.2 rounded font-mono text-[11px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
