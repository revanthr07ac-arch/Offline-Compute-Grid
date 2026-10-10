import { useState } from "react";
import {
  CheckCircle,
  Plus,
  WifiOff,
  XCircle,
  HardDrive,
  Wifi,
} from "lucide-react";

type NotifType =
  | "task_complete"
  | "worker_joined"
  | "worker_disconnected"
  | "task_failed"
  | "storage_warning"
  | "network";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  group: "today" | "earlier";
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "task_complete",
    title: "Task Completed",
    description: "4K Video Transcoding finished in 1h 23m",
    time: "2 min ago",
    read: false,
    group: "today",
  },
  {
    id: 2,
    type: "worker_joined",
    title: "Worker Joined",
    description: "MacBook-Pro-5 joined the grid with 10 cores, 64 GB RAM",
    time: "5 min ago",
    read: false,
    group: "today",
  },
  {
    id: 3,
    type: "storage_warning",
    title: "Low Storage Warning",
    description: "GAMING-PC-7 storage at 88% capacity — consider freeing space",
    time: "12 min ago",
    read: false,
    group: "today",
  },
  {
    id: 4,
    type: "task_failed",
    title: "Task Failed",
    description: "Python Data Pipeline v2 failed: OOM on RPi-3 — retrying on PC-2",
    time: "23 min ago",
    read: false,
    group: "today",
  },
  {
    id: 5,
    type: "worker_disconnected",
    title: "Worker Disconnected",
    description: "RPi-Zero-6 heartbeat lost after 30s timeout — removed from pool",
    time: "1h ago",
    read: true,
    group: "today",
  },
  {
    id: 6,
    type: "task_complete",
    title: "Task Completed",
    description: "OCR Batch Q4 Reports finished successfully — 3 artifacts generated",
    time: "2h ago",
    read: true,
    group: "today",
  },
  {
    id: 7,
    type: "network",
    title: "Network Scan Complete",
    description: "Discovered 4 new peers on 192.168.1.0/24 subnet",
    time: "Yesterday, 11:42",
    read: true,
    group: "earlier",
  },
  {
    id: 8,
    type: "worker_joined",
    title: "Worker Joined",
    description: "DESKTOP-WIN11 joined the grid with 16 cores, 32 GB RAM",
    time: "Yesterday, 10:15",
    read: true,
    group: "earlier",
  },
  {
    id: 9,
    type: "task_complete",
    title: "Task Completed",
    description: "Podcast audio normalization batch (12 episodes) finished in 22m",
    time: "Yesterday, 09:30",
    read: true,
    group: "earlier",
  },
  {
    id: 10,
    type: "task_failed",
    title: "Task Failed",
    description: "Invoice PDF Merge timed out — output file may be incomplete",
    time: "2 days ago",
    read: true,
    group: "earlier",
  },
  {
    id: 11,
    type: "storage_warning",
    title: "Storage Alert Resolved",
    description: "GAMING-PC-7 freed 120 GB after auto-cleanup — storage at 62%",
    time: "2 days ago",
    read: true,
    group: "earlier",
  },
  {
    id: 12,
    type: "worker_disconnected",
    title: "Worker Disconnected",
    description: "OldMac-3 gracefully left the grid — session lasted 14h 22m",
    time: "3 days ago",
    read: true,
    group: "earlier",
  },
];

function iconConfig(type: NotifType): { bg: string; icon: React.ReactNode } {
  switch (type) {
    case "task_complete":
      return { bg: "#ECFDF5", icon: <CheckCircle size={18} color="#10B981" /> };
    case "worker_joined":
      return { bg: "#F3E8FF", icon: <Plus size={18} color="#8B5CF6" /> };
    case "worker_disconnected":
      return { bg: "#FEF2F2", icon: <WifiOff size={18} color="#EF4444" /> };
    case "task_failed":
      return { bg: "#FEF2F2", icon: <XCircle size={18} color="#EF4444" /> };
    case "storage_warning":
      return { bg: "#FFF7ED", icon: <HardDrive size={18} color="#F59E0B" /> };
    case "network":
      return { bg: "#ECFEFF", icon: <Wifi size={18} color="#0EA5E9" /> };
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: number) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  const todayItems = notifications.filter((n) => n.group === "today");
  const earlierItems = notifications.filter((n) => n.group === "earlier");

  function NotifItem({ notif }: { notif: Notification }) {
    const { bg, icon } = iconConfig(notif.type);
    return (
      <div
        onClick={() => markRead(notif.id)}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "14px 16px",
          borderBottom: "1px solid #E6EAF0",
          background: notif.read ? "#FFFFFF" : "#FAFBFF",
          position: "relative",
          cursor: "pointer",
        }}
      >
        {/* Unread left bar */}
        {!notif.read && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 3,
              background: "#8B5CF6",
              borderRadius: "0 2px 2px 0",
            }}
          />
        )}

        {/* Icon circle */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.3 }}>
            {notif.title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#667085",
              marginTop: 2,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {notif.description}
          </div>
          <div style={{ fontSize: 11, color: "#98A2B3", marginTop: 4 }}>{notif.time}</div>
        </div>

        {/* Unread dot */}
        {!notif.read && (
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#8B5CF6",
              flexShrink: 0,
              marginTop: 6,
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ background: "#F7F9FC", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E6EAF0",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#111827" }}>Notifications</span>
          {unreadCount > 0 && (
            <span
              style={{
                background: "#F3E8FF",
                color: "#8B5CF6",
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 10,
                padding: "2px 8px",
              }}
            >
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              background: "none",
              border: "none",
              color: "#8B5CF6",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div style={{ paddingBottom: 96 }}>
        {/* Today */}
        {todayItems.length > 0 && (
          <>
            <div
              style={{
                padding: "10px 16px 6px",
                fontSize: 11,
                fontWeight: 600,
                color: "#98A2B3",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Today
            </div>
            {todayItems.map((n) => (
              <NotifItem key={n.id} notif={n} />
            ))}
          </>
        )}

        {/* Earlier */}
        {earlierItems.length > 0 && (
          <>
            <div
              style={{
                padding: "14px 16px 6px",
                fontSize: 11,
                fontWeight: 600,
                color: "#98A2B3",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Earlier
            </div>
            {earlierItems.map((n) => (
              <NotifItem key={n.id} notif={n} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
