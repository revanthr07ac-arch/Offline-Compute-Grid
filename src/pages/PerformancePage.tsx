import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  Download,
  Play,
  Pause,
  RefreshCw,
  Cpu,
  HardDrive,
  Wifi,
  Server
} from "lucide-react";
import { useToast } from "../components/Toast";

const TIMELINE_OPTIONS = ["1m", "5m", "15m", "1h", "24h"];
const NODE_NAMES = ["DESKTOP-A7X (Master)", "Mac-Studio", "Worker-Rig-RTX", "Laptop-Dev", "RPi-4 Node A", "RPi-4 Node B"];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePoint(t: number) {
  return {
    t: `${t * 2}s`,
    cpu1: rand(65, 88),
    cpu2: rand(40, 72),
    cpu3: rand(60, 92),
    cpu4: rand(30, 55),
    memUsed: rand(65, 84),
    memAvail: rand(16, 35),
    netDown: rand(120, 240),
    netUp: rand(40, 90),
  };
}

const INITIAL_NODES = [
  { node: "DESKTOP-A7X (Master)", cpu: 78, ram: 65, disk: 54, temp: 62, tasks: 5, status: "Active" },
  { node: "Mac-Studio", cpu: 42, ram: 58, disk: 32, temp: 50, tasks: 4, status: "Active" },
  { node: "Worker-Rig-RTX", cpu: 84, ram: 76, disk: 71, temp: 72, tasks: 3, status: "Busy" },
  { node: "Laptop-Dev", cpu: 28, ram: 44, disk: 28, temp: 48, tasks: 1, status: "Active" },
  { node: "RPi-4 Node A", cpu: 89, ram: 82, disk: 85, temp: 68, tasks: 2, status: "High Load" },
  { node: "RPi-4 Node B", cpu: 18, ram: 25, disk: 18, temp: 42, tasks: 0, status: "Idle" },
];

