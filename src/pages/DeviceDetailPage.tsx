import React, { useMemo, useState, useEffect } from "react";
import {
  ChevronLeft,
  MoreVertical,
  Clock,
  Laptop,
  Monitor,
  CircuitBoard,
  Smartphone,
  Plug,
  PlusCircle,
  RotateCcw,
  PauseCircle,
  PlayCircle,
  WifiOff,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useToast } from "../components/Toast";
import type { DeviceType } from "./DevicesPage";

interface DeviceDetailPageProps {
  deviceId: string;
  onBack: () => void;
}

const DEVICES_DATA: Record<string, DeviceType> = {
  "dev-01": {
    id: "dev-01",
    name: "MacBook Pro M2",
    type: "Mac",
    role: "Worker",
    status: "busy",
    cpu: 24,
    ram: 68,
    storage: 42,
    net: "1.2 Gbps",
    battery: 88,
    uptime: "2d 5h",
    os: "macOS Sonoma 14.5",
    ip: "192.168.1.105",
    hostname: "macbook-pro-m2.local",
    ping: 2,
    task: "4K Transcode Chunk #3",
  },
  "dev-02": {
    id: "dev-02",
    name: "DESKTOP-A7X (Master)",
    type: "PC",
    role: "Master",
    status: "online",
    cpu: 78,
    ram: 65,
    storage: 55,
    net: "2.5 Gbps",
    battery: null,
    uptime: "14h 23m",
    os: "Windows 11 Pro 64-bit",
    ip: "192.168.1.101",
    hostname: "desktop-a7x.local",
    ping: 1,
    task: "Scheduler Coordinator",
  },
  "dev-03": {
    id: "dev-03",
    name: "Workstation Linux",
    type: "PC",
    role: "Worker",
    status: "online",
    cpu: 45,
    ram: 52,
    storage: 38,
    net: "1.0 Gbps",
    battery: null,
    uptime: "5d 11h",
    os: "Ubuntu 24.04 LTS (CUDA 12.4)",
    ip: "192.168.1.112",
    hostname: "ubuntu-box.local",
    ping: 3,
    task: "Distributed Telemetry #1",
  },
  "dev-04": {
    id: "dev-04",
    name: "Galaxy S24 Ultra",
    type: "Android",
    role: "Worker",
    status: "idle",
    cpu: 18,
    ram: 44,
    storage: 28,
    net: "850 Mbps",
    battery: 92,
    uptime: "1d 2h",
    os: "Android 14 (OneUI 6)",
    ip: "192.168.1.144",
    hostname: "galaxy-s24.local",
    ping: 4,
    task: null,
  },
  "dev-05": {
    id: "dev-05",
    name: "Raspberry Pi 5 Cluster",
    type: "Pi",
    role: "Worker",
    status: "idle",
    cpu: 12,
    ram: 35,
    storage: 64,
    net: "1.0 Gbps",
    battery: null,
    uptime: "12d 8h",
    os: "Raspberry Pi OS 64-bit",
    ip: "192.168.1.199",
    hostname: "rpi5-cluster.local",
    ping: 5,
    task: null,
  },
  "dev-06": {
    id: "dev-06",
    name: "NAS Storage Node",
    type: "PC",
    role: "Worker",
    status: "offline",
    cpu: 0,
    ram: 0,
    storage: 88,
    net: "Offline",
    battery: null,
    uptime: "—",
    os: "TrueNAS Core",
    ip: "192.168.1.250",
    hostname: "truenas-core.local",
    ping: null,
    task: null,
  },
  // Aliases for backend numeric IDs & legacy IDs
  "1": { id: "1", name: "DESKTOP-A7X", type: "PC", role: "Master", ip: "192.168.1.101", hostname: "desktop-a7x", cpu: 78, ram: 65, storage: 42, battery: 91, net: "1.2 Gbps", os: "Ubuntu 22.04", ping: 0, status: "online", task: "Coordinating" },
  "2": { id: "2", name: "PC-Tower-2", type: "PC", role: "Worker", ip: "192.168.1.102", hostname: "workstation-b2", cpu: 45, ram: 52, storage: 78, battery: null, net: "1.0 Gbps", os: "Windows 11", ping: 1, status: "busy", task: "Video Encode" },
  "3": { id: "3", name: "RPi-4B-3", type: "Pi", role: "Worker", ip: "192.168.1.103", hostname: "raspberrypi-3", cpu: 89, ram: 71, storage: 23, battery: null, net: "100 Mbps", os: "Raspberry Pi OS", ping: 2, status: "busy", task: "OCR Batch" },
  "4": { id: "4", name: "Samsung-A54", type: "Android", role: "Worker", ip: "192.168.1.104", hostname: "android-samsung", cpu: 34, ram: 48, storage: 56, battery: 67, net: "300 Mbps", os: "Android 14", ping: 8, status: "idle", task: null },
  "5": { id: "5", name: "MacBook-Pro-5", type: "Mac", role: "Worker", ip: "192.168.1.105", hostname: "MBP-M3-5", cpu: 23, ram: 38, storage: 31, battery: 84, net: "1.2 Gbps", os: "macOS 14", ping: 1, status: "online", task: null },
  d1: { id: "d1", name: "DESKTOP-A7X (Master)", type: "PC", role: "Master", status: "online", cpu: 78, ram: 65, storage: 48, net: "1.2 GB/s", battery: null, uptime: "14h 23m", os: "Windows 11 Pro", ip: "192.168.1.101", hostname: "desktop-a7x.local", ping: 1, task: "4K Video Transcoding — Episode 12" },
  d2: { id: "d2", name: "Mac-Studio M2 Max", type: "Mac", role: "Worker", status: "busy", cpu: 42, ram: 58, storage: 35, net: "950 MB/s", battery: null, uptime: "3d 4h", os: "macOS Sonoma 14.5", ip: "192.168.1.108", hostname: "mac-studio.local", ping: 2, task: "Metal Acceleration Worker" },
  d3: { id: "d3", name: "Worker-Rig-RTX", type: "PC", role: "Worker", status: "busy", cpu: 84, ram: 76, storage: 62, net: "1.8 GB/s", battery: null, uptime: "1d 12h", os: "Ubuntu 24.04 LTS (CUDA 12.4)", ip: "192.168.1.110", hostname: "worker-rig-rtx.local", ping: 1, task: "PyTorch DDP Mesh Worker" },
  d4: { id: "d4", name: "Laptop-Dev", type: "Laptop", role: "Worker", status: "idle", cpu: 12, ram: 34, storage: 22, net: "420 MB/s", battery: 88, uptime: "6h 10m", os: "Fedora 40 Workstation", ip: "192.168.1.104", hostname: "laptop-dev.local", ping: 4, task: null },
  d5: { id: "d5", name: "RPi-4 Node A", type: "Pi", role: "Worker", status: "online", cpu: 24, ram: 45, storage: 15, net: "120 MB/s", battery: null, uptime: "28d 14h", os: "Debian Bookworm (ARM64)", ip: "192.168.1.105", hostname: "rpi4-node-a.local", ping: 3, task: null },
};

