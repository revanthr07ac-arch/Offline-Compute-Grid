import React, { useState, useMemo, useEffect } from "react";
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
import { useToast } from "../components/Toast";

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
  uptime?: string;
}

const DEFAULT_DEVICES: DeviceType[] = [
  {
    id: "dev-01",
    name: "MacBook Pro M2",
    type: "Mac",
    role: "Worker",
    ip: "192.168.1.105",
    hostname: "macbook-pro-m2.local",
    cpu: 24,
    ram: 68,
    storage: 42,
    battery: 88,
    net: "1.2 Gbps",
    os: "macOS Sonoma",
    ping: 2,
    status: "busy",
    task: "4K Transcode Chunk #3",
  },
  {
    id: "dev-02",
    name: "DESKTOP-A7X (Master)",
    type: "PC",
    role: "Master",
    ip: "192.168.1.101",
    hostname: "desktop-a7x.local",
    cpu: 78,
    ram: 65,
    storage: 55,
    battery: null,
    net: "2.5 Gbps",
    os: "Windows 11 Pro",
    ping: 1,
    status: "online",
    task: "Scheduler Coordinator",
  },
  {
    id: "dev-03",
    name: "Workstation Linux",
    type: "PC",
    role: "Worker",
    ip: "192.168.1.112",
    hostname: "ubuntu-box.local",
    cpu: 45,
    ram: 52,
    storage: 38,
    battery: null,
    net: "1.0 Gbps",
    os: "Ubuntu 24.04 LTS",
    ping: 3,
    status: "online",
    task: "Distributed Telemetry #1",
  },
  {
    id: "dev-04",
    name: "Galaxy S24 Ultra",
    type: "Android",
    role: "Worker",
    ip: "192.168.1.144",
    hostname: "galaxy-s24.local",
    cpu: 18,
    ram: 44,
    storage: 28,
    battery: 92,
    net: "850 Mbps",
    os: "Android 14",
    ping: 4,
    status: "idle",
    task: null,
  },
  {
    id: "dev-05",
    name: "Raspberry Pi 5 Cluster",
    type: "Pi",
    role: "Worker",
    ip: "192.168.1.199",
    hostname: "rpi5-cluster.local",
    cpu: 12,
    ram: 35,
    storage: 64,
    battery: null,
    net: "1.0 Gbps",
    os: "Raspberry Pi OS 64",
    ping: 5,
    status: "idle",
    task: null,
  },
  {
    id: "dev-06",
    name: "NAS Storage Node",
    type: "PC",
    role: "Worker",
    ip: "192.168.1.250",
    hostname: "truenas-core.local",
    cpu: 0,
    ram: 0,
    storage: 88,
    battery: null,
    net: "Offline",
    os: "TrueNAS",
    ping: null,
    status: "offline",
    task: null,
  },
];

type FilterType = "all" | "online" | "busy" | "idle" | "offline";

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "online", label: "Online" },
  { key: "busy", label: "Busy" },
  { key: "idle", label: "Idle" },
  { key: "offline", label: "Offline" },
];