export default function PerformancePage() {
  const { showToast } = useToast();
  const [selectedTimeline, setSelectedTimeline] = useState("15m");
  const [isLive, setIsLive] = useState(true);
  const [chartData, setChartData] = useState(() =>
    Array.from({ length: 15 }, (_, i) => generatePoint(i))
  );

  const [heatmapData, setHeatmapData] = useState(() =>
    NODE_NAMES.map((name) => ({
      name,
      values: Array.from({ length: 18 }, () => rand(10, 98)),
    }))
  );

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setChartData((prev) => {
        const nextTime = prev.length;
        const newPoint = generatePoint(nextTime);
        return [...prev.slice(1), newPoint];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isLive]);

  const handleExportCSV = () => {
    const headers = "timestamp,cpu_master,cpu_mac,cpu_rtx,mem_used,net_down_mbps\n";
    const rows = chartData.map((d) => `${d.t},${d.cpu1},${d.cpu2},${d.cpu3},${d.memUsed},${d.netDown}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cluster_telemetry_${selectedTimeline}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast({ type: "success", message: "Cluster telemetry CSV exported." });
  };

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", text: "#10B981" };
      case "Busy":
        return { bg: "rgba(255,122,0,0.15)", border: "rgba(255,122,0,0.3)", text: "#FF7A00" };
      case "High Load":
        return { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)", text: "#EF4444" };
      default:
        return { bg: "rgba(142,146,158,0.15)", border: "rgba(142,146,158,0.3)", text: "#8E929E" };
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] pb-24">
      {/* Sticky Topbar */}
      <div className="sticky top-0 z-30 bg-[#111217]/95 backdrop-blur-md border-b border-[#24262E] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-[#FF7A00]" />
          <h1 className="text-base font-bold text-[#FFFFFF]">Cluster Telemetry</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeline Pills */}
          <div className="flex items-center bg-[#18191E] border border-[#282A32] rounded-xl p-0.5">
            {TIMELINE_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTimeline(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTimeline === t
                    ? "bg-[#FF7A00] text-black shadow-sm"
                    : "text-[#8E929E] hover:text-[#FFFFFF]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Live / Pause Button */}
          <button
            onClick={() => {
              setIsLive(!isLive);
              showToast({
                type: isLive ? "warning" : "success",
                message: isLive ? "Telemetry stream paused." : "Live telemetry resumed.",
              });
            }}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isLive
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : "bg-[#18191E] border-[#282A32] text-[#8E929E]"
            }`}
            title={isLive ? "Pause stream" : "Resume stream"}
          >
            {isLive ? <Pause size={14} /> : <Play size={14} />}
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-[#FF7A00] hover:bg-[#20222A] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 space-y-4">
        {/* Top 4 Real-time Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-4">
            <span className="text-[11px] font-semibold uppercase text-[#8E929E] flex items-center gap-1.5">
              <Cpu size={14} className="text-[#FF7A00]" /> Compute Load
            </span>
            <div className="text-2xl font-bold text-[#FFFFFF] mt-1">84%</div>
            <span className="text-[11px] text-[#FF7A00] font-mono">Peak: 94% • 48 Cores</span>
          </div>
          <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-4">
            <span className="text-[11px] font-semibold uppercase text-[#8E929E] flex items-center gap-1.5">
              <Server size={14} className="text-[#FFA033]" /> Memory Mesh
            </span>
            <div className="text-2xl font-bold text-[#FFFFFF] mt-1">76%</div>
            <span className="text-[11px] text-[#FFA033] font-mono">124 GB / 192 GB</span>
          </div>
          <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-4">
            <span className="text-[11px] font-semibold uppercase text-[#8E929E] flex items-center gap-1.5">
              <Wifi size={14} className="text-emerald-400" /> P2P Mesh Traffic
            </span>
            <div className="text-2xl font-bold text-[#FFFFFF] mt-1">90 MB/s</div>
            <span className="text-[11px] text-emerald-400 font-mono">Direct Socket Link</span>
          </div>
          <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-4">
            <span className="text-[11px] font-semibold uppercase text-[#8E929E] flex items-center gap-1.5">
              <HardDrive size={14} className="text-[#38BDF8]" /> Disk Throughput
            </span>
            <div className="text-2xl font-bold text-[#FFFFFF] mt-1">55 MB/s</div>
            <span className="text-[11px] text-[#38BDF8] font-mono">NVMe Shared Cache</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Multi-Node CPU Load Chart */}
          <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <h2 className="text-sm font-bold text-[#FFFFFF] mb-3 flex items-center justify-between">
              <span>Cluster CPU Load by Node</span>
              <span className="text-xs font-mono text-[#8E929E]">{selectedTimeline} range</span>
            </h2>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cOrange" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FF7A00" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="cAmber" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFA033" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FFA033" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" stroke="#8E929E" fontSize={10} tickLine={false} />
                  <YAxis stroke="#8E929E" fontSize={10} domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#18191E", border: "1px solid #282A32", borderRadius: 8, fontSize: 11, color: "#fff" }}
                  />
                  <Area type="monotone" dataKey="cpu1" name="Master Node" stroke="#FF7A00" strokeWidth={2} fill="url(#cOrange)" />
                  <Area type="monotone" dataKey="cpu3" name="RTX Worker" stroke="#FFA033" strokeWidth={1.5} fill="url(#cAmber)" />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Network Throughput Chart */}
          <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <h2 className="text-sm font-bold text-[#FFFFFF] mb-3 flex items-center justify-between">
              <span>P2P Grid Network Bandwidth (MB/s)</span>
              <span className="text-xs font-mono text-emerald-400">Low Latency</span>
            </h2>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="t" stroke="#8E929E" fontSize={10} tickLine={false} />
                  <YAxis stroke="#8E929E" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#18191E", border: "1px solid #282A32", borderRadius: 8, fontSize: 11, color: "#fff" }}
                  />
                  <Line type="monotone" dataKey="netDown" name="P2P Inbound" stroke="#10B981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="netUp" name="P2P Outbound" stroke="#FF7A00" strokeWidth={2} dot={false} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Node Comparison Table */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#FFFFFF]">Node Telemetry Matrix</h2>
            <span className="text-xs text-[#8E929E]">6 connected workers</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#24262E] text-[10px] text-[#8E929E] uppercase tracking-wider">
                  <th className="pb-2.5 font-semibold">Node Name</th>
                  <th className="pb-2.5 font-semibold">CPU</th>
                  <th className="pb-2.5 font-semibold">RAM</th>
                  <th className="pb-2.5 font-semibold">Disk Cache</th>
                  <th className="pb-2.5 font-semibold">Core Temp</th>
                  <th className="pb-2.5 font-semibold">Active Tasks</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20222A]">
                {INITIAL_NODES.map((row) => {
                  const badge = statusBadgeColor(row.status);
                  return (
                    <tr key={row.node} className="hover:bg-[#18191E] transition-colors">
                      <td className="py-3 font-semibold text-white whitespace-nowrap">{row.node}</td>
                      <td className="py-3 font-mono text-[#FF7A00]">{row.cpu}%</td>
                      <td className="py-3 font-mono text-[#FFA033]">{row.ram}%</td>
                      <td className="py-3 font-mono text-[#38BDF8]">{row.disk}%</td>
                      <td className="py-3 font-mono text-[#EF4444]">{row.temp}°C</td>
                      <td className="py-3 font-mono text-white">{row.tasks}</td>
                      <td className="py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text }}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CPU Heatmap */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#FFFFFF]">Spatial Grid Heatmap (30-sec buckets)</h2>
            <div className="flex items-center gap-2 text-[10px] text-[#8E929E]">
              <span>Idle</span>
              <div className="w-16 h-2 rounded-full bg-gradient-to-r from-[rgba(255,122,0,0.1)] to-[#FF7A00]" />
              <span>Saturated</span>
            </div>
          </div>

          <div className="space-y-2">
            {heatmapData.map((row) => (
              <div key={row.name} className="flex items-center gap-3">
                <span className="w-36 text-xs text-[#8E929E] truncate text-right flex-shrink-0">
                  {row.name}
                </span>
                <div className="flex items-center gap-1.5 flex-1 overflow-x-auto py-1">
                  {row.values.map((v, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: `rgba(255, 122, 0, ${Math.max(0.12, v / 100)})`,
                      }}
                      className="w-4 h-4 rounded-md border border-[rgba(255,122,0,0.2)] hover:scale-125 transition-transform flex-shrink-0 cursor-pointer"
                      title={`${row.name}: ${v}% load`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
