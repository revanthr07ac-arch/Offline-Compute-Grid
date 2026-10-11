import { useState, useRef } from "react";
import {
  ChevronRight,
  Shield,
  Wifi,
  Cpu,
  Bell,
  Database,
  Info,
  Key,
  Lock,
  Download,
  Upload,
  RefreshCw,
  RotateCcw,
  X,
  Copy,
  Check,
  Sparkles,
  Eye,
  EyeOff,
  Bot
} from "lucide-react";
import { useToast } from "../components/Toast";
import {
  getStoredGeminiApiKey,
  setStoredGeminiApiKey,
  getStoredGeminiModel,
  setStoredGeminiModel,
  testGeminiApiKey,
  AVAILABLE_MODELS
} from "../services/geminiService";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 flex-shrink-0 ${
        on
          ? "bg-gradient-to-r from-[#FF7A00] to-[#FF5500] shadow-[0_0_10px_rgba(255,122,0,0.5)]"
          : "bg-[#282A32]"
      }`}
    >
      <div
        className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-transform duration-200 shadow-md ${
          on ? "translate-x-5.5" : "translate-x-0.75"
        }`}
      />
    </div>
  );
}

interface SettingRowProps {
  label: string;
  subtitle?: string;
  right: React.ReactNode;
  onClick?: () => void;
}