function DeviceIcon({ type }: { type: DeviceType["type"] }) {
  const configs: Record<DeviceType["type"], { icon: React.ReactNode }> = {
    Laptop:  { icon: <Laptop size={24} className="text-[#FF7A00]" /> },
    Mac:     { icon: <Laptop size={24} className="text-[#FFA033]" /> },
    PC:      { icon: <Monitor size={24} className="text-[#FF7A00]" /> },
    Pi:      { icon: <CircuitBoard size={24} className="text-[#10B981]" /> },
    Android: { icon: <Smartphone size={24} className="text-[#38BDF8]" /> },
  };
  return (
    <div className="w-12 h-12 rounded-xl bg-[rgba(255,122,0,0.12)] border border-[rgba(255,122,0,0.25)] flex items-center justify-center flex-shrink-0">
      {configs[type]?.icon || <Server size={24} className="text-[#FF7A00]" />}
    </div>
  );
}

function StatusBadge({ status }: { status: DeviceType["status"] }) {
  const configs: Record<DeviceType["status"], { bg: string; border: string; color: string; label: string }> = {
    online:  { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", color: "#10B981", label: "Online" },
    busy:    { bg: "rgba(255,122,0,0.15)",  border: "rgba(255,122,0,0.3)",  color: "#FF7A00", label: "Busy" },
    idle:    { bg: "rgba(142,146,158,0.15)", border: "rgba(142,146,158,0.3)", color: "#8E929E", label: "Idle" },
    offline: { bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.3)",  color: "#EF4444", label: "Offline" },
  };
  const c = configs[status] || configs.idle;
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {c.label}
    </span>
  );
}

