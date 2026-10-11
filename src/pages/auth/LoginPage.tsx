import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, XCircle, ArrowRight, Zap } from "lucide-react";
import { useToast } from "../../components/Toast";
import GoogleOAuthModal from "./GoogleOAuthModal";

interface LoginPageProps {
  onLogin: (user?: { fullName: string; email: string; avatar: string }) => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
}

export default function LoginPage({
  onLogin,
  onForgotPassword,
  onCreateAccount,
}: LoginPageProps) {
  const { showToast } = useToast();
  const [email, setEmail] = useState("revanth.r.07.ac@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Simulate quick secure verification
      setTimeout(() => {
        const user = {
          fullName: cleanEmail.split("@")[0].toUpperCase(),
          email: cleanEmail,
          avatar: "RR",
        };
        localStorage.setItem("ocg_user", JSON.stringify(user));
        setLoading(false);
        showToast({
          type: "success",
          message: `Signed in successfully as ${user.fullName}`,
        });
        onLogin(user);
      }, 400);
    } catch {
      setLoading(false);
      setError("Authentication failed. Please try again.");
    }
  };

  const handleGoogleSuccess = (user: { fullName: string; email: string; avatar: string }) => {
    localStorage.setItem("ocg_user", JSON.stringify(user));
    showToast({
      type: "success",
      message: `Signed in with Google as ${user.fullName}`,
    });
    onLogin(user);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0B0C0E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        className="animate-fade-in-up"
        style={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "#18191E",
          border: "1px solid #282A32",
          borderRadius: 20,
          padding: 32,
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: "rgba(255, 122, 0, 0.15)",
              border: "1px solid rgba(255, 122, 0, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>
              Offline Compute Grid
            </div>
            <div style={{ fontSize: 12, color: "#8E929E" }}>
              Decentralized Cloudlet Node
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF", margin: "0 0 6px" }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 14, color: "#8E929E", margin: "0 0 24px" }}>
          Sign in to access your offline cluster
        </p>

        {/* Continue with Google button matching Image 4 */}
        <button
          type="button"
          onClick={() => setShowGoogleModal(true)}
          style={{
            width: "100%",
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: "#141519",
            border: "1px solid #282A32",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            color: "#FFFFFF",
            cursor: "pointer",
            transition: "all 0.15s ease",
            marginBottom: 20,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#FF7A00";
            e.currentTarget.style.backgroundColor = "#1A1B22";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#282A32";
            e.currentTarget.style.backgroundColor = "#141519";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.2045Z" fill="#4285F4" />
            <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853" />
            <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.5931 3.68182 9C3.68182 8.4069 3.78409 7.83 3.96409 7.29V4.9582H0.957275C0.347727 6.1731 0 7.5477 0 9C0 10.4523 0.347727 11.8269 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05" />
            <path d="M9 3.5795C10.3214 3.5795 11.5077 4.0336 12.4405 4.9254L15.0218 2.344C13.4632 0.8918 11.4259 0 9 0C5.48182 0 2.43818 2.0168 0.957275 4.9582L3.96409 7.29C4.67182 5.1627 6.65591 3.5795 9 3.5795Z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: "#24262E" }} />
          <span style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: 1, backgroundColor: "#24262E" }} />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSignIn}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#CBD5E1", display: "block", marginBottom: 6 }}>
              Email address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                color="#64748B"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gridlab.local"
                style={{ height: 42, paddingLeft: 38, paddingRight: 12 }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#CBD5E1" }}>
                Password
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                style={{
                  background: "none",
                  border: "none",
                  color: "#FF7A00",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                color="#64748B"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ height: 42, paddingLeft: 38, paddingRight: 38 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#64748B",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: "#FF7A00", width: 16, height: 16, cursor: "pointer" }}
            />
            <label htmlFor="remember" style={{ fontSize: 13, color: "#8E929E", cursor: "pointer" }}>
              Remember me on this device
            </label>
          </div>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: 8,
                padding: "8px 12px",
                marginBottom: 16,
              }}
            >
              <XCircle size={16} color="#EF4444" />
              <span style={{ fontSize: 13, color: "#EF4444" }}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {loading ? "Authenticating…" : "Sign In"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#8E929E" }}>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onCreateAccount}
            style={{
              background: "none",
              border: "none",
              color: "#FF7A00",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
            }}
          >
            Create account
          </button>
        </div>
      </div>

      <GoogleOAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSuccess={handleGoogleSuccess}
      />
    </div>
  );
}
