import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Radar,
  Laptop,
  Monitor,
  CircuitBoard,
  Smartphone,
  ChevronRight,
  Zap,
  Plug,
} from "lucide-react";

export interface DeviceType {
  id: string;
  name: string;
  type: "Laptop" | "PC" | "Pi" | "Android" | "Mac";
  role: "Master" | "Worker";
  ip: string;
  hostname: string;
  cpu: number;
  ram: number;
  storage: number;
  battery: number | null;
  net: string;
  os: string;
  ping: number | null;
  status: "online" | "busy" | "idle" | "offline";
  task: string | null;
}



type FilterType = "all" | "online" | "busy" | "idle" | "offline";

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "online", label: "Online" },
  { key: "busy", label: "Busy" },
  { key: "idle", label: "Idle" },
  { key: "offline", label: "Offline" },
];

function DeviceIcon({ type, size = 36 }: { type: DeviceType["type"]; size?: number }) {
  const configs: Record<DeviceType["type"], { bg: string; color: string; Icon: React.ElementType }> = {
    Laptop:  { bg: "#EEF3FF", color: "#4F6FFF", Icon: Laptop },
    Mac:     { bg: "#EEF3FF", color: "#4F6FFF", Icon: Laptop },
    PC:      { bg: "#F3F0FF", color: "#7C5CFC", Icon: Monitor },
    Pi:      { bg: "#ECFDF5", color: "#10B981", Icon: CircuitBoard },
    Android: { bg: "#FFF7ED", color: "#F59E0B", Icon: Smartphone },
  };
  const { bg, color, Icon } = configs[type];
  const iconSize = Math.round(size * 0.5);
  return (
    <div style={{ background: bg, borderRadius: size * 0.28, width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={iconSize} color={color} />
    </div>
  );
}

function StatusBadge({ status }: { status: DeviceType["status"] }) {
  const configs: Record<DeviceType["status"], { bg: string; color: string; dot: string; pulse: boolean; label: string }> = {
    online:  { bg: "#ECFDF5", color: "#10B981", dot: "●", pulse: true,  label: "Online" },
    busy:    { bg: "#EEF3FF", color: "#4F6FFF", dot: "●", pulse: true,  label: "Busy" },
    idle:    { bg: "#F1F4F9", color: "#667085", dot: "○", pulse: false, label: "Idle" },
    offline: { bg: "#FEF2F2", color: "#EF4444", dot: "○", pulse: false, label: "Offline" },
  };
  const c = configs[status];
  return (
    <span style={{ background: c.bg, color: c.color, borderRadius: 20, padding: "3px 8px", fontSize: 12, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
      <span className={c.pulse ? "pulse-dot" : ""} style={{ fontSize: 9, lineHeight: 1 }}>{c.dot}</span>
      {c.label}
    </span>
  );
}

function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ background: "#F1F4F9", borderRadius: 2, height: 3, width: "100%", marginTop: 4 }}>
      <div style={{ width: `${Math.min(value, 100)}%`, height: "100%", background: color, borderRadius: 2 }} />
    </div>
  );
}

function MetricCell({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "#98A2B3", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{value}%</div>
      <MiniBar value={value} color={color} />
    </div>
  );
}

function BatteryCell({ battery }: { battery: number | null }) {
  if (battery === null) {
    return (
      <div>
        <div style={{ fontSize: 10, color: "#98A2B3", marginBottom: 2 }}>Battery</div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#98A2B3", display: "flex", alignItems: "center", gap: 3 }}>
          <Plug size={11} color="#98A2B3" />
          AC Power
        </div>
        <MiniBar value={100} color="#F59E0B" />
      </div>
    );
  }
  return <MetricCell label="Battery" value={battery} color="#F59E0B" />;
}

