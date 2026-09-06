import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, XCircle } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
}

export default function LoginPage({ onLogin, onForgotPassword, onCreateAccount }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#F7F9FC",
        display: "flex",
        flexDirection: "column",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      {/* Network illustration */}
      <div
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #E6EAF0",
          position: "relative",
          height: "180px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="320" height="130" viewBox="0 0 320 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Lines from center master to workers */}
          <line x1="160" y1="60" x2="160" y2="15" stroke="#4F6FFF" strokeWidth="1" strokeOpacity="0.19" className="network-line" />
          <line x1="160" y1="60" x2="260" y2="30" stroke="#4F6FFF" strokeWidth="1" strokeOpacity="0.19" className="network-line" />
          <line x1="160" y1="60" x2="285" y2="80" stroke="#4F6FFF" strokeWidth="1" strokeOpacity="0.19" className="network-line" />
          <line x1="160" y1="60" x2="220" y2="115" stroke="#4F6FFF" strokeWidth="1" strokeOpacity="0.19" className="network-line" />
          <line x1="160" y1="60" x2="100" y2="115" stroke="#4F6FFF" strokeWidth="1" strokeOpacity="0.19" className="network-line" />
          <line x1="160" y1="60" x2="35" y2="80" stroke="#4F6FFF" strokeWidth="1" strokeOpacity="0.19" className="network-line" />
          <line x1="160" y1="60" x2="60" y2="30" stroke="#4F6FFF" strokeWidth="1" strokeOpacity="0.19" className="network-line" />

          {/* Master node */}
          <circle cx="160" cy="60" r="18" fill="#4F6FFF" />
          <text x="160" y="64" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">M</text>

          {/* Worker nodes */}
          {/* Top */}
          <circle cx="160" cy="15" r="10" fill="white" stroke="#E6EAF0" strokeWidth="1.5" />
          <text x="160" y="34" textAnchor="middle" fill="#98A2B3" fontSize="8">Laptop</text>
          {/* Online dot */}
          <circle cx="167" cy="8" r="3" fill="#10B981" />

          {/* Top-right */}
          <circle cx="260" cy="30" r="10" fill="white" stroke="#E6EAF0" strokeWidth="1.5" />
          <text x="260" y="49" textAnchor="middle" fill="#98A2B3" fontSize="8">PC</text>

          {/* Right */}
          <circle cx="285" cy="80" r="10" fill="white" stroke="#E6EAF0" strokeWidth="1.5" />
          <text x="285" y="99" textAnchor="middle" fill="#98A2B3" fontSize="8">RPi</text>
          {/* Online dot */}
          <circle cx="292" cy="73" r="3" fill="#10B981" />

          {/* Bottom-right */}
          <circle cx="220" cy="115" r="10" fill="white" stroke="#E6EAF0" strokeWidth="1.5" />
          <text x="220" y="108" textAnchor="middle" fill="#98A2B3" fontSize="8">Android</text>

          {/* Bottom-left */}
          <circle cx="100" cy="115" r="10" fill="white" stroke="#E6EAF0" strokeWidth="1.5" />
          <text x="100" y="108" textAnchor="middle" fill="#98A2B3" fontSize="8">Mac</text>

          {/* Left */}
          <circle cx="35" cy="80" r="10" fill="white" stroke="#E6EAF0" strokeWidth="1.5" />
          <text x="35" y="99" textAnchor="middle" fill="#98A2B3" fontSize="8">NAS</text>

          {/* Top-left */}
          <circle cx="60" cy="30" r="10" fill="white" stroke="#E6EAF0" strokeWidth="1.5" />
          <text x="60" y="49" textAnchor="middle" fill="#98A2B3" fontSize="8">Server</text>
        </svg>

        {/* Logo + name row */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              background: "#EEF3FF",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="2.5" fill="#4F6FFF" />
              <circle cx="6" cy="1.5" r="1" stroke="#4F6FFF" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
              <circle cx="10" cy="9" r="1" stroke="#4F6FFF" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
              <circle cx="2" cy="9" r="1" stroke="#4F6FFF" strokeWidth="0.8" strokeOpacity="0.5" fill="none" />
              <line x1="6" y1="2.5" x2="6" y2="3.5" stroke="#4F6FFF" strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="9.1" y1="8.1" x2="8.1" y2="7.3" stroke="#4F6FFF" strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="2.9" y1="8.1" x2="3.9" y2="7.3" stroke="#4F6FFF" strokeWidth="0.8" strokeOpacity="0.4" />
            </svg>
          </div>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>Offline Compute Grid</span>
        </div>

        {/* LAN Ready badge */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "16px",
            fontSize: "10px",
            color: "#10B981",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "3px",
          }}
        >
          <span style={{ fontSize: "8px" }}>●</span> LAN Ready
        </div>
      </div>

      {/* Login form */}
      <div style={{ flex: 1, padding: "24px", paddingBottom: "32px", background: "#F7F9FC" }}>
        <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#111827", margin: 0 }}>Welcome back</h1>
        <p style={{ fontSize: "14px", color: "#667085", marginTop: "4px", marginBottom: "24px" }}>
          Sign in to your compute grid
        </p>

        {/* Email */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "13px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "6px" }}>
            Email
          </label>
          <div style={{ position: "relative" }}>
            <Mail
              size={16}
              color="#98A2B3"
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            />
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              style={{ height: "44px", paddingLeft: "40px", paddingRight: "14px" }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: "0" }}>
          <label style={{ fontSize: "13px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "6px" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <Lock
              size={16}
              color="#98A2B3"
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            />
            <input
              type={showPassword ? "text" : "password"}
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              style={{ height: "44px", paddingLeft: "40px", paddingRight: "44px" }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: "#98A2B3",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember me + forgot */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: "#4F6FFF", width: "15px", height: "15px", cursor: "pointer" }}
            />
            <span style={{ fontSize: "14px", color: "#374151" }}>Remember me</span>
          </label>
          <button
            onClick={onForgotPassword}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#4F6FFF", fontWeight: "500", padding: 0 }}
          >
            Forgot password?
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px" }}>
            <XCircle size={14} color="#EF4444" />
            <span style={{ fontSize: "13px", color: "#EF4444" }}>{error}</span>
          </div>
        )}

        {/* Sign In button */}
        <button
          className="btn-primary"
          onClick={handleSignIn}
          disabled={loading}
          style={{ width: "100%", height: "48px", marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          {loading ? (
            <>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "20px", marginBottom: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "#E6EAF0" }} />
          <span style={{ fontSize: "12px", color: "#98A2B3", fontWeight: "500" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "#E6EAF0" }} />
        </div>

        {/* Google button */}
        <button
          className="btn-secondary"
          style={{ width: "100%", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
        >
          {/* Google G SVG */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.2045Z" fill="#4285F4" />
            <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853" />
            <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.5931 3.68182 9C3.68182 8.4069 3.78409 7.83 3.96409 7.29V4.9582H0.957275C0.347727 6.1731 0 7.5477 0 9C0 10.4523 0.347727 11.8269 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05" />
            <path d="M9 3.5795C10.3214 3.5795 11.5077 4.0336 12.4405 4.9254L15.0218 2.344C13.4632 0.8918 11.4259 0 9 0C5.48182 0 2.43818 2.0168 0.957275 4.9582L3.96409 7.29C4.67182 5.1627 6.65591 3.5795 9 3.5795Z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {/* Create account link */}
        <p style={{ textAlign: "center", fontSize: "14px", color: "#667085", marginTop: "24px" }}>
          {"Don't have an account? "}
          <button
            onClick={onCreateAccount}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#4F6FFF", fontWeight: "500", fontSize: "14px", padding: 0 }}
          >
            Create account
          </button>
        </p>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#98A2B3", marginTop: "24px" }}>
          Version 1.0.0
        </p>
      </div>
    </div>
  );
}
