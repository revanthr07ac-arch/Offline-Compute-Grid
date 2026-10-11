import { Monitor, ListTodo, FolderOpen, Bell, Search, Cpu, Plus } from "lucide-react";

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

const CONFIG: Record<
  EmptyType,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
  }
> = {
  "no-devices": {
    icon: <Monitor size={28} className="text-[#FF7A00]" />,
    title: "No Nodes Discovered",
    description: "Launch the compute client on your local machines or scan the subnet to build the mesh.",
    actionLabel: "Auto-Scan LAN",
  },
  "no-tasks": {
    icon: <ListTodo size={28} className="text-[#FF7A00]" />,
    title: "Task Queue Empty",
    description: "No distributed compute workloads are currently scheduled on the grid.",
    actionLabel: "Submit New Task",
  },
  "no-files": {
    icon: <FolderOpen size={28} className="text-[#FF7A00]" />,
    title: "Cluster Storage Empty",
    description: "Upload videos, datasets, or code binaries to partition them across nodes.",
    actionLabel: "Upload Files",
  },
  "no-notifications": {
    icon: <Bell size={28} className="text-[#FF7A00]" />,
    title: "No Unread Alerts",
    description: "All cluster alerts, heartbeat notices, and task logs are cleared.",
  },
  "no-results": {
    icon: <Search size={28} className="text-[#FF7A00]" />,
    title: "No Matches Found",
    description: "Try adjusting your search query, filter tabs, or opcode parameters.",
  },
  "no-workers": {
    icon: <Cpu size={28} className="text-[#FF7A00]" />,
    title: "No Active Workers",
    description: "Connect at least one secondary device to start offloading computation.",
    actionLabel: "Connect Worker",
  },
};

export default function EmptyStatePage({ type, onAction }: EmptyStatePageProps) {
  const c = CONFIG[type] || CONFIG["no-tasks"];

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[rgba(255,122,0,0.12)] border border-[rgba(255,122,0,0.25)] flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(255,122,0,0.25)]">
        {c.icon}
      </div>

      <h2 className="text-lg font-bold text-white mb-1.5">{c.title}</h2>
      <p className="text-xs text-[#8E929E] max-w-sm mb-6 leading-relaxed">
        {c.description}
      </p>

      {c.actionLabel && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} />
          {c.actionLabel}
        </button>
      )}
    </div>
  );
}
