import { useState, useMemo } from "react";
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

export const DEVICES: DeviceType[] = [
  { id: "1", name: "DESKTOP-A7X", type: "Laptop", role: "Master", ip: "192.168.1.101", hostname: "desktop-a7x", cpu: 78, ram: 65, storage: 42, battery: 91, net: "1.2 Gbps", os: "Ubuntu 22.04", ping: 0, status: "online", task: "Coordinating" },
  { id: "2", name: "PC-Tower-2", type: "PC", role: "Worker", ip: "192.168.1.102", hostname: "workstation-b2", cpu: 45, ram: 52, storage: 78, battery: null, net: "1.0 Gbps", os: "Windows 11", ping: 1, status: "busy", task: "Video Encode" },
  { id: "3", name: "RPi-4B-3", type: "Pi", role: "Worker", ip: "192.168.1.103", hostname: "raspberrypi-3", cpu: 89, ram: 71, storage: 23, battery: null, net: "100 Mbps", os: "Raspberry Pi OS", ping: 2, status: "busy", task: "OCR Batch" },
  { id: "4", name: "Samsung-A54", type: "Android", role: "Worker", ip: "192.168.1.104", hostname: "android-samsung", cpu: 34, ram: 48, storage: 56, battery: 67, net: "300 Mbps", os: "Android 14", ping: 8, status: "idle", task: null },
  { id: "5", name: "MacBook-Pro-5", type: "Mac", role: "Worker", ip: "192.168.1.105", hostname: "MBP-M3-5", cpu: 23, ram: 38, storage: 31, battery: 84, net: "1.2 Gbps", os: "macOS 14", ping: 1, status: "online", task: null },
  { id: "6", name: "RPi-Zero-6", type: "Pi", role: "Worker", ip: "192.168.1.106", hostname: "raspberrypi-6", cpu: 12, ram: 29, storage: 18, battery: null, net: "100 Mbps", os: "Raspberry Pi OS", ping: 3, status: "idle", task: null },
  { id: "7", name: "Gaming-PC-7", type: "PC", role: "Worker", ip: "192.168.1.107", hostname: "GAMING-RIG-7", cpu: 0, ram: 0, storage: 88, battery: null, net: "—", os: "Windows 11", ping: null, status: "offline", task: null },
  { id: "8", name: "Lenovo-Tab", type: "Android", role: "Worker", ip: "192.168.1.108", hostname: "lenovo-tab", cpu: 56, ram: 44, storage: 62, battery: 33, net: "150 Mbps", os: "Android 13", ping: 12, status: "online", task: null },
];

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

  const filtered = useMemo(() => {
    return DEVICES.filter(d => {
      const matchFilter = activeFilter === "all" || d.status === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || d.name.toLowerCase().includes(q) || d.ip.includes(q) || d.hostname.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [activeFilter, searchQuery]);

  const onlineCount = DEVICES.filter(d => d.status === "online" || d.status === "busy").length;

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
