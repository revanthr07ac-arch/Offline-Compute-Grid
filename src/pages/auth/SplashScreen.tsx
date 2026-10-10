import { useEffect } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#F7F9FC",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Blob top-left */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          left: "-60px",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(79,111,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          borderRadius: "50%",
        }}
      />
      {/* Blob bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          right: "-60px",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(124,92,252,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
          borderRadius: "50%",
        }}
      />

      <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Logo */}
        <div
          style={{
            width: "72px",
            height: "72px",
            background: "#FFFFFF",
            border: "1px solid #E6EAF0",
            borderRadius: "20px",
            boxShadow: "0 2px 16px rgba(79,111,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Lines from center to outer nodes */}
            <line x1="36" y1="36" x2="36" y2="12" stroke="#8B5CF6" strokeWidth="1.2" strokeOpacity="0.4" />
            <line x1="36" y1="36" x2="56" y2="22" stroke="#8B5CF6" strokeWidth="1.2" strokeOpacity="0.4" />
            <line x1="36" y1="36" x2="58" y2="46" stroke="#8B5CF6" strokeWidth="1.2" strokeOpacity="0.4" />
            <line x1="36" y1="36" x2="36" y2="60" stroke="#8B5CF6" strokeWidth="1.2" strokeOpacity="0.4" />
            <line x1="36" y1="36" x2="16" y2="46" stroke="#8B5CF6" strokeWidth="1.2" strokeOpacity="0.4" />
            <line x1="36" y1="36" x2="14" y2="22" stroke="#8B5CF6" strokeWidth="1.2" strokeOpacity="0.4" />
            {/* Outer nodes */}
            <circle cx="36" cy="12" r="5" stroke="#8B5CF6" strokeWidth="1.5" fill="white" strokeOpacity="0.5" />
            <circle cx="56" cy="22" r="5" stroke="#8B5CF6" strokeWidth="1.5" fill="white" strokeOpacity="0.5" />
            <circle cx="58" cy="46" r="5" stroke="#8B5CF6" strokeWidth="1.5" fill="white" strokeOpacity="0.5" />
            <circle cx="36" cy="60" r="5" stroke="#8B5CF6" strokeWidth="1.5" fill="white" strokeOpacity="0.5" />
            <circle cx="16" cy="46" r="5" stroke="#8B5CF6" strokeWidth="1.5" fill="white" strokeOpacity="0.5" />
            <circle cx="14" cy="22" r="5" stroke="#8B5CF6" strokeWidth="1.5" fill="white" strokeOpacity="0.5" />
            {/* Center node */}
            <circle cx="36" cy="36" r="8" fill="#8B5CF6" />
          </svg>
        </div>

        <p
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#111827",
            marginTop: "16px",
            letterSpacing: "-0.3px",
          }}
        >
          Offline Compute Grid
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#667085",
            marginTop: "4px",
            textAlign: "center",
          }}
        >
          Distributed Computing Without the Cloud
        </p>
      </div>

      {/* Loading dots */}
      <div
        style={{
          position: "absolute",
          bottom: "52px",
          display: "flex",
          gap: "6px",
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#8B5CF6",
              animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
