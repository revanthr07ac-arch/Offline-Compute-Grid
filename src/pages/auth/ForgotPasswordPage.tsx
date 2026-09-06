import { useState } from "react";
import { ChevronLeft, Mail, Lock, CheckCircle2 } from "lucide-react";

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export default function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
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
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px",
          paddingTop: "20px",
          position: "relative",
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
          Reset Password
        </h1>
      </div>

      {/* Content */}
      <div className="animate-fade-in-up" style={{ padding: "0 24px", paddingTop: "32px" }}>
        {/* Icon */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              background: "#EEF3FF",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock size={32} color="#4F6FFF" />
          </div>
        </div>

        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#111827",
            textAlign: "center",
            marginTop: "16px",
            marginBottom: "0",
          }}
        >
          Reset your password
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "#667085",
            textAlign: "center",
            marginTop: "8px",
            marginBottom: "32px",
            lineHeight: "1.5",
          }}
        >
          Enter your email address and we&apos;ll send reset instructions.
        </p>

        {/* Email input */}
        {!sent && (
          <>
            <label style={{ fontSize: "13px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "6px" }}>
              Email address
            </label>
            <div style={{ position: "relative", marginBottom: "24px" }}>
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
                onChange={(e) => setEmail(e.target.value)}
                style={{ height: "44px", paddingLeft: "40px", paddingRight: "14px" }}
              />
            </div>

            <button
              className="btn-primary"
              onClick={handleSend}
              disabled={loading || !email}
              style={{ width: "100%", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
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
                  Sending…
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </>
        )}

        {/* Success state */}
        {sent && (
          <div
            className="animate-fade-in-up"
            style={{
              background: "#ECFDF5",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: "1px" }} />
            <div>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#10B981", margin: 0 }}>Check your email</p>
              <p style={{ fontSize: "13px", color: "#059669", margin: 0, marginTop: "2px" }}>
                Instructions sent to <strong>{email}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Back to sign in */}
        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              color: "#4F6FFF",
              fontWeight: "500",
              padding: 0,
            }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