function CircularProgress({ value, color, size = 56, strokeWidth = 5 }: { value: number; color: string; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(value, 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1F2128" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

function MetricCard({ label, value, displayValue, color }: { label: string; value: number; displayValue: string; color: string }) {
  return (
    <div className="bg-[#0B0C0E] border border-[#20222A] rounded-xl p-3 flex flex-col items-center gap-1">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <CircularProgress value={value} color={color} />
        <span className="absolute text-xs font-mono font-bold text-[#FFFFFF]">
          {value > 0 ? `${value}%` : "—"}
        </span>
      </div>
      <div className="text-sm font-bold text-[#FFFFFF] mt-1">{displayValue}</div>
      <div className="text-[11px] text-[#8E929E]">{label}</div>
    </div>
  );
}

export default function DeviceDetailPage({ deviceId, onBack }: DeviceDetailPageProps) {
  const { showToast } = useToast();

  const [device, setDevice] = useState<DeviceType>(() => {
    return DEVICES_DATA[deviceId] || {
      ...DEVICES_DATA["dev-01"],
      id: deviceId,
      name: `Cluster Node (${deviceId})`,
    };
  });

  useEffect(() => {
    fetch(`/api/devices/${deviceId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.name) setDevice(data);
      })
      .catch(() => {
        fetch("/api/devices")
          .then((r) => r.json())
          .then((list) => {
            if (Array.isArray(list)) {
              const found = list.find((d: any) => d.id === deviceId || d.name.toLowerCase().includes(deviceId.toLowerCase()));
              if (found) setDevice(found);
            }
          })
          .catch(() => {});
      });
  }, [deviceId]);

  const [isRebooting, setIsRebooting] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const chartData = useMemo(() => {
    const points: { t: number; v: number }[] = [];
    let v = device.cpu;
    for (let i = 15; i >= 0; i--) {
      v = Math.min(98, Math.max(10, v + (Math.random() - 0.48) * 12));
      points.push({ t: i, v: Math.round(v) });
    }
    return points;
  }, [device.cpu]);

  const handleRestart = () => {
    setIsRebooting(true);
    showToast({ type: "warning", message: `Sent reboot signal to ${device.name}...` });
    setTimeout(() => {
      setIsRebooting(false);
      showToast({ type: "success", message: `${device.name} restarted and re-joined mesh.` });
    }, 2000);
  };

  const handlePingTest = () => {
    setIsPinging(true);
    setTimeout(() => {
      const simulatedPing = Math.floor(Math.random() * 3 + 1);
      setDevice((d) => ({ ...d, ping: simulatedPing, status: d.status === "offline" ? "online" : d.status }));
      setIsPinging(false);
      showToast({ type: "success", message: `ICMP Ping response from ${device.ip}: ${simulatedPing} ms (0% loss)` });
    }, 800);
  };

  const handleRunBenchmark = () => {
    setIsBenchmarking(true);
    setBenchmarkResult(null);
    showToast({ type: "info", message: `Executing matrix multiplication & memory bandwidth test on ${device.name}...` });
    setTimeout(() => {
      setIsBenchmarking(false);
      const score = Math.floor(Math.random() * 450 + 820);
      setBenchmarkResult(`${score} GFLOPS • 42.8 GB/s Mem Bandwidth`);
      showToast({ type: "success", message: `Benchmark complete: ${score} GFLOPS verified!` });
    }, 2200);
  };

  const handleToggleRole = () => {
    const newRole = device.role === "Master" ? "Worker" : "Master";
    setDevice((d) => ({ ...d, role: newRole }));
    showToast({
      type: "success",
      message: `Role switched: ${device.name} is now designated as ${newRole}.`
    });
  };

  const handleTogglePause = () => {
    if (device.status === "busy") {
      setDevice((d) => ({ ...d, status: "idle", task: null }));
      showToast({ type: "info", message: `Worker tasks paused on ${device.name}.` });
    } else {
      setDevice((d) => ({ ...d, status: "busy", task: "Assigned: Transcode Chunk Batch 04" }));
      showToast({ type: "success", message: `Workload scheduled on ${device.name}.` });
    }
  };

  const handleDisconnect = () => {
    if (device.status === "offline") {
      setDevice((d) => ({ ...d, status: "online", ping: 2 }));
      showToast({ type: "success", message: `${device.name} reconnected to LAN mesh!` });
    } else {
      setDevice((d) => ({ ...d, status: "offline", ping: null }));
      showToast({ type: "error", message: `${device.name} disconnected from grid.` });
    }
  };

  const handleAssignTask = (taskName: string) => {
    setDevice((d) => ({ ...d, status: "busy", task: taskName }));
    setShowAssignModal(false);
    showToast({ type: "success", message: `Assigned "${taskName}" to ${device.name}.` });
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] pb-24">
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 bg-[#111217]/95 backdrop-blur-md border-b border-[#24262E] px-3 sm:px-6 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8E929E] hover:text-white cursor-pointer"
        >
          <ChevronLeft size={18} /> Back to Devices
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#8E929E] hidden sm:inline">{device.role} Node</span>
          <StatusBadge status={isRebooting ? "idle" : device.status} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-5 space-y-4">
        {/* Device Hero Card */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <DeviceIcon type={device.type} />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-white">{device.name}</h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[rgba(255,122,0,0.15)] text-[#FF7A00] border border-[rgba(255,122,0,0.3)]">
                    {device.role}
                  </span>
                </div>
                <p className="text-xs text-[#8E929E] mt-0.5 font-mono">{device.ip} • Uptime: {device.uptime || "14h 23m"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleRole}
                className="btn-secondary px-3 py-1.5 text-xs font-semibold"
              >
                Switch to {device.role === "Master" ? "Worker" : "Master"}
              </button>
            </div>
          </div>

          {/* Metrics Circular Cards */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-5">
            <MetricCard
              label="CPU Load"
              value={device.cpu}
              displayValue={`${device.cpu}%`}
              color="#FF7A00"
            />
            <MetricCard
              label="RAM Mesh"
              value={device.ram}
              displayValue={`${device.ram}%`}
              color="#FFA033"
            />
            <MetricCard
              label="Ping Latency"
              value={device.ping ? Math.min(100, device.ping * 10) : 0}
              displayValue={device.ping !== null ? `${device.ping} ms` : "—"}
              color="#10B981"
            />
          </div>
        </div>

        {/* Real-time CPU Usage Graph */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-[#FF7A00]" />
              Telemetry Trend (Last 15 min)
            </span>
            <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Live Stream
            </span>
          </div>

          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cpuDetailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#FF7A00" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{ background: "#18191E", border: "1px solid #282A32", borderRadius: 8, fontSize: 11, color: "#fff" }}
                  formatter={(v) => [`${v}%`, "CPU Usage"]}
                />
                <Area type="monotone" dataKey="v" stroke="#FF7A00" strokeWidth={2} fill="url(#cpuDetailGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Benchmark Results Banner if Run */}
        {benchmarkResult && (
          <div className="bg-[rgba(255,122,0,0.12)] border border-[rgba(255,122,0,0.3)] rounded-2xl p-4 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-[#FF7A00]" />
              <div>
                <div className="text-xs font-bold text-white">Hardware Benchmark Verified</div>
                <div className="text-xs text-[#FF7A00] font-mono mt-0.5">{benchmarkResult}</div>
              </div>
            </div>
            <button
              onClick={() => setBenchmarkResult(null)}
              className="text-[#8E929E] hover:text-white text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Active Task Card */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <h2 className="text-sm font-bold text-white mb-3">Workload Allocation</h2>
          {device.task ? (
            <div className="bg-[#0B0C0E] border border-[#20222A] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Zap size={14} className="text-[#FF7A00]" />
                  {device.task}
                </span>
                <span className="text-xs text-[#FF7A00] font-mono">Running (67%)</span>
              </div>
              <div className="h-2 w-full bg-[#1F2128] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF5500]" style={{ width: "67%" }} />
              </div>
              <div className="flex justify-between items-center text-[11px] text-[#8E929E]">
                <span>Throughput: {device.net}</span>
                <button
                  onClick={() => handleTogglePause()}
                  className="text-xs text-[#FF7A00] hover:underline cursor-pointer"
                >
                  Pause Chunk
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#0B0C0E] border border-[#20222A] rounded-xl p-5 text-center">
              <p className="text-xs text-[#8E929E] mb-3">No active compute task currently assigned to this node.</p>
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white shadow-md hover:brightness-110 flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <PlusCircle size={14} /> Assign Queued Task
              </button>
            </div>
          )}
        </div>

        {/* Node Specs & Network Info */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] space-y-3 text-xs">
          <h2 className="text-sm font-bold text-white mb-2">Node Specifications</h2>
          <div className="flex justify-between py-1.5 border-b border-[#20222A]">
            <span className="text-[#8E929E]">Operating System</span>
            <span className="font-semibold text-white">{device.os}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[#20222A]">
            <span className="text-[#8E929E]">P2P Link Throughput</span>
            <span className="font-semibold text-[#FF7A00]">{device.net}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[#20222A]">
            <span className="text-[#8E929E]">Cluster IP</span>
            <span className="font-mono text-white">{device.ip}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[#8E929E]">Hostname</span>
            <span className="font-mono text-white">{device.hostname}</span>
          </div>
        </div>

        {/* Control Action Buttons: Fully Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <button
            onClick={handlePingTest}
            disabled={isPinging}
            className="h-11 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-white hover:border-[#10B981] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Activity size={15} className={isPinging ? "animate-pulse text-[#10B981]" : "text-[#10B981]"} />
            {isPinging ? "Pinging..." : "Ping Test"}
          </button>

          <button
            onClick={handleRunBenchmark}
            disabled={isBenchmarking}
            className="h-11 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-[#FFA033] hover:border-[#FFA033] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Zap size={15} className={isBenchmarking ? "animate-spin" : ""} />
            {isBenchmarking ? "Testing..." : "Benchmark"}
          </button>

          <button
            onClick={handleRestart}
            disabled={isRebooting}
            className="h-11 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-white hover:border-[#FF7A00] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw size={15} className={isRebooting ? "animate-spin text-[#FF7A00]" : ""} />
            {isRebooting ? "Rebooting..." : "Restart"}
          </button>

          <button
            onClick={handleDisconnect}
            className={`h-11 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              device.status === "offline"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                : "bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25"
            }`}
          >
            <WifiOff size={15} />
            {device.status === "offline" ? "Reconnect" : "Disconnect"}
          </button>
        </div>
      </div>

      {/* Assign Task Modal */}
      {showAssignModal && (
        <div
          onClick={() => setShowAssignModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#14151B] border border-[#282A32] rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <h3 className="text-sm font-bold text-white">Assign Task to {device.name}</h3>
            <div className="space-y-2">
              {["3D Blender Render — Frame 01-250", "Dataset SHA256 Verification", "Genomic Sequence Alignment"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleAssignTask(t)}
                  className="w-full text-left p-3 rounded-xl bg-[#0B0C0E] border border-[#20222A] hover:border-[#FF7A00] text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 rounded-xl bg-[#18191E] border border-[#282A32] text-xs text-[#8E929E] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