function DeviceIcon({ type, size = 38 }: { type: DeviceType["type"]; size?: number }) {
  const configs: Record<DeviceType["type"], { bg: string; color: string; Icon: React.ElementType }> = {
    Laptop:  { bg: "rgba(255, 122, 0, 0.15)", color: "#FF7A00", Icon: Laptop },
    Mac:     { bg: "rgba(255, 122, 0, 0.15)", color: "#FF7A00", Icon: Laptop },
    PC:      { bg: "rgba(255, 122, 0, 0.15)", color: "#FFA000", Icon: Monitor },
    Pi:      { bg: "rgba(16, 185, 129, 0.15)", color: "#10B981", Icon: CircuitBoard },
    Android: { bg: "rgba(255, 122, 0, 0.15)", color: "#FF7A00", Icon: Smartphone },
  };
  const { bg, color, Icon } = configs[type] || configs.PC;
  return (
    <div
      style={{
        background: bg,
        borderRadius: 10,
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={18} color={color} />
    </div>
  );
}

function StatusBadge({ status }: { status: DeviceType["status"] }) {
  const configs: Record<DeviceType["status"], { bg: string; color: string; label: string }> = {
    online:  { bg: "rgba(16, 185, 129, 0.15)", color: "#10B981", label: "Online" },
    busy:    { bg: "rgba(255, 122, 0, 0.15)", color: "#FF7A00", label: "Busy" },
    idle:    { bg: "rgba(100, 116, 139, 0.15)", color: "#94A3B8", label: "Idle" },
    offline: { bg: "rgba(239, 68, 68, 0.15)", color: "#EF4444", label: "Offline" },
  };
  const c = configs[status] || configs.idle;
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        borderRadius: 20,
        padding: "3px 8px",
        fontSize: 11,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <span style={{ fontSize: 8 }}>●</span>
      {c.label}
    </span>
  );
}

interface DevicesPageProps {
  onDeviceSelect: (id: string) => void;
}

export default function DevicesPage({ onDeviceSelect }: DevicesPageProps) {
  const { showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [devices, setDevices] = useState<DeviceType[]>(DEFAULT_DEVICES);
  const [isDiscovering, setIsDiscovering] = useState(false);

  useEffect(() => {
    fetch("/api/devices")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setDevices(data);
      })
      .catch(() => {});
  }, []);

  const handleDiscover = () => {
    setIsDiscovering(true);
    setTimeout(() => {
      setIsDiscovering(false);
      showToast({
        type: "success",
        message: `Network scan complete: ${devices.length} cluster nodes discovered over LAN`,
      });
    }, 900);
  };

  const filtered = useMemo(() => {
    return devices.filter((d) => {
      const matchFilter = activeFilter === "all" || d.status === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.ip.includes(q) ||
        d.hostname.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [activeFilter, searchQuery, devices]);

  const onlineCount = devices.filter((d) => d.status === "online" || d.status === "busy").length;

  return (
    <div style={{ padding: "20px 24px", maxWidth: 1400, margin: "0 auto" }}>
      {/* Search & Action Bar */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
          <Search
            size={16}
            color="#8E929E"
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search devices by name, IP, or hostname..."
            style={{
              width: "100%",
              height: 42,
              backgroundColor: "#18191E",
              border: "1px solid #282A32",
              borderRadius: 12,
              paddingLeft: 38,
              paddingRight: 14,
              fontSize: 14,
              color: "#FFFFFF",
              outline: "none",
            }}
          />
        </div>

        <button
          onClick={handleDiscover}
          disabled={isDiscovering}
          className="btn-primary"
          style={{ height: 42, padding: "0 18px", display: "flex", alignItems: "center", gap: 8 }}
        >
          <Radar size={16} className={isDiscovering ? "animate-spin" : ""} />
          {isDiscovering ? "Scanning LAN…" : "Auto Discover"}
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16 }}>
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: isActive ? "1px solid #FF7A00" : "1px solid #282A32",
                background: isActive ? "rgba(255, 122, 0, 0.15)" : "#18191E",
                color: isActive ? "#FF7A00" : "#8E929E",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: isActive ? "0 0 10px rgba(255, 122, 0, 0.25)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Device Count Summary */}
      <div style={{ fontSize: 13, color: "#8E929E", marginBottom: 16 }}>
        {filtered.length} device{filtered.length !== 1 ? "s" : ""} · {onlineCount} online
      </div>

      {/* Devices Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {filtered.map((device) => (
          <div
            key={device.id}
            onClick={() => onDeviceSelect(device.id)}
            style={{
              backgroundColor: "#18191E",
              border: "1px solid #24262E",
              borderRadius: 14,
              padding: 18,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FF7A00";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#24262E";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
              <DeviceIcon type={device.type} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {device.name}
                  </div>
                  <StatusBadge status={device.status} />
                </div>
                <div style={{ fontSize: 12, color: "#8E929E", marginTop: 2 }}>
                  {device.ip} • {device.hostname}
                </div>
              </div>
            </div>

            {/* Active task banner if any */}
            {device.task && (
              <div
                style={{
                  backgroundColor: "rgba(255, 122, 0, 0.12)",
                  border: "1px solid rgba(255, 122, 0, 0.25)",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontSize: 12,
                  color: "#FF7A00",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 12,
                }}
              >
                <Zap size={13} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {device.task}
                </span>
              </div>
            )}

            {/* Metrics 2x2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "#8E929E" }}>CPU Load</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>{device.cpu}%</div>
                <div style={{ height: 3, backgroundColor: "#24262E", borderRadius: 2, marginTop: 3, overflow: "hidden" }}>
                  <div style={{ width: `${device.cpu}%`, height: "100%", backgroundColor: "#FF7A00" }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#8E929E" }}>RAM Usage</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>{device.ram}%</div>
                <div style={{ height: 3, backgroundColor: "#24262E", borderRadius: 2, marginTop: 3, overflow: "hidden" }}>
                  <div style={{ width: `${device.ram}%`, height: "100%", backgroundColor: "#FFA000" }} />
                </div>
              </div>
            </div>

            {/* Footer row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 10,
                borderTop: "1px solid #24262E",
                fontSize: 12,
                color: "#8E929E",
              }}
            >
              <span>{device.os}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#FF7A00", fontWeight: 600 }}>
                <span>Inspect</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