function DeviceCard({ device, onDeviceSelect }: { device: DeviceType; onDeviceSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="card animate-fade-in-up"
      style={{ padding: 16, cursor: "pointer", background: hovered ? "#FAFBFF" : "#FFFFFF", transition: "background 0.15s" }}
      onClick={() => onDeviceSelect(device.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <DeviceIcon type={device.type} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {device.name}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
              {device.task && (
                <span style={{ background: "#EEF3FF", color: "#4F6FFF", borderRadius: 20, padding: "2px 7px", fontSize: 11, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 3, whiteSpace: "nowrap" }}>
                  <Zap size={10} />
                  {device.task}
                </span>
              )}
              <StatusBadge status={device.status} />
              <ChevronRight size={14} color="#98A2B3" />
            </div>
          </div>
          <div style={{ marginTop: 5 }}>
            <span style={{ fontSize: 11, color: "#667085", border: "1px solid #E6EAF0", borderRadius: 20, padding: "2px 8px", fontWeight: 500 }}>
              {device.role}
            </span>
          </div>
        </div>
      </div>

      {/* IP + hostname */}
      <div className="mono" style={{ fontSize: 12, color: "#98A2B3", marginTop: 8 }}>
        {device.ip} · {device.hostname}
      </div>

      {/* Metrics 2x2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", marginTop: 12 }}>
        <MetricCell label="CPU" value={device.cpu} color="#4F6FFF" />
        <MetricCell label="RAM" value={device.ram} color="#7C5CFC" />
        <MetricCell label="Storage" value={device.storage} color="#10B981" />
        <BatteryCell battery={device.battery} />
      </div>

      {/* Bottom row */}
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E6EAF0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#667085" }}>{device.os}</span>
        <span style={{ fontSize: 12, color: "#98A2B3" }}>
          {device.ping !== null ? `${device.ping}ms ping` : "offline"} · just now
        </span>
      </div>
    </div>
  );
}

interface DevicesPageProps {
  onDeviceSelect: (id: string) => void;
}

export default function DevicesPage({ onDeviceSelect }: DevicesPageProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [devices, setDevices] = useState<DeviceType[]>([]);

  useEffect(() => {
    fetch('/api/devices')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(err => console.error("Failed to fetch devices", err));
  }, []);

  const filtered = useMemo(() => {
    return devices.filter(d => {
      const matchFilter = activeFilter === "all" || d.status === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || d.name.toLowerCase().includes(q) || d.ip.includes(q) || d.hostname.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [activeFilter, searchQuery, devices]);

  const onlineCount = devices.filter(d => d.status === "online" || d.status === "busy").length;

  return (
    <div style={{ background: "#F7F9FC", minHeight: "100vh", paddingBottom: 96 }}>
      {/* Search + action bar */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E6EAF0", position: "sticky", top: 0, zIndex: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={16} color="#98A2B3" style={{ position: "absolute", left: 10, pointerEvents: "none", zIndex: 1 }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search devices..."
            style={{
              background: "#F1F4F9",
              border: "none",
              borderRadius: 10,
              height: 40,
              paddingLeft: 34,
              paddingRight: 12,
              fontSize: 14,
              color: "#111827",
              outline: "none",
              width: "100%",
              fontFamily: "inherit",
            }}
          />
        </div>
        <button
          style={{ background: "#EEF3FF", color: "#4F6FFF", border: "none", borderRadius: 10, height: 40, padding: "0 12px", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
        >
          <Radar size={16} />
          Discover
        </button>
      </div>

      {/* Filter pills */}
      <div style={{ padding: "8px 16px", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            style={{
              flexShrink: 0,
              background: activeFilter === f.key ? "#4F6FFF" : "#F1F4F9",
              color: activeFilter === f.key ? "#FFFFFF" : "#667085",
              border: "none",
              borderRadius: 20,
              padding: "6px 12px",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
              fontFamily: "inherit",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Device count */}
      <div style={{ padding: "4px 16px 8px", fontSize: 13, color: "#667085" }}>
        {filtered.length} device{filtered.length !== 1 ? "s" : ""} · {onlineCount} online
      </div>

      {/* Device list */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(device => (
          <DeviceCard key={device.id} device={device} onDeviceSelect={onDeviceSelect} />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#98A2B3", padding: "48px 0", fontSize: 14 }}>
            No devices found
          </div>
        )}
      </div>
    </div>
  );
}
