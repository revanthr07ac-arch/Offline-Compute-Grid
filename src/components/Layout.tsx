import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Grid2x2,
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
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = PAGE_TITLES[location.pathname] ?? "Dashboard";

  return (
    <div style={{ background: "#F7F9FC", minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 240,
          background: "#FFFFFF",
          borderRight: "1px solid #E6EAF0",
          flexDirection: "column",
          zIndex: 40,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Grid2x2 size={28} style={{ color: "#4F6FFF", flexShrink: 0 }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.2,
            }}
          >
            Offline Compute Grid
          </span>
        </div>

        {/* Nav Links */}
        <nav
          style={{
            flex: 1,
            padding: "8px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
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
                height: 40,
                paddingLeft: 12,
                paddingRight: 12,
                gap: 10,
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                background: isActive ? "#EEF3FF" : "transparent",
                color: isActive ? "#4F6FFF" : "#667085",
                transition: "background 0.15s",
              })}
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <Icon
                    size={18}
                    style={{
                      color: isActive ? "#4F6FFF" : "#98A2B3",
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
            padding: 16,
            borderTop: "1px solid #E6EAF0",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10B981",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, color: "#10B981", fontWeight: 500 }}>
              LAN Connected
            </span>
          </div>
          <span style={{ fontSize: 12, color: "#98A2B3" }}>v1.0.0</span>
        </div>
      </aside>

      {/* Top Header */}
      <header
        className="fixed top-0 right-0 left-0 lg:left-[240px]"
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E6EAF0",
          boxShadow: "0 1px 0 #E6EAF0",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 48,
        }}
      >
        {/* Desktop adjustments via class */}
        <div
          className="hidden lg:flex items-center px-6"
          style={{ height: 56 }}
        >
          <span style={{ fontSize: 17, fontWeight: 600, color: "#111827" }}>
            {pageTitle}
          </span>
        </div>

        {/* Mobile left: logo */}
        <div className="flex lg:hidden items-center px-4 gap-2">
          <Grid2x2 size={20} style={{ color: "#4F6FFF" }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
            Offline Compute Grid
          </span>
        </div>

        {/* Desktop right */}
        <div className="hidden lg:flex items-center gap-3 px-6">
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search
              size={16}
              style={{
                color: "#98A2B3",
                position: "absolute",
                left: 12,
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search..."
              style={{
                height: 36,
                width: 208,
                borderRadius: 999,
                background: "#F1F4F9",
                border: "none",
                outline: "none",
                paddingLeft: 36,
                paddingRight: 12,
                fontSize: 13,
                color: "#111827",
              }}
            />
          </div>

          <button
            onClick={() => navigate("/notifications")}
            aria-label="View notifications"
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={20} style={{ color: "#667085" }} />
            <span
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                width: 16,
                height: 16,
                background: "#EF4444",
                borderRadius: "50%",
                fontSize: 10,
                fontWeight: 700,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
            >
              3
            </span>
          </button>

          <div
            onClick={() => navigate("/profile")}
            role="button"
            tabIndex={0}
            aria-label="View profile"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4F6FFF, #7C5CFC)",
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
            AK
          </div>
        </div>

        {/* Mobile right */}
        <div className="flex lg:hidden items-center gap-1 px-4">
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Search size={18} style={{ color: "#667085" }} />
          </button>

          <button
            onClick={() => navigate("/notifications")}
            aria-label="View notifications"
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bell size={18} style={{ color: "#667085" }} />
            <span
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                width: 14,
                height: 14,
                background: "#EF4444",
                borderRadius: "50%",
                fontSize: 9,
                fontWeight: 700,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
            >
              3
            </span>
          </button>

          <div
            onClick={() => navigate("/profile")}
            role="button"
            tabIndex={0}
            aria-label="View profile"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4F6FFF, #7C5CFC)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#FFFFFF",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            AK
          </div>
        </div>
      </header>

      {/* Spacer for fixed header height on desktop */}
      <div className="hidden lg:block" style={{ height: 56 }} />

      {/* Main Content */}
      <main
        className="lg:ml-[240px]"
        style={{
          marginTop: 48,
          background: "#F7F9FC",
          minHeight: "100vh",
        }}
      >
        {/* Desktop adjusts marginTop via class override */}
        <style>{`@media (min-width: 1024px) { main.ocg-main { margin-top: 56px !important; } }`}</style>
        <div
          className="ocg-main lg:p-6 p-4"
          style={{
            paddingBottom: "calc(64px + env(safe-area-inset-bottom))",
          }}
        >
          {children}
        </div>
      </main>

      {/* Bottom Nav (mobile only) */}
      <BottomNav />
    </div>
  );
}
