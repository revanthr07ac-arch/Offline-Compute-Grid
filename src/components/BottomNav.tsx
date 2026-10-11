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
        background: "#0D0E12",
        borderTop: "1px solid #24262E",
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
            color: isActive ? "#FF7A00" : "#8E929E",
            fontSize: 10,
            fontWeight: isActive ? 600 : 400,
          })}
        >
          {({ isActive }: { isActive: boolean }) => (
            <>
              <div
                style={{
                  width: 32,
                  height: 26,
                  borderRadius: 8,
                  background: isActive ? "rgba(255, 122, 0, 0.15)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                }}
              >
                <Icon
                  size={18}
                  style={{
                    color: isActive ? "#FF7A00" : "#8E929E",
                    strokeWidth: isActive ? 2.5 : 2,
                  }}
                />
              </div>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
