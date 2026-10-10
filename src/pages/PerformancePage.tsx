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

const TIMELINE_OPTIONS = ["1m", "5m", "15m", "1h", "24h"];
const NODE_NAMES = ["Laptop-1", "PC-2", "RPi-3", "Mac-5", "Pi-4", "Mini-6"];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePoint(t: number) {
  return {
    t,
    cpu1: rand(55, 85),
    cpu2: rand(40, 70),
    cpu3: rand(60, 90),
    cpu4: rand(30, 60),
    memUsed: rand(60, 80),
    memAvail: rand(20, 40),
    netDown: rand(100, 200),
    netUp: rand(20, 60),
  };
}

function initData() {
  return Array.from({ length: 20 }, (_, i) => generatePoint(i));
}

function generateHeatmapRow() {
  return Array.from({ length: 20 }, () => rand(5, 100));
}

const HEATMAP_DATA = NODE_NAMES.map((name) => ({
  name,
  values: generateHeatmapRow(),
}));

const NODE_TABLE = [
  { node: "Laptop-1", cpu: 67, ram: 71, disk: 54, temp: 61, tasks: 3, status: "Active" },
  { node: "PC-2", cpu: 45, ram: 58, disk: 32, temp: 55, tasks: 5, status: "Active" },
  { node: "RPi-3", cpu: 82, ram: 88, disk: 71, temp: 74, tasks: 2, status: "Busy" },
  { node: "Mac-5", cpu: 38, ram: 49, disk: 28, temp: 52, tasks: 4, status: "Active" },
  { node: "Pi-4", cpu: 91, ram: 94, disk: 85, temp: 79, tasks: 1, status: "Critical" },
  { node: "Mini-6", cpu: 22, ram: 33, disk: 18, temp: 44, tasks: 0, status: "Idle" },
];

function MiniSparkline({ color, dashed }: { color: string; dashed?: boolean }) {
  const data = Array.from({ length: 10 }, (_, i) => ({ v: rand(20, 90), i }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          strokeDasharray={dashed ? "4 2" : undefined}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          flex: 1,
          height: 4,
          background: "#F1F4F9",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: color,
            borderRadius: 2,
          }}
        />
      </div>
      <span style={{ fontSize: 10, color: "#98A2B3", width: 24, textAlign: "right" }}>
        {value}%
      </span>
    </div>
  );
}

function statusColor(s: string) {
  if (s === "Active") return "#10B981";
  if (s === "Busy") return "#F59E0B";
  if (s === "Critical") return "#EF4444";
  return "#98A2B3";
}

