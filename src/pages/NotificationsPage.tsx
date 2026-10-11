import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Plus,
  WifiOff,
  XCircle,
  HardDrive,
  Wifi,
  Bell,
  CheckCheck,
  Trash2,
  X,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useToast } from "../components/Toast";

export type NotifType =
  | "task_complete"
  | "worker_joined"
  | "worker_disconnected"
  | "task_failed"
  | "storage_warning"
  | "network";

export interface Notification {
  id: number;
  type: NotifType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  group: "today" | "earlier";
  route?: string;
  actionText?: string;
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "task_complete",
    title: "Task Completed",
    description: "4K Video Transcoding finished in 1h 23m — 38 chunks merged",
    time: "2 min ago",
    read: false,
    group: "today",
    route: "/tasks",
    actionText: "View in Task Manager",
  },
  {
    id: 2,
    type: "worker_joined",
    title: "Worker Joined Grid",
    description: "Mac-Studio joined the mesh with 12 cores, 64 GB RAM",
    time: "5 min ago",
    read: false,
    group: "today",
    route: "/devices",
    actionText: "Inspect Device",
  },
  {
    id: 3,
    type: "storage_warning",
    title: "Low Storage Warning",
    description: "Worker-Rig-RTX cache at 88% capacity — flushing temp frames",
    time: "12 min ago",
    read: false,
    group: "today",
    route: "/files",
    actionText: "Open File Storage",
  },
  {
    id: 4,
    type: "task_failed",
    title: "Task Exception Thrown",
    description: "Raytracing Light Baking failed: CUDA OOM on GTX 1660 — rescheduled to Master Node",
    time: "23 min ago",
    read: false,
    group: "today",
    route: "/logs",
    actionText: "Inspect Crash Logs",
  },
  {
    id: 5,
    type: "worker_disconnected",
    title: "Worker Node Lost",
    description: "RPi-Zero heartbeat timed out after 30s — re-routing assigned chunks",
    time: "1h ago",
    read: true,
    group: "today",
    route: "/devices",
    actionText: "Check Peer Mesh",
  },
  {
    id: 6,
    type: "network",
    title: "Subnet Peer Scan Complete",
    description: "Discovered 6 online compute peers on 192.168.1.0/24",
    time: "Yesterday, 11:42",
    read: true,
    group: "earlier",
    route: "/performance",
    actionText: "View Topology",
  },
];

const STORAGE_KEY = "ocg_notifications";

export function getStoredNotifications(): Notification[] {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  return DEFAULT_NOTIFICATIONS;
}

export function saveStoredNotifications(notifs: Notification[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
    const unread = notifs.filter((n) => !n.read).length;
    window.dispatchEvent(
      new CustomEvent("ocg_notifications_updated", {
        detail: { unread, total: notifs.length },
      })
    );
  }
}

