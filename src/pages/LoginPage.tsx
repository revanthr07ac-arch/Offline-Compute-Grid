import { useState } from "react";
import { Grid3x3, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface LoginPageProps {
  onLogin?: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps = {}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nodes = [
    { cx: 250, cy: 200, label: "Master" },
    { cx: 80, cy: 80, label: "Laptop" },
    { cx: 420, cy: 80, label: "PC" },
    { cx: 60, cy: 200, label: "RPi" },
    { cx: 440, cy: 200, label: "Android" },
    { cx: 120, cy: 340, label: "Workstation" },
    { cx: 380, cy: 340, label: "NAS" },
  ];

  const lines = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
    [1, 2], [3, 5], [4, 6], [5, 6],
  ];

  const particles = [
    { top: "15%", left: "10%", color: "#4F7CFF", delay: "0s" },
    { top: "30%", left: "25%", color: "#8B5CF6", delay: "0.4s" },
    { top: "60%", left: "8%", color: "#4F7CFF", delay: "0.8s" },
    { top: "75%", left: "35%", color: "#8B5CF6", delay: "1.2s" },
    { top: "20%", left: "75%", color: "#8B5CF6", delay: "0.2s" },
    { top: "50%", left: "80%", color: "#4F7CFF", delay: "0.6s" },
    { top: "80%", left: "65%", color: "#4F7CFF", delay: "1.0s" },
    { top: "40%", left: "55%", color: "#8B5CF6", delay: "1.4s" },
  ];

  return (
    <div
      className="relative flex flex-col lg:flex-row min-h-screen overflow-hidden"
      style={{ background: "#080B12" }}
    >
      {/* Background orbs */}
      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #4F7CFF22 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />
      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          bottom: "-80px",
          right: "-80px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #8B5CF622 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />

      {/* Left decorative half */}
      <div
        className="hidden lg:flex flex-col items-center justify-center flex-1 relative"
        style={{
          background: "linear-gradient(135deg, #080B12 0%, #0E1322 50%, #141A2D 100%)",
          zIndex: 1,
        }}
      >
        {/* Floating particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="particle-float"
            style={{
              position: "absolute",
              top: p.top,
              left: p.left,
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: p.color,
              animationDelay: p.delay,
              opacity: 0.7,
            }}
          />
        ))}

        {/* SVG Network */}
        <svg
          width="500"
          height="400"
          viewBox="0 0 500 400"
          style={{ position: "relative", zIndex: 2 }}
        >
          {/* Lines */}
          {lines.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a].cx}
              y1={nodes[a].cy}
              x2={nodes[b].cx}
              y2={nodes[b].cy}
              stroke="#4F7CFF"
              strokeWidth="1.5"
              opacity="0.4"
              strokeDasharray="400"
              className="node-line"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}

          {/* Nodes */}
          {nodes.map((node, i) => (
            <g key={i}>
              {/* Pulsing ring */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={20}
                fill="none"
                stroke="#4F7CFF44"
                strokeWidth="1"
                style={{
                  animation: `pulse-ring 2s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
              {/* Outer circle */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={16}
                fill="#4F7CFF15"
                stroke="#4F7CFF"
                strokeWidth="1.5"
              />
              {/* Inner filled circle */}
              <circle cx={node.cx} cy={node.cy} r={6} fill="#4F7CFF" />
              {/* Label */}
              <text
                x={node.cx}
                y={node.cy + 34}
                textAnchor="middle"
                fontSize="10"
                fill="#9CA3AF"
                fontFamily="system-ui, sans-serif"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Tagline */}
        <div className="text-center mt-8" style={{ position: "relative", zIndex: 2 }}>
          <h1
            className="font-bold"
            style={{ fontSize: "32px", color: "#ffffff" }}
          >
            Offline Compute Grid
          </h1>
          <p style={{ fontSize: "16px", color: "#9CA3AF", marginTop: "8px" }}>
            Distributed Computing Without the Cloud
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex gap-3 mt-6 flex-wrap justify-center" style={{ position: "relative", zIndex: 2 }}>
          {["🔒 Air-Gapped Security", "⚡ LAN Speed", "🌐 Multi-Device"].map((pill) => (
            <span
              key={pill}
              className="flex gap-2 rounded-full text-sm"
              style={{
                background: "#141A2D",
                border: "1px solid #232C46",
                color: "#9CA3AF",
                padding: "8px 16px",
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* Right half — login form */}
      <div
        className="flex items-center justify-center w-full lg:w-1/2 min-h-screen"
        style={{ background: "#080B12", position: "relative", zIndex: 1 }}
      >
        {/* Glass card */}
        <div
          style={{
            background: "rgba(20,26,45,0.8)",
            backdropFilter: "blur(32px)",
            border: "1px solid #232C46",
            borderRadius: "20px",
            padding: "40px",
            width: "min(420px, 90vw)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <Grid3x3 size={24} color="#4F7CFF" />
            <span
              className="font-bold"
              style={{ fontSize: "20px", color: "#ffffff" }}
            >
              Offline Compute Grid
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: "32px" }}>
            <h2
              className="font-bold"
              style={{ fontSize: "28px", color: "#ffffff" }}
            >
              Welcome back
            </h2>
            <p style={{ fontSize: "14px", color: "#9CA3AF", marginTop: "4px" }}>
              Sign in to your workspace
            </p>
          </div>

          {/* Email input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#9CA3AF" }}
            >
              Email
            </label>
            <div className="relative flex items-center">
              <Mail
                size={16}
                color="#9CA3AF"
                style={{ position: "absolute", left: "12px", pointerEvents: "none" }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-sm rounded-xl transition-all outline-none"
                style={{
                  background: "#0E1322",
                  border: "1px solid #232C46",
                  color: "#ffffff",
                  height: "44px",
                  paddingLeft: "40px",
                  paddingRight: "12px",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4F7CFF")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#232C46")}
              />
            </div>
          </div>

          {/* Password input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#9CA3AF" }}
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock
                size={16}
                color="#9CA3AF"
                style={{ position: "absolute", left: "12px", pointerEvents: "none" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm rounded-xl transition-all outline-none"
                style={{
                  background: "#0E1322",
                  border: "1px solid #232C46",
                  color: "#ffffff",
                  height: "44px",
                  paddingLeft: "40px",
                  paddingRight: "44px",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4F7CFF")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#232C46")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between mb-6 text-sm">
            <label className="flex items-center gap-2 cursor-pointer" style={{ color: "#9CA3AF" }}>
              <input
                type="checkbox"
                className="rounded"
                style={{ accentColor: "#4F7CFF" }}
              />
              Remember me
            </label>
            <a
              href="#"
              style={{ color: "#4F7CFF", textDecoration: "none" }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Forgot password?
            </a>
          </div>

          {/* Login button */}
          <button
            type="button"
            className="btn-ripple w-full font-semibold rounded-xl transition-opacity"
            style={{
              height: "44px",
              background: "linear-gradient(135deg, #4F7CFF, #8B5CF6)",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
            onClick={onLogin}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Sign In
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div style={{ flex: 1, height: "1px", background: "#232C46" }} />
            <span style={{ color: "#9CA3AF", fontSize: "13px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#232C46" }} />
          </div>

          {/* Google button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 rounded-xl transition-opacity"
            style={{
              height: "44px",
              background: "#141A2D",
              border: "1px solid #232C46",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {/* Google "G" icon */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4285F4, #EA4335, #FBBC05, #34A853)",
                fontSize: "11px",
                fontWeight: "bold",
                color: "#ffffff",
                flexShrink: 0,
              }}
            >
              G
            </span>
            Continue with Google
          </button>

          {/* Create account link */}
          <p className="text-center text-sm mt-5" style={{ color: "#9CA3AF" }}>
            Don&apos;t have an account?{" "}
            <a
              href="#"
              style={{ color: "#4F7CFF", textDecoration: "none" }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Create one
            </a>
          </p>

          {/* Footer */}
          <p className="text-center text-xs mt-6" style={{ color: "#9CA3AF" }}>
            Version 1.0.0 · Offline Compute Grid © 2025
          </p>
        </div>
      </div>

      {/* Inline keyframes for pulse-ring */}
      <style>{`
        @keyframes pulse-ring {
          0% { r: 18; opacity: 0.6; }
          50% { r: 24; opacity: 0.2; }
          100% { r: 18; opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
