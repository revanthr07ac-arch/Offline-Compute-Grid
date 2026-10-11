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
  d1: {
    id: "d1",
    name: "DESKTOP-A7X (Master Node)",
    type: "PC",
    role: "Master",
    status: "busy",
    cpu: 78,
    ram: 65,
    storage: 48,
    net: "1.2 GB/s",
    battery: null,
    uptime: "14h 23m",
    os: "Windows 11 Pro 64-bit",
    ip: "192.168.1.101",
    hostname: "desktop-a7x.local",
    ping: 1,
    task: "4K Video Transcoding — Episode 12",
  },
  d2: {
    id: "d2",
    name: "Mac-Studio M2 Max",
    type: "Mac",
    role: "Worker",
    status: "busy",
    cpu: 42,
    ram: 58,
    storage: 35,
    net: "950 MB/s",
    battery: null,
    uptime: "3d 4h",
    os: "macOS Sonoma 14.5",
    ip: "192.168.1.108",
    hostname: "mac-studio.local",
    ping: 2,
    task: "Metal Acceleration Worker",
  },
  d3: {
    id: "d3",
    name: "Worker-Rig-RTX",
    type: "PC",
    role: "Worker",
    status: "busy",
    cpu: 84,
    ram: 76,
    storage: 62,
    net: "1.8 GB/s",
    battery: null,
    uptime: "1d 12h",
    os: "Ubuntu 24.04 LTS (CUDA 12.4)",
    ip: "192.168.1.110",
    hostname: "worker-rig-rtx.local",
    ping: 1,
    task: "PyTorch DDP Mesh Worker",
  },
  d4: {
    id: "d4",
    name: "Laptop-Dev",
    type: "Laptop",
    role: "Worker",
    status: "idle",
    cpu: 12,
    ram: 34,
    storage: 22,
    net: "420 MB/s",
    battery: 88,
    uptime: "6h 10m",
    os: "Fedora 40 Workstation",
    ip: "192.168.1.104",
    hostname: "laptop-dev.local",
    ping: 4,
    task: null,
  },
  d5: {
    id: "d5",
    name: "RPi-4 Node A",
    type: "Pi",
    role: "Worker",
    status: "online",
    cpu: 24,
    ram: 45,
    storage: 15,
    net: "120 MB/s",
    battery: null,
    uptime: "28d 14h",
    os: "Debian Bookworm (ARM64)",
    ip: "192.168.1.105",
    hostname: "rpi4-node-a.local",
    ping: 3,
    task: null,
  },
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
      ...DEVICES_DATA["d1"],
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
        // Try getting from all devices list
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
    }, 2500);
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
    setDevice((d) => ({ ...d, status: "offline", ping: null }));
    showToast({ type: "error", message: `${device.name} disconnected from grid.` });
  };

  const handleAssignTask = (taskName: string) => {
    setDevice((d) => ({ ...d, status: "busy", task: taskName }));
    setShowAssignModal(false);
    showToast({ type: "success", message: `Assigned "${taskName}" to ${device.name}.` });
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] pb-24">
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 bg-[#111217]/95 backdrop-blur-md border-b border-[#24262E] px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8E929E] hover:text-[#FFFFFF] cursor-pointer"
        >
          <ChevronLeft size={18} /> Back to Devices
        </button>
        <StatusBadge status={isRebooting ? "idle" : device.status} />
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-5 space-y-4">
        {/* Device Hero Card */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <DeviceIcon type={device.type} />
              <div>
                <h1 className="text-lg font-bold text-[#FFFFFF]">{device.name}</h1>
                <p className="text-xs text-[#8E929E] mt-0.5 font-mono">{device.ip} • Uptime: {device.uptime}</p>
              </div>
            </div>
          </div>

          {/* Metrics Circular Cards */}
          <div className="grid grid-cols-3 gap-3 mt-5">
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
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-[#FFFFFF] flex items-center gap-2">
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

        {/* Active Task Card */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <h2 className="text-sm font-bold text-[#FFFFFF] mb-3">Workload Allocation</h2>
          {device.task ? (
            <div className="bg-[#0B0C0E] border border-[#20222A] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFFFFF] flex items-center gap-2">
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
                  className="text-xs text-[#FF7A00] hover:underline"
                >
                  Pause Chunk
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#0B0C0E] border border-[#20222A] rounded-xl p-6 text-center">
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
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] space-y-3 text-xs">
          <h2 className="text-sm font-bold text-[#FFFFFF] mb-2">Node Specifications</h2>
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

        {/* Control Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={handleRestart}
            disabled={isRebooting}
            className="h-11 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-white hover:border-[#FF7A00] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw size={15} className={isRebooting ? "animate-spin text-[#FF7A00]" : ""} />
            {isRebooting ? "Rebooting..." : "Restart Node"}
          </button>
          <button
            onClick={handleTogglePause}
            className="h-11 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-[#FF7A00] hover:bg-[#20222A] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {device.status === "busy" ? <PauseCircle size={15} /> : <PlayCircle size={15} />}
            {device.status === "busy" ? "Pause Worker" : "Resume Worker"}
          </button>
          <button
            onClick={handleDisconnect}
            className="h-11 rounded-xl bg-red-500/15 border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <WifiOff size={15} />
            Disconnect Node
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
