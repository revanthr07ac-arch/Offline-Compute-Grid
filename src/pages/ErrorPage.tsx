import {
  AlertOctagon,
  WifiOff,
  Server,
  Wifi,
  CheckCircle2,
  Home,
  RotateCcw
} from "lucide-react";

type ErrorType =
  | "404"
  | "500"
  | "offline"
  | "server-offline"
  | "network-error";

interface ErrorPageProps {
  type?: ErrorType;
  onRetry?: () => void;
  onHome?: () => void;
}

const CONFIGS: Record<
  ErrorType,
  {
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel?: string;
  }
> = {
  "404": {
    title: "Page Not Found",
    description: "The requested route does not exist on this Offline Compute Grid controller.",
    primaryLabel: "Return to Dashboard",
  },
  "500": {
    title: "Cluster Execution Error",
    description: "An unexpected exception occurred within the local scheduler engine.",
    primaryLabel: "Retry Operation",
    secondaryLabel: "Return to Dashboard",
  },
  offline: {
    title: "Grid Controller Offline",
    description: "Unable to establish handshake with local Master Node daemon on port 3001.",
    primaryLabel: "Reconnect to Grid",
    secondaryLabel: "Check Network Settings",
  },
  "server-offline": {
    title: "Compute Core Unreachable",
    description: "The backend telemetry service has stopped responding.",
    primaryLabel: "Restart Service",
    secondaryLabel: "View Local Logs",
  },
  "network-error": {
    title: "Peer Sync Interrupted",
    description: "Multicast packet loss detected on the local area network subnet.",
    primaryLabel: "Retry Mesh Discovery",
    secondaryLabel: "Diagnostics",
  },
};

export default function ErrorPage({
  type = "404",
  onRetry,
  onHome,
}: ErrorPageProps) {
  const c = CONFIGS[type] || CONFIGS["404"];

  const handleHomeClick = () => {
    if (onHome) onHome();
    else window.location.href = "/";
  };

  const handleRetryClick = () => {
    if (onRetry) onRetry();
    else window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-[rgba(255,122,0,0.12)] border border-[rgba(255,122,0,0.3)] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,122,0,0.3)]">
        {type === "offline" ? (
          <WifiOff size={36} className="text-[#FF7A00]" />
        ) : type === "server-offline" ? (
          <Server size={36} className="text-[#FF7A00]" />
        ) : (
          <AlertOctagon size={36} className="text-[#FF7A00]" />
        )}
      </div>

      <span className="text-xs font-mono font-bold text-[#FF7A00] uppercase tracking-widest mb-1.5">
        Error Code {type.toUpperCase()}
      </span>
      <h1 className="text-2xl font-bold text-white mb-2">{c.title}</h1>
      <p className="text-xs text-[#8E929E] max-w-sm mb-6 leading-relaxed">
        {c.description}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
        <button
          onClick={type === "404" ? handleHomeClick : handleRetryClick}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {type === "404" ? <Home size={15} /> : <RotateCcw size={15} />}
          {c.primaryLabel}
        </button>

        {c.secondaryLabel && (
          <button
            onClick={handleHomeClick}
            className="w-full h-11 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-[#8E929E] hover:text-white hover:border-[#FF7A00] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={15} />
            {c.secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
