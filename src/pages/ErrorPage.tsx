import {
  Search,
  AlertOctagon,
  WifiOff,
  Server,
  Wifi,
  CheckCircle2,
} from "lucide-react";

type ErrorType =
  | "404"
  | "500"
  | "offline"
  | "server-offline"
  | "network-error";

interface ErrorPageProps {
  type: ErrorType;
  onRetry?: () => void;
  onHome?: () => void;
}

function OfflineSVG() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" stroke="#E6EAF0" strokeWidth="2" />
      <circle cx="50" cy="50" r="10" fill="#4F6FFF" fillOpacity="0.2" stroke="#4F6FFF" strokeWidth="1.5" strokeOpacity="0.4" />
      <circle cx="20" cy="30" r="6" fill="#E6EAF0" stroke="#4F6FFF" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="80" cy="30" r="6" fill="#E6EAF0" stroke="#4F6FFF" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="20" cy="70" r="6" fill="#E6EAF0" stroke="#4F6FFF" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="80" cy="70" r="6" fill="#E6EAF0" stroke="#4F6FFF" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="26" y1="33" x2="44" y2="45" stroke="#E6EAF0" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="74" y1="33" x2="56" y2="45" stroke="#E6EAF0" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="26" y1="67" x2="44" y2="55" stroke="#E6EAF0" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="74" y1="67" x2="56" y2="55" stroke="#E6EAF0" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="35" y1="22" x2="65" y2="22" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="30" y1="18" x2="70" y2="26" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" opacity="0" />
      <line x1="38" y1="26" x2="62" y2="18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function FourOhFourSVG() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="20" width="90" height="60" rx="8" stroke="#E6EAF0" strokeWidth="2" />
      <circle cx="25" cy="40" r="5" fill="#4F6FFF" fillOpacity="0.2" stroke="#4F6FFF" strokeWidth="1.5" strokeOpacity="0.5" />
      <circle cx="50" cy="40" r="5" fill="#4F6FFF" fillOpacity="0.2" stroke="#4F6FFF" strokeWidth="1.5" strokeOpacity="0.5" />
      <circle cx="75" cy="40" r="5" fill="#4F6FFF" fillOpacity="0.2" stroke="#4F6FFF" strokeWidth="1.5" strokeOpacity="0.5" />
      <circle cx="25" cy="60" r="5" fill="#E6EAF0" />
      <circle cx="50" cy="60" r="5" fill="#4F6FFF" fillOpacity="0.15" stroke="#4F6FFF" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="75" cy="60" r="5" fill="#E6EAF0" />
      <line x1="25" y1="45" x2="25" y2="55" stroke="#E6EAF0" strokeWidth="1.5" />
      <line x1="50" y1="45" x2="50" y2="55" stroke="#E6EAF0" strokeWidth="1.5" />
      <line x1="75" y1="45" x2="75" y2="55" stroke="#E6EAF0" strokeWidth="1.5" />
      <line x1="30" y1="40" x2="45" y2="40" stroke="#E6EAF0" strokeWidth="1.5" />
      <line x1="55" y1="40" x2="70" y2="40" stroke="#E6EAF0" strokeWidth="1.5" />
    </svg>
  );
}

function ServerSVG() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="15" width="70" height="22" rx="5" stroke="#E6EAF0" strokeWidth="2" />
      <rect x="15" y="42" width="70" height="22" rx="5" stroke="#E6EAF0" strokeWidth="2" />
      <rect x="15" y="69" width="70" height="16" rx="5" stroke="#E6EAF0" strokeWidth="2" />
      <circle cx="75" cy="26" r="4" fill="#EF4444" fillOpacity="0.3" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="75" cy="53" r="4" fill="#EF4444" fillOpacity="0.3" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="75" cy="77" r="4" fill="#E6EAF0" />
      <rect x="23" y="22" width="30" height="8" rx="2" fill="#4F6FFF" fillOpacity="0.1" stroke="#4F6FFF" strokeWidth="1" strokeOpacity="0.2" />
      <rect x="23" y="49" width="30" height="8" rx="2" fill="#4F6FFF" fillOpacity="0.1" stroke="#4F6FFF" strokeWidth="1" strokeOpacity="0.2" />
    </svg>
  );
}

const config: Record<
  ErrorType,
  {
    svg: React.ReactNode;
    iconBg: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel?: string;
  }
> = {
  "404": {
    svg: <FourOhFourSVG />,
    iconBg: "#EEF3FF",
    icon: <Search size={32} color="#4F6FFF" />,
    title: "Page Not Found",
    description:
      "The page you are looking for does not exist or has been moved to a different location.",
    primaryLabel: "Return Home",
  },
  "500": {
    svg: <ServerSVG />,
    iconBg: "#FEF2F2",
    icon: <AlertOctagon size={32} color="#EF4444" />,
    title: "Something Went Wrong",
    description:
      "An unexpected server error occurred. Our team has been notified. Please try again shortly.",
    primaryLabel: "Retry",
    secondaryLabel: "Return Home",
  },
  offline: {
    svg: <OfflineSVG />,
    iconBg: "#FFF7ED",
    icon: <WifiOff size={32} color="#F59E0B" />,
    title: "Offline Mode",
    description:
      "Internet unavailable. Your local compute grid continues operating over LAN.",
    primaryLabel: "Retry Connection",
    secondaryLabel: "Network Scanner",
  },
  "server-offline": {
    svg: <ServerSVG />,
    iconBg: "#FEF2F2",
    icon: <Server size={32} color="#EF4444" />,
    title: "Master Node Offline",
    description:
      "The master node is unreachable. Check that it is powered on and connected to the same local network.",
    primaryLabel: "Retry Connection",
    secondaryLabel: "Network Scanner",
  },
  "network-error": {
    svg: <OfflineSVG />,
    iconBg: "#FFF7ED",
    icon: <Wifi size={32} color="#F59E0B" />,
    title: "Connection Error",
    description:
      "Unable to reach the network. Check your connection settings and try again.",
    primaryLabel: "Retry Connection",
    secondaryLabel: "Network Scanner",
  },
};

export default function ErrorPage({ type, onRetry, onHome }: ErrorPageProps) {
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
      <div style={{ marginBottom: 24 }}>{c.svg}</div>

      {/* Icon Pill */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: c.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {c.icon}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#111827",
          marginBottom: 8,
        }}
      >
        {c.title}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 15,
          color: "#667085",
          maxWidth: 300,
          lineHeight: 1.6,
          marginTop: 8,
        }}
      >
        {c.description}
      </div>

      {/* Offline status list */}
      {type === "offline" && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          {[
            "LAN Connected",
            "Master Node Online",
            "Workers Online",
          ].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "#111827",
              }}
            >
              <CheckCircle2 size={16} color="#10B981" />
              {item}
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div
        style={{
          marginTop: 32,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "100%",
          maxWidth: 300,
        }}
      >
        <button
          onClick={type === "404" ? onHome : onRetry}
          style={{
            height: 48,
            borderRadius: 12,
            backgroundColor: "#4F6FFF",
            color: "#FFFFFF",
            border: "none",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {c.primaryLabel}
        </button>
        {c.secondaryLabel && (
          <button
            onClick={onHome}
            style={{
              height: 48,
              borderRadius: 12,
              backgroundColor: "#FFFFFF",
              color: "#111827",
              border: "1px solid #E6EAF0",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {c.secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
