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
  Menu,
  X,
  Zap,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile drawer on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const initials = currentUser?.avatar || "RR";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/tasks?q=${encodeURIComponent(globalSearch.trim())}`);
      setGlobalSearch("");
    }
  };

  return (
    <div style={{ background: "#0B0C0E", minHeight: "100vh", color: "#FFFFFF" }}>
      {/* ── Desktop Sidebar ────────────────────────────────────────── */}
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
            overflowY: "auto",
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

        {/* Bottom status */}
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

      {/* ── Top Header ────────────────────────────────────────────── */}
      <header
        className="fixed top-0 right-0 left-0 lg:left-[240px] px-3 sm:px-6"
        style={{
          background: "#0D0E12",
          borderBottom: "1px solid #24262E",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
        }}
      >
        {/* Left: Hamburger (Mobile) + Brand/Page Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-[#CBD5E1] hover:text-white hover:bg-[#18191E] transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu size={20} />
          </button>

          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="flex lg:hidden items-center justify-center w-7 h-7 rounded-lg bg-[rgba(255,122,0,0.15)] border border-[rgba(255,122,0,0.35)]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              {pageTitle}
            </span>
          </div>
        </div>

        {/* Right Header items: Search + Notifications + Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Responsive Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search
              size={14}
              style={{
                color: "#64748B",
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="h-9 w-24 sm:w-44 md:w-56 focus:w-36 sm:focus:w-52 md:focus:w-60 transition-all rounded-xl bg-[#18191E] border border-[#282A32] pl-8 pr-3 text-xs sm:text-sm text-white placeholder-[#64748B] outline-none focus:border-[#FF7A00]"
            />
          </form>

          {/* Notifications Icon */}
          <button
            onClick={() => navigate("/notifications")}
            aria-label="View notifications"
            className="hover:border-[#FF7A00] transition-colors relative bg-[#18191E] border border-[#282A32] cursor-pointer w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <Bell size={16} style={{ color: "#CBD5E1" }} />
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

          {/* User Avatar */}
          <div
            onClick={() => navigate("/profile")}
            role="button"
            tabIndex={0}
            title={currentUser?.fullName || "User Profile"}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF7A00] to-[#FF5500] shadow-[0_2px_10px_rgba(255,122,0,0.35)] flex items-center justify-center text-xs font-bold text-white cursor-pointer flex-shrink-0"
          >
            {initials}
          </div>
        </div>
      </header>

      {/* ── Mobile Slideout Navigation Drawer ──────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-[280px] max-w-[85vw] h-full bg-[#0D0E12] border-r border-[#24262E] flex flex-col p-4 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#24262E]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[rgba(255,122,0,0.15)] border border-[rgba(255,122,0,0.35)] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Offline Compute Grid</div>
                  <div className="text-[11px] text-[#8E929E]">Mesh Cluster v1.0</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-[#8E929E] hover:text-white hover:bg-[#18191E]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Status */}
            <div className="my-3 p-3 rounded-xl bg-[#141519] border border-[#24262E] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="font-semibold text-white">8 Nodes Active</span>
              </div>
              <span className="text-[#FF7A00] font-mono">100% LAN</span>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 overflow-y-auto space-y-1 pr-1">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[rgba(255,122,0,0.15)] text-[#FF7A00] border border-[rgba(255,122,0,0.35)] font-semibold shadow-[0_0_12px_rgba(255,122,0,0.15)]"
                        : "text-[#CBD5E1] hover:bg-[#18191E] hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} className={isActive ? "text-[#FF7A00]" : "text-[#8E929E]"} />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}

              <NavLink
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[rgba(255,122,0,0.15)] text-[#FF7A00] border border-[rgba(255,122,0,0.35)] font-semibold"
                      : "text-[#CBD5E1] hover:bg-[#18191E] hover:text-white"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-[#8E929E]" />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#FF7A00] text-white text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            </nav>

            {/* Mobile Action Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/create-task");
              }}
              className="mt-3 w-full btn-primary py-2.5 text-xs flex items-center justify-center gap-2"
            >
              <PlusCircle size={15} />
              <span>Dispatch New Task</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Main Content Area (padding-bottom prevents bottom nav overlap) ── */}
      <main
        className="pt-[56px] lg:pl-[240px] pb-24 lg:pb-8"
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
