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
  WifiOff,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { DeviceType } from "./DevicesPage";

interface DeviceDetailPageProps {
  deviceId: string;
  onBack: () => void;
}

function DeviceIcon({ type, size = 48 }: { type: DeviceType["type"]; size?: number }) {
  const configs: Record<DeviceType["type"], { bg: string; color: string; Icon: React.ElementType }> = {
    Laptop:  { bg: "#F3E8FF", color: "#8B5CF6", Icon: Laptop },
    Mac:     { bg: "#F3E8FF", color: "#8B5CF6", Icon: Laptop },
    PC:      { bg: "#F3F0FF", color: "#7C5CFC", Icon: Monitor },
    Pi:      { bg: "#ECFDF5", color: "#10B981", Icon: CircuitBoard },
    Android: { bg: "#FFF7ED", color: "#F59E0B", Icon: Smartphone },
  };
  const { bg, color, Icon } = configs[type];
  const pillSize = Math.round(size * 1.33);
  const iconSize = size;
  return (
    <div style={{ background: bg, borderRadius: pillSize * 0.28, width: pillSize, height: pillSize, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={iconSize} color={color} />
    </div>
  );
}

function StatusBadge({ status }: { status: DeviceType["status"] }) {
  const configs: Record<DeviceType["status"], { bg: string; color: string; dot: string; pulse: boolean; label: string }> = {
    online:  { bg: "#ECFDF5", color: "#10B981", dot: "●", pulse: true,  label: "Online" },
    busy:    { bg: "#F3E8FF", color: "#8B5CF6", dot: "●", pulse: true,  label: "Busy" },
    idle:    { bg: "#F1F4F9", color: "#667085", dot: "○", pulse: false, label: "Idle" },
    offline: { bg: "#FEF2F2", color: "#EF4444", dot: "○", pulse: false, label: "Offline" },
  };
  const c = configs[status];
  return (
    <span style={{ background: c.bg, color: c.color, borderRadius: 20, padding: "4px 10px", fontSize: 13, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span className={c.pulse ? "pulse-dot" : ""} style={{ fontSize: 9, lineHeight: 1 }}>{c.dot}</span>
      {c.label}
    </span>
  );
}

function CircularProgress({ value, color, size = 56, strokeWidth = 6 }: { value: number; color: string; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(value, 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E6EAF0" strokeWidth={strokeWidth} />
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
    <div className="card-sm" style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress value={value} color={color} />
        <span style={{ position: "absolute", fontSize: 11, fontWeight: 700, color: "#111827" }}>
          {value > 0 ? `${value}` : "—"}
        </span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#111827", lineHeight: 1 }}>{displayValue}</div>
      <div style={{ fontSize: 12, color: "#98A2B3" }}>{label}</div>
    </div>
  );
}

function generateChartData() {
  const points: { t: number; v: number }[] = [];
  let v = 40 + Math.random() * 30;
  for (let i = 0; i < 30; i++) {
    v = Math.max(5, Math.min(95, v + (Math.random() - 0.48) * 15));
    points.push({ t: i, v: Math.round(v) });
  }
  return points;
}

function InfoRow({ label, value, mono = false, last = false }: { label: string; value: string; mono?: boolean; last?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: last ? "none" : "1px solid #E6EAF0" }}>
      <span style={{ fontSize: 13, color: "#667085" }}>{label}</span>
      <span className={mono ? "mono" : ""} style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{value}</span>
    </div>
  );
}

export default function DeviceDetailPage({ deviceId, onBack }: DeviceDetailPageProps) {
  const [device, setDevice] = React.useState<DeviceType | null>(null);

  React.useEffect(() => {
    const fetchDevice = () => {
      fetch(`/api/devices/${deviceId}`)
        .then(res => res.json())
        .then(data => setDevice(data))
        .catch(err => console.error("Failed to fetch device", err));
    };
    fetchDevice();
    const interval = setInterval(fetchDevice, 3000);
    return () => clearInterval(interval);
  }, [deviceId]);

  const [activeTab, setActiveTab] = React.useState("overview");
  const chartData = useMemo(() => Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, value: Math.round(20 + Math.random() * 60) })), []);

  if (!device) {
    return <div style={{ padding: 24 }}>Loading device details...</div>;
  }

  const batteryDisplay = device.battery !== null ? `${device.battery}%` : "AC";
  const batteryValue = device.battery !== null ? device.battery : 100;

  return (
    <div style={{ background: "#F7F9FC", minHeight: "100vh", paddingBottom: 96 }}>
      {/* Header */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E6EAF0", padding: "4px 4px", display: "flex", alignItems: "center" }}>
        <button
          onClick={onBack}
          style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", borderRadius: 10 }}
        >
          <ChevronLeft size={22} color="#111827" />
        </button>
        <span style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 600, color: "#111827" }}>{device.name}</span>
        <button
          style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", borderRadius: 10 }}
        >
          <MoreVertical size={20} color="#667085" />
        </button>
      </div>

      {/* Hero card */}
      <div className="card animate-fade-in-up" style={{ margin: "16px 16px 0", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <DeviceIcon type={device.type} size={48} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <StatusBadge status={device.status} />
              <span style={{ fontSize: 12, color: "#667085", border: "1px solid #E6EAF0", borderRadius: 20, padding: "2px 8px", fontWeight: 500 }}>{device.role}</span>
            </div>
            <div className="mono" style={{ fontSize: 13, color: "#667085", marginTop: 8 }}>{device.ip}</div>
            <div className="mono" style={{ fontSize: 12, color: "#98A2B3" }}>{device.hostname}</div>
            {device.task && (
              <span style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 4, background: "#F3E8FF", color: "#8B5CF6", borderRadius: 20, padding: "3px 9px", fontSize: 12, fontWeight: 500 }}>
                <Zap size={11} />
                {device.task}
              </span>
            )}
          </div>
        </div>
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 5, color: "#98A2B3", fontSize: 13 }}>
          <Clock size={12} color="#98A2B3" />
          Uptime: 14h 23m
        </div>
      </div>

      {/* Metrics 2x2 grid */}
      <div style={{ margin: "12px 16px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <MetricCard label="CPU Usage" value={device.cpu} displayValue={`${device.cpu}%`} color="#8B5CF6" />
        <MetricCard label="RAM Usage" value={device.ram} displayValue={`${device.ram}%`} color="#7C5CFC" />
        <MetricCard label="Storage" value={device.storage} displayValue={`${device.storage}%`} color="#10B981" />
        {device.battery !== null ? (
          <MetricCard label="Battery" value={batteryValue} displayValue={batteryDisplay} color="#F59E0B" />
        ) : (
          <MetricCard label="Temp" value={61} displayValue="61°C" color="#F59E0B" />
        )}
      </div>

      {/* Performance chart */}
      <div className="card animate-fade-in-up" style={{ margin: "12px 16px 0", padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>CPU Usage — Last 15 min</span>
          <span style={{ fontSize: 11, fontWeight: 500, background: "#ECFDF5", color: "#10B981", borderRadius: 20, padding: "2px 8px" }}>Real-time</span>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{ background: "#FFFFFF", border: "1px solid #E6EAF0", borderRadius: 8, fontSize: 12 }}
              formatter={(v) => [`${v}%`, "CPU"]}
              labelFormatter={() => ""}
            />
            <Area type="monotone" dataKey="v" stroke="#8B5CF6" strokeWidth={2} fill="url(#cpuGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Task section */}
      <div className="card animate-fade-in-up" style={{ margin: "12px 16px 0", padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 12 }}>Current Task</div>
        {device.task ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Zap size={15} color="#8B5CF6" />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{device.task}</span>
            </div>
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#667085", marginBottom: 5 }}>
                <span>Progress</span>
                <span>67%</span>
              </div>
              <div style={{ background: "#F1F4F9", borderRadius: 4, height: 6 }}>
                <div style={{ width: "67%", height: "100%", background: "#8B5CF6", borderRadius: 4 }} />
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#98A2B3", marginBottom: 12 }}>ETA: ~8 min remaining</div>
            <button style={{ background: "#F3E8FF", color: "#8B5CF6", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              View Task
            </button>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 13, color: "#98A2B3", marginBottom: 12 }}>No active task</div>
            <button style={{ background: "#F3E8FF", color: "#8B5CF6", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <PlusCircle size={15} />
              Assign Task
            </button>
          </div>
        )}
      </div>

      {/* Device info */}
      <div className="card animate-fade-in-up" style={{ margin: "12px 16px 0", padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Device Info</div>
        <InfoRow label="Operating System" value={device.os} />
        <InfoRow label="Network Speed" value={device.net} />
        <InfoRow label="Ping" value={device.ping !== null ? `${device.ping}ms` : "—"} />
        <InfoRow label="Last Heartbeat" value="just now" />
        <InfoRow label="IP Address" value={device.ip} mono last={false} />
        <InfoRow label="Hostname" value={device.hostname} mono last />
      </div>

      {/* Action buttons */}
      <div style={{ margin: "16px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        <button className="btn-secondary" style={{ width: "100%", height: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <RotateCcw size={16} />
          Restart Device
        </button>
        <button className="btn-secondary" style={{ width: "100%", height: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <PauseCircle size={16} />
          Pause Worker
        </button>
        <button
          style={{
            width: "100%",
            height: 48,
            background: "#FEF2F2",
            border: "1px solid rgba(239,68,68,0.1)",
            borderRadius: 12,
            color: "#EF4444",
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: "inherit",
          }}
        >
          <WifiOff size={16} />
          Disconnect
        </button>
      </div>

      {/* AC power note when no battery */}
      {device.battery === null && (
        <div style={{ margin: "12px 16px 0", display: "flex", alignItems: "center", gap: 6, color: "#98A2B3", fontSize: 12 }}>
          <Plug size={12} />
          Running on AC power — no battery data available
        </div>
      )}
    </div>
  );
}