function SettingRow({ label, subtitle, right, onClick }: SettingRowProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between py-3.5 px-4 min-h-[52px] transition-colors ${
        onClick ? "hover:bg-[#18191E] cursor-pointer" : ""
      }`}
    >
      <div className="flex-1 min-w-0 pr-3">
        <div className="text-xs font-semibold text-[#FFFFFF]">{label}</div>
        {subtitle && (
          <div className="text-[11px] text-[#8E929E] mt-0.5">{subtitle}</div>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">{right}</div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold text-[#FF7A00] uppercase tracking-wider mb-2 px-1">
      {icon}
      <span>{title}</span>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#14151B] border border-[#24262E] rounded-2xl overflow-hidden divide-y divide-[#20222A] shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings State
  const [themeMode, setThemeMode] = useState<"dark">("dark");
  const [confirmDestructive, setConfirmDestructive] = useState(true);
  const [masterNode, setMasterNode] = useState(true);
  const [discoveryPort, setDiscoveryPort] = useState("9000");
  const [heartbeatInterval, setHeartbeatInterval] = useState("5s");

  const [authentication, setAuthentication] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const [enableWorker, setEnableWorker] = useState(true);
  const [maxCpu, setMaxCpu] = useState("80%");
  const [maxRam, setMaxRam] = useState("70%");
  const [autoAccept, setAutoAccept] = useState(true);

  const [notifCompleted, setNotifCompleted] = useState(true);
  const [notifDisconnected, setNotifDisconnected] = useState(true);
  const [notifFailed, setNotifFailed] = useState(true);
  const [notifSound, setNotifSound] = useState(false);

  const [autoBackup, setAutoBackup] = useState(true);

  // Gemini AI Agent State
  const [geminiKey, setGeminiKey] = useState(() => getStoredGeminiApiKey());
  const [geminiModel, setGeminiModel] = useState(() => getStoredGeminiModel());
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<string>("Active & Verified");
  const [realtimeGrounding, setRealtimeGrounding] = useState(true);
  const [autoRebalance, setAutoRebalance] = useState(true);

  const handleSaveGeminiKey = async () => {
    setIsTestingGemini(true);
    const res = await testGeminiApiKey(geminiKey);
    setIsTestingGemini(false);
    if (res.success) {
      setStoredGeminiApiKey(geminiKey);
      setGeminiStatus("Active & Verified");
      showToast({ type: "success", message: res.message });
    } else {
      setGeminiStatus("Connection Failed");
      showToast({ type: "error", message: res.message });
    }
  };

  // Modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    { id: "k1", name: "Cluster Automation CLI", key: "ocg_live_89a3f21908bf41", created: "2 days ago" },
    { id: "k2", name: "Python Orchestration SDK", key: "ocg_live_45bc901ef4528a", created: "1 week ago" },
  ]);

  const [showResetModal, setShowResetModal] = useState(false);

  const handleExportDB = () => {
    const configData = {
      version: "1.0.0",
      engine: "Solar Engine",
      exportedAt: new Date().toISOString(),
      cluster: {
        masterNode,
        discoveryPort,
        heartbeatInterval,
        maxCpu,
        maxRam,
        activeTasks: 12,
        nodes: 8,
      },
      settings: {
        themeMode,
        confirmDestructive,
        authentication,
        biometric,
        twoFactor,
        enableWorker,
        autoAccept,
      },
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `offline_compute_grid_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast({ type: "success", message: "Cluster configuration database exported." });
  };

  const handleRestoreDB = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      showToast({ type: "success", message: `Restored settings from "${e.target.files[0].name}".` });
      e.target.value = "";
    }
  };

  const handleCheckUpdates = () => {
    showToast({ type: "info", message: "Checking cluster repo for updates..." });
    setTimeout(() => {
      showToast({ type: "success", message: "You are running the latest v1.0.0 Solar Engine build." });
    }, 1000);
  };

  const handleResetSettings = () => {
    setThemeMode("dark");
    setConfirmDestructive(true);
    setMasterNode(true);
    setEnableWorker(true);
    setAutoAccept(true);
    setShowResetModal(false);
    showToast({ type: "warning", message: "All system preferences reset to cluster defaults." });
  };

  const handleGenerateKey = () => {
    const newK = {
      id: `k-${Date.now()}`,
      name: `API Token #${apiKeys.length + 1}`,
      key: `ocg_live_${Math.random().toString(16).substring(2, 16)}`,
      created: "Just now",
    };
    setApiKeys((prev) => [newK, ...prev]);
    showToast({ type: "success", message: "New cluster API Key generated." });
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] pb-24">
      {/* Hidden file input for DB restore */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleRestoreDB}
      />

      {/* Sticky Topbar */}
      <div className="sticky top-0 z-30 bg-[#111217]/95 backdrop-blur-md border-b border-[#24262E] px-4 py-3 flex items-center justify-between">
        <h1 className="text-base font-bold text-[#FFFFFF]">Settings & Node Preferences</h1>
        <span className="text-[11px] text-[#FF7A00] font-mono bg-[#FF7A00]/15 border border-[#FF7A00]/30 px-2.5 py-0.5 rounded-full">
          v1.0.0 • Solar Engine
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-6">
        {/* GEMINI AI AGENT INTEGRATION */}
        <div>
          <SectionHeader icon={<Sparkles size={14} />} title="Gemini AI Agent & Orchestrator" />
          <Card>
            <div className="p-4 bg-gradient-to-br from-[#181922] to-[#121318]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FF7A00]/15 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00]">
                    <Bot size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Gemini Grid Intelligence</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        {geminiStatus}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8E929E]">
                      Autonomous MCC task offloading & live telemetry reasoning
                    </div>
                  </div>
                </div>
              </div>

              {/* API Key Input */}
              <div className="mt-3">
                <label className="text-[11px] font-semibold text-[#8E929E] block mb-1">
                  Google Gemini API Key
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showGeminiKey ? "text" : "password"}
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder="Enter Gemini API Key (AQ... or AIza...)"
                      className="w-full bg-[#0F1015] border border-[#282A33] rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-[#505462] focus:outline-none focus:border-[#FF7A00]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      className="absolute right-3 top-2.5 text-[#8E929E] hover:text-white"
                    >
                      {showGeminiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <button
                    onClick={handleSaveGeminiKey}
                    disabled={isTestingGemini}
                    className="px-4 py-2 bg-gradient-to-r from-[#FF7A00] to-[#FF5500] hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isTestingGemini ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                    <span>Verify & Save</span>
                  </button>
                </div>
              </div>

              {/* Model Selector */}
              <div className="mt-3 pt-3 border-t border-[#20222A] flex items-center justify-between text-xs">
                <span className="text-[#8E929E] text-[11px]">Reasoning Model:</span>
                <select
                  value={geminiModel}
                  onChange={(e) => {
                    setGeminiModel(e.target.value);
                    setStoredGeminiModel(e.target.value);
                    showToast({ type: "info", message: `Active model switched to ${e.target.value}` });
                  }}
                  className="bg-[#0F1015] border border-[#282A33] rounded-lg px-2.5 py-1 text-white text-[11px] focus:outline-none focus:border-[#FF7A00]"
                >
                  {AVAILABLE_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <SettingRow
              label="Real-Time Grid Telemetry Grounding"
              subtitle="Inject active device loads, battery levels, and queue stats into agent context"
              right={
                <Toggle
                  on={realtimeGrounding}
                  onToggle={() => {
                    setRealtimeGrounding(!realtimeGrounding);
                    showToast({
                      type: "info",
                      message: `Telemetry Grounding ${!realtimeGrounding ? "enabled" : "disabled"}.`,
                    });
                  }}
                />
              }
            />

            <SettingRow
              label="Autonomous Workload Rebalancing"
              subtitle="Allow Gemini to recommend pre-emptive worker chunk adjustments"
              right={
                <Toggle
                  on={autoRebalance}
                  onToggle={() => {
                    setAutoRebalance(!autoRebalance);
                    showToast({
                      type: "info",
                      message: `Auto-rebalancing ${!autoRebalance ? "enabled" : "disabled"}.`,
                    });
                  }}
                />
              }
            />
          </Card>
        </div>

        {/* NETWORK & MESH */}
        <div>
          <SectionHeader icon={<Wifi size={14} />} title="Network & Peer Mesh" />
          <Card>
            <SettingRow
              label="LAN Cluster Status"
              subtitle="Direct peer-to-peer multicast mesh"
              right={<span className="text-xs font-semibold text-emerald-400 font-mono">● Connected</span>}
            />
            <SettingRow
              label="Active Master Node"
              subtitle="Coordinate workload distribution & task chunking"
              right={<Toggle on={masterNode} onToggle={() => {
                setMasterNode(!masterNode);
                showToast({ type: "info", message: `Master Node Controller ${!masterNode ? "enabled" : "disabled"}.` });
              }} />}
            />
            <SettingRow
              label="Cluster Discovery Port"
              right={<span className="text-xs font-mono text-[#E5E7EB]">9000</span>}
            />
            <SettingRow
              label="Heartbeat Broadcast Interval"
              right={<span className="text-xs font-mono text-[#FF7A00]">5 seconds</span>}
            />
          </Card>
        </div>

        {/* WORKER ALLOCATION */}
        <div>
          <SectionHeader icon={<Cpu size={14} />} title="Worker Resource Policy" />
          <Card>
            <SettingRow
              label="Participate as Compute Worker"
              subtitle="Allow other nodes to schedule jobs on this device"
              right={<Toggle on={enableWorker} onToggle={() => {
                setEnableWorker(!enableWorker);
                showToast({ type: "info", message: `Worker participation ${!enableWorker ? "enabled" : "disabled"}.` });
              }} />}
            />
            <SettingRow
              label="Maximum CPU Core Load Limit"
              right={<span className="text-xs font-mono text-[#FF7A00]">{maxCpu}</span>}
              onClick={() => {
                const next = maxCpu === "80%" ? "95%" : maxCpu === "95%" ? "60%" : "80%";
                setMaxCpu(next);
                showToast({ type: "info", message: `Max CPU threshold updated to ${next}.` });
              }}
            />
            <SettingRow
              label="Maximum RAM Reservation"
              right={<span className="text-xs font-mono text-[#FFA033]">{maxRam}</span>}
              onClick={() => {
                const next = maxRam === "70%" ? "85%" : maxRam === "85%" ? "50%" : "70%";
                setMaxRam(next);
                showToast({ type: "info", message: `Max RAM threshold updated to ${next}.` });
              }}
            />
            <SettingRow
              label="Auto-Accept Grid Tasks"
              subtitle="Automatically execute tasks with matching compute profiles"
              right={<Toggle on={autoAccept} onToggle={() => {
                setAutoAccept(!autoAccept);
                showToast({ type: "info", message: `Auto-accept tasks ${!autoAccept ? "enabled" : "disabled"}.` });
              }} />}
            />
          </Card>
        </div>

        {/* SECURITY & AUTH */}
        <div>
          <SectionHeader icon={<Shield size={14} />} title="Security & Authentication" />
          <Card>
            <SettingRow
              label="Cluster Access Token Gate"
              subtitle="Require authentication for remote job dispatches"
              right={<Toggle on={authentication} onToggle={() => setAuthentication(!authentication)} />}
            />
            <SettingRow
              label="Two-Factor Authentication (2FA)"
              right={<Toggle on={twoFactor} onToggle={() => {
                setTwoFactor(!twoFactor);
                showToast({ type: "info", message: `2FA ${!twoFactor ? "enabled" : "disabled"}.` });
              }} />}
            />
            <SettingRow
              label="Change Operator Password"
              right={<ChevronRight size={16} className="text-[#8E929E]" />}
              onClick={() => setShowPasswordModal(true)}
            />
            <SettingRow
              label="Cluster API Tokens"
              subtitle={`${apiKeys.length} active keys configured`}
              right={<ChevronRight size={16} className="text-[#8E929E]" />}
              onClick={() => setShowApiModal(true)}
            />
          </Card>
        </div>

        {/* NOTIFICATIONS */}
        <div>
          <SectionHeader icon={<Bell size={14} />} title="System Alerts" />
          <Card>
            <SettingRow
              label="Task Completion Alerts"
              right={<Toggle on={notifCompleted} onToggle={() => setNotifCompleted(!notifCompleted)} />}
            />
            <SettingRow
              label="Worker Disconnect Warnings"
              right={<Toggle on={notifDisconnected} onToggle={() => setNotifDisconnected(!notifDisconnected)} />}
            />
            <SettingRow
              label="Task Execution Failure Alerts"
              right={<Toggle on={notifFailed} onToggle={() => setNotifFailed(!notifFailed)} />}
            />
            <SettingRow
              label="Terminal Audio Bleeps"
              right={<Toggle on={notifSound} onToggle={() => setNotifSound(!notifSound)} />}
            />
          </Card>
        </div>

        {/* DATABASE & STORAGE */}
        <div>
          <SectionHeader icon={<Database size={14} />} title="Database & Snapshots" />
          <Card>
            <SettingRow
              label="Automatic State Snapshots"
              subtitle="Persist task graph every 10 minutes"
              right={<Toggle on={autoBackup} onToggle={() => setAutoBackup(!autoBackup)} />}
            />
            <SettingRow
              label="Export Cluster Database"
              subtitle="Download entire telemetry and job history JSON"
              right={<Download size={16} className="text-[#FF7A00]" />}
              onClick={handleExportDB}
            />
            <SettingRow
              label="Restore Cluster Database"
              subtitle="Upload and load saved cluster snapshot"
              right={<Upload size={16} className="text-[#8E929E]" />}
              onClick={() => fileInputRef.current?.click()}
            />
          </Card>
        </div>

        {/* SYSTEM & ABOUT */}
        <div>
          <SectionHeader icon={<Info size={14} />} title="System Engine" />
          <Card>
            <SettingRow
              label="Check for Engine Updates"
              right={<RefreshCw size={15} className="text-[#FF7A00]" />}
              onClick={handleCheckUpdates}
            />
            <SettingRow
              label="Reset System Preferences"
              subtitle="Restore all grid defaults"
              right={<span className="text-xs font-semibold text-red-400">Reset</span>}
              onClick={() => setShowResetModal(true)}
            />
          </Card>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          onClick={() => setShowPasswordModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#14151B] border border-[#282A32] rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock size={16} className="text-[#FF7A00]" /> Change Password
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-[#8E929E] hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-[#8E929E] block mb-1">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 bg-[#0B0C0E] border border-[#282A32] rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#8E929E] block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 bg-[#0B0C0E] border border-[#282A32] rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-3 py-1.5 rounded-xl border border-[#282A32] text-xs text-[#8E929E]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newPassword) {
                    showToast({ type: "warning", message: "Please enter a new password." });
                    return;
                  }
                  setShowPasswordModal(false);
                  setOldPassword("");
                  setNewPassword("");
                  showToast({ type: "success", message: "Password updated successfully." });
                }}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Keys Modal */}
      {showApiModal && (
        <div
          onClick={() => setShowApiModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#14151B] border border-[#282A32] rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key size={16} className="text-[#FF7A00]" /> Cluster API Tokens
              </h3>
              <button onClick={() => setShowApiModal(false)} className="text-[#8E929E] hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {apiKeys.map((k) => (
                <div key={k.id} className="bg-[#0B0C0E] border border-[#20222A] rounded-xl p-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{k.name}</span>
                    <button
                      onClick={() => {
                        setApiKeys((prev) => prev.filter((item) => item.id !== k.id));
                        showToast({ type: "info", message: "Token revoked." });
                      }}
                      className="text-[11px] text-red-400 hover:underline"
                    >
                      Revoke
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#8E929E]">
                    <span className="truncate max-w-[240px]">{k.key}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(k.key);
                        showToast({ type: "success", message: "API key copied to clipboard." });
                      }}
                      className="p-1 text-[#FF7A00] hover:text-white"
                      title="Copy key"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#24262E]">
              <button
                onClick={handleGenerateKey}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white shadow-sm"
              >
                + Generate Key
              </button>
              <button
                onClick={() => setShowApiModal(false)}
                className="px-3 py-1.5 rounded-xl border border-[#282A32] text-xs text-[#8E929E]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div
          onClick={() => setShowResetModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#14151B] border border-red-500/30 rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <h3 className="text-sm font-bold text-red-400">Reset All Settings?</h3>
            <p className="text-xs text-[#8E929E]">
              This will restore all cluster mesh parameters, worker caps, and notification thresholds to default values.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-3 py-1.5 rounded-xl border border-[#282A32] text-xs text-[#8E929E]"
              >
                Cancel
              </button>
              <button
                onClick={handleResetSettings}
                className="px-4 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-xs font-semibold text-red-400 hover:bg-red-500/30"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