export default function PerformancePage() {
  const [timeline, setTimeline] = useState("5m");
  const [chartData, setChartData] = useState(initData);

  useEffect(() => {
    const id = setInterval(() => {
      setChartData((prev) => {
        const next = [...prev.slice(1), generatePoint(prev[prev.length - 1].t + 1)];
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const RESOURCE_CARDS = [
    { label: "CPU Avg", value: "67%", color: "#8B5CF6" },
    { label: "Memory", value: "71%", color: "#7C5CFC" },
    { label: "Net In", value: "142 MB/s", color: "#10B981" },
    { label: "Net Out", value: "38 MB/s", color: "#10B981", dashed: true },
    { label: "Disk I/O", value: "54 MB/s", color: "#F59E0B" },
    { label: "Temp", value: "61°C", color: "#EF4444" },
  ];

  return (
    <div style={{ background: "#F7F9FC", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E6EAF0",
          padding: "12px 16px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#111827" }}>Performance</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              className="pulse-dot"
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10B981",
              }}
            />
            <span style={{ fontSize: 12, color: "#10B981", fontWeight: 500 }}>Live · 2s</span>
          </div>
        </div>
        {/* Timeline pills */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 12 }}>
          {TIMELINE_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => setTimeline(t)}
              style={{
                flexShrink: 0,
                padding: "5px 14px",
                borderRadius: 20,
                border: "none",
                background: timeline === t ? "#8B5CF6" : "#F1F4F9",
                color: timeline === t ? "#FFFFFF" : "#667085",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Resource cards 2×3 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          padding: "12px 16px 0",
        }}
      >
        {RESOURCE_CARDS.map((rc) => (
          <div key={rc.label} className="card-sm" style={{ padding: 12 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#98A2B3",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 2,
              }}
            >
              {rc.label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
              {rc.value}
            </div>
            <MiniSparkline color={rc.color} dashed={(rc as any).dashed} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "12px 16px 0" }}>
        {/* CPU Usage */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
            CPU Usage
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#98A2B3" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E6EAF0" }}
                labelFormatter={() => ""}
              />
              <Area type="monotone" dataKey="cpu1" name="Laptop-1" stroke="#8B5CF6" fill="#8B5CF620" strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="cpu2" name="PC-2" stroke="#7C5CFC" fill="#7C5CFC20" strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="cpu3" name="RPi-3" stroke="#10B981" fill="#10B98120" strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="cpu4" name="Mac-5" stroke="#F59E0B" fill="#F59E0B20" strokeWidth={1.5} dot={false} />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
                iconType="circle"
                iconSize={6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Memory */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
            Memory
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#98A2B3" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E6EAF0" }} labelFormatter={() => ""} />
              <Area type="monotone" dataKey="memUsed" name="Used" stroke="#7C5CFC" fill="#7C5CFC20" strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="memAvail" name="Available" stroke="#10B981" fill="#10B98120" strokeWidth={1.5} dot={false} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} iconType="circle" iconSize={6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Network */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
            Network (MB/s)
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#98A2B3" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E6EAF0" }} labelFormatter={() => ""} />
              <Line type="monotone" dataKey="netDown" name="Download" stroke="#10B981" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="netUp" name="Upload" stroke="#8B5CF6" strokeWidth={1.5} dot={false} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} iconType="circle" iconSize={6} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Node comparison table */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 12 }}>
            Node Comparison
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr>
                  {["Node", "CPU", "RAM", "Disk", "Temp", "Tasks", "Status"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "4px 8px",
                        color: "#98A2B3",
                        fontWeight: 600,
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {NODE_TABLE.map((row, i) => (
                  <tr
                    key={row.node}
                    style={{ background: i % 2 === 0 ? "#F7F9FC" : "#FFFFFF" }}
                  >
                    <td style={{ padding: "6px 8px", fontWeight: 600, color: "#111827", whiteSpace: "nowrap" }}>
                      {row.node}
                    </td>
                    <td style={{ padding: "6px 8px", minWidth: 70 }}>
                      <MiniBar value={row.cpu} color="#8B5CF6" />
                    </td>
                    <td style={{ padding: "6px 8px", minWidth: 70 }}>
                      <MiniBar value={row.ram} color="#7C5CFC" />
                    </td>
                    <td style={{ padding: "6px 8px", minWidth: 70 }}>
                      <MiniBar value={row.disk} color="#F59E0B" />
                    </td>
                    <td style={{ padding: "6px 8px", color: "#EF4444", fontWeight: 600 }}>
                      {row.temp}&deg;
                    </td>
                    <td style={{ padding: "6px 8px", color: "#111827", textAlign: "center" }}>
                      {row.tasks}
                    </td>
                    <td style={{ padding: "6px 8px" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: statusColor(row.status),
                          background: `${statusColor(row.status)}18`,
                          borderRadius: 6,
                          padding: "2px 6px",
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card" style={{ margin: "12px 16px 96px", padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>CPU Heatmap</div>
        <div style={{ fontSize: 11, color: "#98A2B3", marginBottom: 12 }}>Last 30 min</div>
        <div style={{ overflowX: "auto" }}>
          {HEATMAP_DATA.map((row) => (
            <div
              key={row.name}
              style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}
            >
              <div
                style={{
                  width: 60,
                  fontSize: 10,
                  color: "#98A2B3",
                  flexShrink: 0,
                  textAlign: "right",
                  paddingRight: 6,
                }}
              >
                {row.name}
              </div>
              <div style={{ display: "flex", gap: 2 }}>
                {row.values.map((v, j) => (
                  <div
                    key={j}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 2,
                      background: `rgba(79,111,255,${Math.max(0.05, v / 100)})`,
                      flexShrink: 0,
                    }}
                    title={`${v}%`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          <span style={{ fontSize: 10, color: "#98A2B3" }}>Low</span>
          <div
            style={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              background: "linear-gradient(90deg, rgba(79,111,255,0.05), rgba(79,111,255,1))",
            }}
          />
          <span style={{ fontSize: 10, color: "#98A2B3" }}>High</span>
        </div>
      </div>
    </div>
  );
}
