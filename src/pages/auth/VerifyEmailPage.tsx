import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Mail } from "lucide-react";

interface VerifyEmailPageProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

export default function VerifyEmailPage({ email, onVerified, onBack }: VerifyEmailPageProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown > 0]);

  const handleDigitChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] ?? "";
    }
    setDigits(newDigits);
    const lastFilled = Math.min(pasted.length, 5);
    inputRefs.current[lastFilled]?.focus();
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(60);
  };

  const handleVerify = () => {
    const code = digits.join("");
    if (code.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerified();
    }, 1200);
  };

  const countdownStr = countdown > 0
    ? `Resend in 00:${countdown.toString().padStart(2, "0")}`
    : null;

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
          Verify Email
        </h1>
      </div>

      {/* Content */}
      <div
        className="animate-fade-in-up"
        style={{ padding: "0 24px", paddingTop: "32px", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* Icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            background: "#F3E8FF",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mail size={32} color="#8B5CF6" />
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
          Verify your email
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
          We sent a 6-digit code to{" "}
          <strong style={{ color: "#111827" }}>{email}</strong>
        </p>

        {/* 6-digit input row */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", width: "100%" }}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              style={{
                width: "46px",
                height: "56px",
                background: "#FFFFFF",
                border: `1.5px solid ${digit ? "#8B5CF6" : "#E6EAF0"}`,
                borderRadius: "12px",
                fontSize: "20px",
                fontWeight: "700",
                color: "#111827",
                textAlign: "center",
                outline: "none",
                transition: "border-color 0.15s, box-shadow 0.15s",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#8B5CF6";
                e.target.style.boxShadow = "0 0 0 3px rgba(79,111,255,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = digit ? "#8B5CF6" : "#E6EAF0";
                e.target.style.boxShadow = "none";
              }}
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          className="btn-primary"
          onClick={handleVerify}
          disabled={digits.join("").length < 6 || loading}
          style={{
            width: "100%",
            height: "48px",
            marginTop: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
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
              Verifying…
            </>
          ) : (
            "Verify Email"
          )}
        </button>

        {/* Resend */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {countdown > 0 ? (
            <span style={{ fontSize: "14px", color: "#98A2B3" }}>{countdownStr}</span>
          ) : (
            <button
              onClick={handleResend}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                color: "#8B5CF6",
                fontWeight: "500",
                padding: 0,
              }}
            >
              Resend Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
