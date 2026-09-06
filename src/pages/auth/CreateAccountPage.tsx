import { useState } from "react";
import { ChevronLeft, User, Mail, Lock, Eye, EyeOff, Building2 } from "lucide-react";

interface CreateAccountPageProps {
  onBack: () => void;
  onCreated: () => void;
}

export default function CreateAccountPage({ onBack, onCreated }: CreateAccountPageProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!termsAccepted) return;
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onCreated();
    }, 1400);
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
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px",
          paddingTop: "20px",
          position: "relative",
          background: "#F7F9FC",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "8px",
            color: "#111827",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ChevronLeft size={22} />
        </button>
        <h1
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "17px",
            fontWeight: "600",
            color: "#111827",
            margin: 0,
          }}
        >
          Create Account
        </h1>
      </div>

      {/* Content */}
      <div className="animate-fade-in-up" style={{ padding: "0 24px 48px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", margin: 0, marginTop: "4px" }}>
          Join Offline Compute Grid
        </h2>
        <p style={{ fontSize: "14px", color: "#667085", marginTop: "4px", marginBottom: "24px" }}>
          Set up your workspace
        </p>

        {/* Full Name */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "13px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "6px" }}>
            Full Name
          </label>
          <div style={{ position: "relative" }}>
            <User size={16} color="#98A2B3" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type="text"
              className="input-field"
              placeholder="Alex Johnson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ height: "44px", paddingLeft: "40px", paddingRight: "14px" }}
            />
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "13px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "6px" }}>
            Email
          </label>
          <div style={{ position: "relative" }}>
            <Mail size={16} color="#98A2B3" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ height: "44px", paddingLeft: "40px", paddingRight: "14px" }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "13px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "6px" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <Lock size={16} color="#98A2B3" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type={showPassword ? "text" : "password"}
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ height: "44px", paddingLeft: "40px", paddingRight: "44px" }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#98A2B3", display: "flex", alignItems: "center" }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontSize: "13px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "6px" }}>
            Confirm Password
          </label>
          <div style={{ position: "relative" }}>
            <Lock size={16} color="#98A2B3" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type={showConfirm ? "text" : "password"}
              className="input-field"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ height: "44px", paddingLeft: "40px", paddingRight: "44px" }}
            />
            <button
              onClick={() => setShowConfirm(!showConfirm)}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#98A2B3", display: "flex", alignItems: "center" }}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Organization (optional) */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "13px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "6px" }}>
            Organization <span style={{ color: "#98A2B3", fontWeight: "400" }}>(optional)</span>
          </label>
          <div style={{ position: "relative" }}>
            <Building2 size={16} color="#98A2B3" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type="text"
              className="input-field"
              placeholder="Acme Corp"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              style={{ height: "44px", paddingLeft: "40px", paddingRight: "14px" }}
            />
          </div>
        </div>

        {/* Terms */}
        <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", marginBottom: "4px" }}>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            style={{ accentColor: "#4F6FFF", width: "15px", height: "15px", marginTop: "2px", cursor: "pointer", flexShrink: 0 }}
          />
          <span style={{ fontSize: "14px", color: "#374151", lineHeight: "1.5" }}>
            I agree to the{" "}
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#4F6FFF", fontWeight: "500", fontSize: "14px", padding: 0 }}>
              Terms of Service
            </button>
            {" "}and{" "}
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#4F6FFF", fontWeight: "500", fontSize: "14px", padding: 0 }}>
              Privacy Policy
            </button>
          </span>
        </label>

        {/* Error */}
        {error && (
          <p style={{ fontSize: "13px", color: "#EF4444", marginTop: "10px" }}>{error}</p>
        )}

        {/* Create Account button */}
        <button
          className="btn-primary"
          onClick={handleCreate}
          disabled={!termsAccepted || loading}
          style={{ width: "100%", height: "48px", marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
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
              Creating account…
            </>
          ) : (
            "Create Account"
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
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.2045Z" fill="#4285F4" />
            <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853" />
            <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.5931 3.68182 9C3.68182 8.4069 3.78409 7.83 3.96409 7.29V4.9582H0.957275C0.347727 6.1731 0 7.5477 0 9C0 10.4523 0.347727 11.8269 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05" />
            <path d="M9 3.5795C10.3214 3.5795 11.5077 4.0336 12.4405 4.9254L15.0218 2.344C13.4632 0.8918 11.4259 0 9 0C5.48182 0 2.43818 2.0168 0.957275 4.9582L3.96409 7.29C4.67182 5.1627 6.65591 3.5795 9 3.5795Z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {/* Sign in link */}
        <p style={{ textAlign: "center", fontSize: "14px", color: "#667085", marginTop: "24px" }}>
          Already have an account?{" "}
          <button
            onClick={onBack}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#4F6FFF", fontWeight: "500", fontSize: "14px", padding: 0 }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