function getIcon(type: NotifType) {
  switch (type) {
    case "task_complete":
      return <CheckCircle size={18} className="text-emerald-400" />;
    case "worker_joined":
      return <Plus size={18} className="text-[#FF7A00]" />;
    case "worker_disconnected":
      return <WifiOff size={18} className="text-red-400" />;
    case "task_failed":
      return <XCircle size={18} className="text-red-400" />;
    case "storage_warning":
      return <HardDrive size={18} className="text-[#FFA033]" />;
    case "network":
      return <Wifi size={18} className="text-sky-400" />;
  }
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    getStoredNotifications()
  );
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Sync to localStorage and layout whenever notifications change
  const updateNotifications = (newList: Notification[]) => {
    setNotifications(newList);
    saveStoredNotifications(newList);
  };

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    updateNotifications(updated);
    showToast({ type: "success", message: "All notifications marked as read." });
  };

  const toggleRead = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: !n.read } : n
    );
    updateNotifications(updated);
  };

  const deleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = notifications.find((n) => n.id === id);
    const updated = notifications.filter((n) => n.id !== id);
    updateNotifications(updated);
    showToast({
      type: "info",
      message: `Dismissed: "${target?.title || "Alert"}"`,
    });
  };

  const clearRead = () => {
    const updated = notifications.filter((n) => !n.read);
    updateNotifications(updated);
    setShowClearConfirm(false);
    showToast({ type: "info", message: "Cleared all read notifications." });
  };

  const clearAll = () => {
    updateNotifications([]);
    setShowClearConfirm(false);
    showToast({ type: "warning", message: "All cluster alerts cleared." });
  };

  const handleRestoreDefaults = () => {
    updateNotifications(DEFAULT_NOTIFICATIONS);
    showToast({ type: "success", message: "Restored sample cluster alerts." });
  };

  const handleActionClick = (notif: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    // Mark as read when navigating to destination
    if (!notif.read) {
      const updated = notifications.map((n) =>
        n.id === notif.id ? { ...n, read: true } : n
      );
      updateNotifications(updated);
    }
    if (notif.route) {
      navigate(notif.route);
    }
  };

  const displayed = notifications.filter((n) => filter === "all" || !n.read);
  const todayItems = displayed.filter((n) => n.group === "today");
  const earlierItems = displayed.filter((n) => n.group === "earlier");

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] pb-24">
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 bg-[#111217]/95 backdrop-blur-md border-b border-[#24262E] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-[#FF7A00]" />
          <h1 className="text-base font-bold text-[#FFFFFF]">Grid Alerts</h1>
          {unreadCount > 0 ? (
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] text-xs font-bold font-mono border border-[#FF7A00]/30 animate-pulse">
              {unreadCount} unread
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold font-mono border border-emerald-500/30">
              All caught up
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {unreadCount > 0 && (
            <button
              id="mark-all-read-btn"
              onClick={markAllRead}
              className="text-xs text-[#FF7A00] hover:text-[#FFA033] hover:underline flex items-center gap-1.5 cursor-pointer font-semibold px-2.5 py-1 rounded-lg hover:bg-[#FF7A00]/10 transition-all"
              title="Mark all notifications as read"
            >
              <CheckCheck size={15} />
              <span>Mark all read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <div className="relative">
              <button
                id="clear-notifications-btn"
                onClick={() => setShowClearConfirm(!showClearConfirm)}
                className="p-2 rounded-lg text-[#8E929E] hover:text-red-400 hover:bg-[#1E2028] transition-colors cursor-pointer"
                title="Clear notifications options"
              >
                <Trash2 size={16} />
              </button>

              {/* Clear confirmation popover */}
              {showClearConfirm && (
                <div className="absolute right-0 top-10 w-56 bg-[#181920] border border-[#282A34] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[11px] font-bold text-[#8E929E] px-2.5 py-1 uppercase tracking-wider">
                    Inbox Actions
                  </div>
                  <button
                    onClick={clearRead}
                    className="w-full text-left px-2.5 py-2 text-xs font-semibold text-white hover:bg-[#22242E] rounded-lg transition-colors cursor-pointer"
                  >
                    Clear Read Alerts Only
                  </button>
                  <button
                    onClick={clearAll}
                    className="w-full text-left px-2.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/15 rounded-lg transition-colors cursor-pointer"
                  >
                    Clear All Alerts ({notifications.length})
                  </button>
                  <div className="border-t border-[#24262E] my-1" />
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="w-full text-center px-2 py-1 text-[11px] text-[#8E929E] hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#111217] border-b border-[#24262E] px-4 py-2.5 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            id="filter-all-btn"
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === "all"
                ? "bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-white shadow-md shadow-[#FF7A00]/25"
                : "bg-[#18191E] border border-[#282A32] text-[#8E929E] hover:text-white"
            }`}
          >
            <span>All</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filter === "all" ? "bg-black/30 text-white" : "bg-[#242630] text-[#8E929E]"
              }`}
            >
              {notifications.length}
            </span>
          </button>

          <button
            id="filter-unread-btn"
            onClick={() => setFilter("unread")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === "unread"
                ? "bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-white shadow-md shadow-[#FF7A00]/25"
                : "bg-[#18191E] border border-[#282A32] text-[#8E929E] hover:text-white"
            }`}
          >
            <span>Unread</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filter === "unread" ? "bg-black/30 text-white" : "bg-[#242630] text-[#FF7A00]"
              }`}
            >
              {unreadCount}
            </span>
          </button>
        </div>

        {notifications.length === 0 && (
          <button
            onClick={handleRestoreDefaults}
            className="text-xs text-[#FF7A00] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <RotateCcw size={13} /> Restore Defaults
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        {displayed.length === 0 ? (
          <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-12 text-center text-[#8E929E] shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00] mx-auto mb-3">
              <Bell size={28} />
            </div>
            <p className="text-sm font-bold text-white">No notifications matching filter</p>
            <p className="text-xs mt-1 text-[#8E929E]">
              {filter === "unread"
                ? "You have caught up with all current grid notifications."
                : "All cluster alerts and worker messages are cleared."}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              {filter === "unread" && notifications.length > 0 && (
                <button
                  onClick={() => setFilter("all")}
                  className="px-4 py-2 rounded-xl bg-[#1E2028] border border-[#2C2E3A] text-xs font-semibold text-white hover:border-[#FF7A00] transition-colors cursor-pointer"
                >
                  View All ({notifications.length})
                </button>
              )}
              <button
                onClick={handleRestoreDefaults}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-bold text-white hover:brightness-110 shadow-md shadow-[#FF7A00]/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>Restore Sample Alerts</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* TODAY GROUP */}
            {todayItems.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-[#8E929E] uppercase tracking-wider block mb-2 px-1">
                  Today
                </span>
                <div className="bg-[#14151B] border border-[#24262E] rounded-2xl divide-y divide-[#20222A] overflow-hidden shadow-lg">
                  {todayItems.map((n) => (
                    <div
                      key={n.id}
                      onClick={(e) => toggleRead(n.id, e)}
                      className={`p-3.5 flex items-start gap-3.5 hover:bg-[#18191E] transition-all cursor-pointer group ${
                        !n.read ? "bg-[#FF7A00]/5" : ""
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#0B0C0E] border border-[#20222A] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {getIcon(n.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{n.title}</span>
                            {!n.read && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#FF7A00]/20 text-[#FF7A00]">
                                NEW
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] text-[#8E929E] font-mono">{n.time}</span>
                        </div>
                        <p className="text-xs text-[#8E929E] mt-0.5 leading-relaxed">
                          {n.description}
                        </p>

                        {/* Action Link & Controls */}
                        <div className="flex items-center gap-3 mt-2.5">
                          {n.route && (
                            <button
                              onClick={(e) => handleActionClick(n, e)}
                              className="text-[11px] font-bold text-[#FF7A00] hover:text-[#FFA033] flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <span>{n.actionText || "View Details"}</span>
                              <ArrowRight size={12} />
                            </button>
                          )}

                          <button
                            onClick={(e) => toggleRead(n.id, e)}
                            className="text-[11px] text-[#6E7280] hover:text-white transition-colors cursor-pointer"
                          >
                            {n.read ? "Mark unread" : "Mark read"}
                          </button>
                        </div>
                      </div>

                      {/* Right side controls: Unread dot + Dismiss button */}
                      <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-[#FF7A00] shadow-[0_0_8px_rgba(255,122,0,0.8)]" />
                        )}
                        <button
                          onClick={(e) => deleteNotification(n.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#6E7280] hover:text-red-400 hover:bg-[#20222A] rounded-lg transition-all"
                          title="Dismiss notification"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EARLIER GROUP */}
            {earlierItems.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-[#8E929E] uppercase tracking-wider block mb-2 px-1">
                  Earlier
                </span>
                <div className="bg-[#14151B] border border-[#24262E] rounded-2xl divide-y divide-[#20222A] overflow-hidden shadow-lg">
                  {earlierItems.map((n) => (
                    <div
                      key={n.id}
                      onClick={(e) => toggleRead(n.id, e)}
                      className={`p-3.5 flex items-start gap-3.5 hover:bg-[#18191E] transition-all cursor-pointer group ${
                        !n.read ? "bg-[#FF7A00]/5" : ""
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#0B0C0E] border border-[#20222A] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {getIcon(n.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{n.title}</span>
                            {!n.read && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#FF7A00]/20 text-[#FF7A00]">
                                NEW
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] text-[#8E929E] font-mono">{n.time}</span>
                        </div>
                        <p className="text-xs text-[#8E929E] mt-0.5 leading-relaxed">
                          {n.description}
                        </p>

                        {/* Action Link & Controls */}
                        <div className="flex items-center gap-3 mt-2.5">
                          {n.route && (
                            <button
                              onClick={(e) => handleActionClick(n, e)}
                              className="text-[11px] font-bold text-[#FF7A00] hover:text-[#FFA033] flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <span>{n.actionText || "View Details"}</span>
                              <ArrowRight size={12} />
                            </button>
                          )}

                          <button
                            onClick={(e) => toggleRead(n.id, e)}
                            className="text-[11px] text-[#6E7280] hover:text-white transition-colors cursor-pointer"
                          >
                            {n.read ? "Mark unread" : "Mark read"}
                          </button>
                        </div>
                      </div>

                      {/* Right side controls */}
                      <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-[#FF7A00] shadow-[0_0_8px_rgba(255,122,0,0.8)]" />
                        )}
                        <button
                          onClick={(e) => deleteNotification(n.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#6E7280] hover:text-red-400 hover:bg-[#20222A] rounded-lg transition-all"
                          title="Dismiss notification"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
