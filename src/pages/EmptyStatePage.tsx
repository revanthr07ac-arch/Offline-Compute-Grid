import { Monitor, ListTodo, FolderOpen, Bell, Search, Cpu } from "lucide-react";

type EmptyType =
  | "no-devices"
  | "no-tasks"
  | "no-files"
  | "no-notifications"
  | "no-results"
  | "no-workers";

interface EmptyStatePageProps {
  type: EmptyType;
  onAction?: () => void;
}

function NetworkSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="58" stroke="#E6EAF0" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="12" fill="#8B5CF6" fillOpacity="0.08" stroke="#8B5CF6" strokeWidth="1.5" strokeOpacity="0.25" />
      <circle cx="25" cy="35" r="7" fill="#E6EAF0" stroke="#8B5CF6" strokeOpacity="0.2" strokeWidth="1" />
      <circle cx="95" cy="35" r="7" fill="#E6EAF0" stroke="#8B5CF6" strokeOpacity="0.2" strokeWidth="1" />
      <circle cx="25" cy="85" r="7" fill="#E6EAF0" stroke="#8B5CF6" strokeOpacity="0.2" strokeWidth="1" />
      <circle cx="95" cy="85" r="7" fill="#E6EAF0" stroke="#8B5CF6" strokeOpacity="0.2" strokeWidth="1" />
      <line x1="32" y1="38" x2="52" y2="53" stroke="#E6EAF0" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="88" y1="38" x2="68" y2="53" stroke="#E6EAF0" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="32" y1="82" x2="52" y2="67" stroke="#E6EAF0" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="88" y1="82" x2="68" y2="67" stroke="#E6EAF0" strokeWidth="1.5" strokeDasharray="4 3" />
    </svg>
  );
}

function TasksSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="20" width="70" height="80" rx="8" stroke="#E6EAF0" strokeWidth="1.5" />
      <rect x="35" y="35" width="50" height="8" rx="3" fill="#8B5CF6" fillOpacity="0.08" stroke="#8B5CF6" strokeWidth="1" strokeOpacity="0.2" />
      <rect x="35" y="50" width="40" height="8" rx="3" fill="#E6EAF0" />
      <rect x="35" y="65" width="45" height="8" rx="3" fill="#E6EAF0" />
      <rect x="35" y="80" width="35" height="8" rx="3" fill="#E6EAF0" />
    </svg>
  );
}

function FilesSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 25 L30 95 L90 95 L90 45 L70 25 Z" stroke="#E6EAF0" strokeWidth="1.5" fill="none" />
      <path d="M70 25 L70 45 L90 45" stroke="#E6EAF0" strokeWidth="1.5" />
      <rect x="40" y="55" width="40" height="6" rx="2" fill="#8B5CF6" fillOpacity="0.08" stroke="#8B5CF6" strokeWidth="1" strokeOpacity="0.2" />
      <rect x="40" y="67" width="30" height="6" rx="2" fill="#E6EAF0" />
      <rect x="40" y="79" width="35" height="6" rx="2" fill="#E6EAF0" />
    </svg>
  );
}

function BellSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="58" stroke="#E6EAF0" strokeWidth="1.5" />
      <path d="M60 28 C60 28 40 38 40 58 L40 75 L80 75 L80 58 C80 38 60 28 60 28Z" stroke="#E6EAF0" strokeWidth="1.5" fill="#8B5CF6" fillOpacity="0.05" />
      <rect x="48" y="73" width="24" height="6" rx="2" stroke="#E6EAF0" strokeWidth="1.5" />
      <circle cx="60" cy="84" r="4" stroke="#E6EAF0" strokeWidth="1.5" />
      <circle cx="60" cy="28" r="4" fill="#E6EAF0" />
    </svg>
  );
}

function SearchSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="52" cy="50" r="28" stroke="#E6EAF0" strokeWidth="2" />
      <circle cx="52" cy="50" r="18" stroke="#8B5CF6" strokeWidth="1" strokeOpacity="0.2" fill="#8B5CF6" fillOpacity="0.04" />
      <line x1="72" y1="70" x2="92" y2="90" stroke="#E6EAF0" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function WorkersSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="35" height="25" rx="5" stroke="#E6EAF0" strokeWidth="1.5" fill="#8B5CF6" fillOpacity="0.04" />
      <rect x="65" y="30" width="35" height="25" rx="5" stroke="#E6EAF0" strokeWidth="1.5" />
      <rect x="20" y="65" width="35" height="25" rx="5" stroke="#E6EAF0" strokeWidth="1.5" />
      <rect x="65" y="65" width="35" height="25" rx="5" stroke="#E6EAF0" strokeWidth="1.5" />
      <circle cx="32" cy="42" r="4" fill="#E6EAF0" />
      <circle cx="77" cy="42" r="4" fill="#E6EAF0" />
      <circle cx="32" cy="77" r="4" fill="#E6EAF0" />
      <circle cx="77" cy="77" r="4" fill="#E6EAF0" />
    </svg>
  );
}

const config: Record<
  EmptyType,
  {
    svg: React.ReactNode;
    icon: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
  }
> = {
  "no-devices": {
    svg: <NetworkSVG />,
    icon: <Monitor size={28} color="#8B5CF6" />,
    title: "No devices connected",
    description:
      "Discover devices on your local network to start distributing tasks.",
    actionLabel: "Auto Discover",
  },
  "no-tasks": {
    svg: <TasksSVG />,
    icon: <ListTodo size={28} color="#8B5CF6" />,
    title: "No tasks yet",
    description:
      "Create your first task to start using your compute grid.",
    actionLabel: "Create Task",
  },
  "no-files": {
    svg: <FilesSVG />,
    icon: <FolderOpen size={28} color="#8B5CF6" />,
    title: "No files here",
    description: "Upload files to process them across your network.",
    actionLabel: "Upload File",
  },
  "no-notifications": {
    svg: <BellSVG />,
    icon: <Bell size={28} color="#8B5CF6" />,
    title: "All caught up",
    description: "No new notifications.",
  },
  "no-results": {
    svg: <SearchSVG />,
    icon: <Search size={28} color="#8B5CF6" />,
    title: "No results found",
    description: "Try a different search term.",
  },
  "no-workers": {
    svg: <WorkersSVG />,
    icon: <Cpu size={28} color="#8B5CF6" />,
    title: "No workers available",
    description:
      "Ensure other devices are online and connected to the same network.",
    actionLabel: "Scan Network",
  },
};

export default function EmptyStatePage({ type, onAction }: EmptyStatePageProps) {
  const c = config[type];

  return (
    <div
      style={{
        backgroundColor: "#F7F9FC",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 24,
        paddingRight: 24,
        textAlign: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* SVG Illustration */}
      <div style={{ marginBottom: 20 }}>{c.svg}</div>

      {/* Icon Badge */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: "#F3E8FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        {c.icon}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "#111827",
          marginBottom: 8,
        }}
      >
        {c.title}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 14,
          color: "#667085",
          maxWidth: 300,
          lineHeight: 1.6,
        }}
      >
        {c.description}
      </div>

      {/* Action Button */}
      {c.actionLabel && (
        <button
          onClick={onAction}
          style={{
            marginTop: 24,
            height: 44,
            paddingLeft: 24,
            paddingRight: 24,
            borderRadius: 12,
            backgroundColor: "#8B5CF6",
            color: "#FFFFFF",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {c.actionLabel}
        </button>
      )}
    </div>
  );
}
