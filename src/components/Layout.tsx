import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Monitor,
  ListTodo,
  PlusCircle,
  FolderOpen,
  Activity,
  Terminal,
  Settings,
  User,
  Search,
  Bell,
} from "lucide-react";
import BottomNav from "./BottomNav";
import GeminiAgentWidget from "./GeminiAgentWidget";

const NAV_LINKS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/devices", label: "Devices", icon: Monitor },
  { to: "/tasks", label: "Tasks", icon: ListTodo },
  { to: "/create-task", label: "New Task", icon: PlusCircle },
  { to: "/files", label: "Files", icon: FolderOpen },
  { to: "/performance", label: "Performance", icon: Activity },
  { to: "/logs", label: "Logs", icon: Terminal },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/profile", label: "Profile", icon: User },
];

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/devices": "Devices",
  "/tasks": "Tasks",
  "/create-task": "New Task",
  "/files": "Files",
  "/performance": "Performance",
  "/logs": "Logs",
  "/notifications": "Notifications",
  "/settings": "Settings",
  "/profile": "Profile",
};

interface LayoutProps {
  children: React.ReactNode;
  currentUser?: { fullName?: string; email?: string; avatar?: string };
  onLogout?: () => void;
}

export default function Layout({ children, currentUser }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [globalSearch, setGlobalSearch] = useState("");
  const pageTitle = PAGE_TITLES[location.pathname] ?? "Dashboard";

  const [unreadCount, setUnreadCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("ocg_notifications");
      if (saved) {
        const notifs = JSON.parse(saved);
        if (Array.isArray(notifs)) return notifs.filter((n: any) => !n.read).length;
      }
    } catch {}
    return 4;
  });

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (typeof e.detail?.unread === "number") {
        setUnreadCount(e.detail.unread);
      } else {
        try {
          const saved = localStorage.getItem("ocg_notifications");
          if (saved) {
            const notifs = JSON.parse(saved);
            if (Array.isArray(notifs)) setUnreadCount(notifs.filter((n: any) => !n.read).length);
          }
        } catch {}
      }
    };

    window.addEventListener("ocg_notifications_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("ocg_notifications_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const initials = currentUser?.avatar || "RR";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/tasks?q=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  return (
    <div style={{ background: "#0B0C0E", minHeight: "100vh", color: "#FFFFFF" }}>
      {/* Desktop Sidebar matching Image 1 */}
      <aside
        className="hidden lg:flex"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 240,
          background: "#0D0E12",
          borderRight: "1px solid #24262E",
          flexDirection: "column",
          zIndex: 40,
        }}
      >
        {/* Brand Header */}
        <div
          onClick={() => navigate("/")}
          style={{
            padding: "20px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: "rgba(255, 122, 0, 0.15)",
              border: "1px solid rgba(255, 122, 0, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.2px",
            }}
          >
            Offline Compute Grid
          </span>
        </div>

        {/* Nav Links */}
        <nav
          style={{
            flex: 1,
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                height: 44,
                paddingLeft: 14,
                paddingRight: 14,
                gap: 12,
                borderRadius: 12,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                background: isActive ? "rgba(255, 122, 0, 0.12)" : "transparent",
                border: isActive ? "1px solid rgba(255, 122, 0, 0.4)" : "1px solid transparent",
                color: isActive ? "#FF7A00" : "#8E929E",
                boxShadow: isActive ? "0 0 16px rgba(255, 122, 0, 0.15)" : "none",
                transition: "all 0.15s ease",
              })}
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <Icon
                    size={18}
                    style={{
                      color: isActive ? "#FF7A00" : "#8E929E",
                      flexShrink: 0,
                    }}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom status matching Image 1 exact text */}
        <div
          style={{
            marginTop: "auto",
            padding: "16px 18px",
            borderTop: "1px solid #24262E",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#FF7A00",
                boxShadow: "0 0 8px #FF7A00",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, color: "#FF7A00", fontWeight: 600 }}>
              LAN Grid Active
            </span>
          </div>
          <span style={{ fontSize: 11, color: "#64748B" }}>
            v1.0.0 • Solar Engine
          </span>
        </div>
      </aside>

      {/* Top Header matching Image 1 */}
      <header
        className="fixed top-0 right-0 left-0 lg:left-[240px]"
        style={{
          background: "#0D0E12",
          borderBottom: "1px solid #24262E",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {/* Page Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="flex lg:hidden items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>
            {pageTitle}
          </span>
        </div>

        {/* Right Header items matching Image 1 */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Search cluster... input */}
          <form onSubmit={handleSearchSubmit} style={{ position: "relative" }}>
            <Search
              size={15}
              style={{
                color: "#64748B",
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search cluster..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              style={{
                height: 36,
                width: 220,
                borderRadius: 10,
                background: "#18191E",
                border: "1px solid #282A32",
                outline: "none",
                paddingLeft: 34,
                paddingRight: 12,
                fontSize: 13,
                color: "#FFFFFF",
                fontFamily: "inherit",
              }}
            />
          </form>

          {/* Notifications Icon with dynamic unread count */}
          <button
            onClick={() => navigate("/notifications")}
            aria-label="View notifications"
            className="hover:border-[#FF7A00] transition-colors"
            style={{
              position: "relative",
              background: "#18191E",
              border: "1px solid #282A32",
              cursor: "pointer",
              width: 36,
              height: 36,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={17} style={{ color: "#CBD5E1" }} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -3,
                  right: -3,
                  minWidth: 16,
                  height: 16,
                  background: "#FF7A00",
                  boxShadow: "0 0 8px rgba(255, 122, 0, 0.6)",
                  borderRadius: "50%",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  padding: "0 4px",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Avatar Circle with RR matching Image 1 */}
          <div
            onClick={() => navigate("/profile")}
            role="button"
            tabIndex={0}
            title={currentUser?.fullName || "User Profile"}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF7A00 0%, #FF5500 100%)",
              boxShadow: "0 2px 10px rgba(255, 122, 0, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#FFFFFF",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className="pt-[56px] lg:pl-[240px] pb-16 lg:pb-0"
        style={{ minHeight: "100vh", backgroundColor: "#0B0C0E" }}
      >
        {children}
      </main>

      {/* Global Gemini AI Agent Copilot Widget */}
      <GeminiAgentWidget />

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}
