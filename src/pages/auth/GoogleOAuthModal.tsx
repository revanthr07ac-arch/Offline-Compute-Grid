import React, { useState } from "react";
import { UserPlus, Globe, ChevronDown, X } from "lucide-react";

export interface GoogleAccount {
  name: string;
  email: string;
  avatarBg: string;
  avatarText: string;
}

const ACCOUNTS: GoogleAccount[] = [
  {
    name: "REVANTH R AGS24BCDS209",
    email: "revanth.rr.24.bcds@acharya.ac.in",
    avatarBg: "#2563EB",
    avatarText: "RR",
  },
  {
    name: "REVANTH POOJARY",
    email: "sksak5722@gmail.com",
    avatarBg: "#059669",
    avatarText: "RP",
  },
  {
    name: "monk av",
    email: "monkav3@gmail.com",
    avatarBg: "#DC2626",
    avatarText: "MA",
  },
  {
    name: "REVANTH R",
    email: "revanth.r.07.ac@gmail.com",
    avatarBg: "#7C3AED",
    avatarText: "RR",
  },
];

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { fullName: string; email: string; avatar: string }) => void;
}

export default function GoogleOAuthModal({
  isOpen,
  onClose,
  onSuccess,
}: GoogleOAuthModalProps) {
  const [customEmail, setCustomEmail] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!isOpen) return null;

  const handleSelectAccount = (acc: GoogleAccount) => {
    onSuccess({
      fullName: acc.name,
      email: acc.email,
      avatar: "RR",
    });
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    onSuccess({
      fullName: customEmail.split("@")[0].toUpperCase(),
      email: customEmail.trim(),
      avatar: "RR",
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.82)",
        backdropFilter: "blur(6px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          backgroundColor: "#111215",
          border: "1px solid #282A32",
          borderRadius: 20,
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.7)",
          color: "#FFFFFF",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top Google Header */}
        <div
          style={{
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #1E2026",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Google G Logo */}
            <svg width="20" height="20" viewBox="0 0 18 18">
              <path d="M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.2045Z" fill="#4285F4" />
              <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853" />
              <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.5931 3.68182 9C3.68182 8.4069 3.78409 7.83 3.96409 7.29V4.9582H0.957275C0.347727 6.1731 0 7.5477 0 9C0 10.4523 0.347727 11.8269 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05" />
              <path d="M9 3.5795C10.3214 3.5795 11.5077 4.0336 12.4405 4.9254L15.0218 2.344C13.4632 0.8918 11.4259 0 9 0C5.48182 0 2.43818 2.0168 0.957275 4.9582L3.96409 7.29C4.67182 5.1627 6.65591 3.5795 9 3.5795Z" fill="#EA4335" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#E2E8F0" }}>
              Sign in with Google
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#8E929E",
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "28px 24px 20px" }}>
          {/* App Logo */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: "#18191E",
              border: "1px solid #282A32",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#FF7A00" strokeWidth="2" />
            </svg>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", color: "#FFFFFF" }}>
            Choose an account
          </h2>
          <p style={{ fontSize: 14, color: "#94A3B8", margin: "0 0 24px" }}>
            to continue to <strong style={{ color: "#FFFFFF" }}>Offline Compute Grid</strong>
          </p>

          {/* Accounts List */}
          <div
            style={{
              borderRadius: 12,
              border: "1px solid #22242C",
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            {ACCOUNTS.map((acc, index) => (
              <div
                key={acc.email}
                onClick={() => handleSelectAccount(acc)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  cursor: "pointer",
                  backgroundColor: "#15161B",
                  borderBottom:
                    index < ACCOUNTS.length - 1 || showCustomInput
                      ? "1px solid #22242C"
                      : "none",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1E2028")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#15161B")
                }
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: acc.avatarBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    flexShrink: 0,
                  }}
                >
                  {acc.avatarText}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#FFFFFF",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {acc.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#8E929E",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {acc.email}
                  </div>
                </div>
              </div>
            ))}

            {/* Use Another Account */}
            {!showCustomInput ? (
              <div
                onClick={() => setShowCustomInput(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  cursor: "pointer",
                  backgroundColor: "#15161B",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1E2028")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#15161B")
                }
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: "#20222A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8E929E",
                    flexShrink: 0,
                  }}
                >
                  <UserPlus size={16} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#CBD5E1" }}>
                  Use another account
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleCustomSubmit}
                style={{
                  padding: "14px 16px",
                  backgroundColor: "#15161B",
                  display: "flex",
                  gap: 8,
                }}
              >
                <input
                  type="email"
                  autoFocus
                  placeholder="Enter email address"
                  className="input-field"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  style={{ height: 38, fontSize: 13, padding: "0 12px" }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ height: 38, padding: "0 16px", fontSize: 13, flexShrink: 0 }}
                >
                  Continue
                </button>
              </form>
            )}
          </div>

          <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, margin: "0 0 20px" }}>
            Before using this app, you can review Offline Compute Grid's{" "}
            <span style={{ color: "#FF7A00", cursor: "pointer" }}>Privacy Policy</span> and{" "}
            <span style={{ color: "#FF7A00", cursor: "pointer" }}>Terms of Service</span>.
          </p>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "12px 24px",
            backgroundColor: "#0D0E11",
            borderTop: "1px solid #1E2026",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
            color: "#64748B",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <Globe size={13} />
            <span>English (United Kingdom)</span>
            <ChevronDown size={12} />
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ cursor: "pointer" }}>Help</span>
            <span style={{ cursor: "pointer" }}>Privacy</span>
            <span style={{ cursor: "pointer" }}>Terms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
