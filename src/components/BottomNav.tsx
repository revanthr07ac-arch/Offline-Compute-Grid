import { NavLink } from "react-router-dom";
import { LayoutDashboard, Monitor, ListTodo, FolderOpen, Settings } from "lucide-react";

const TABS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/devices", label: "Devices", icon: Monitor },
  { to: "/tasks", label: "Tasks", icon: ListTodo },
  { to: "/files", label: "Files", icon: FolderOpen },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  return (
    <nav
      className="lg:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "#FFFFFF",
        borderTop: "1px solid #E6EAF0",
        boxShadow: "0 -1px 0 #E6EAF0",
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          style={({ isActive }) => ({
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 56,
            gap: 3,
            textDecoration: "none",
            color: isActive ? "#4F6FFF" : "#98A2B3",
            fontSize: 10,
            fontWeight: isActive ? 600 : 400,
          })}
        >
          {({ isActive }: { isActive: boolean }) => (
            <>
              <div
                style={{
                  width: 28,
                  height: 24,
                  borderRadius: 8,
                  background: isActive ? "#EEF3FF" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                }}
              >
                <Icon size={18} style={{ color: isActive ? "#4F6FFF" : "#98A2B3" }} />
              </div>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
