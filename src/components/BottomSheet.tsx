import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: "auto" | "half" | "full";
}

function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = "auto",
}: BottomSheetProps) {
  if (!isOpen) return null;

  const heightStyle: React.CSSProperties =
    height === "half"
      ? { height: "50vh" }
      : height === "full"
      ? { height: "90vh" }
      : { maxHeight: "80vh", overflowY: "auto" };

  return createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 50,
          animation: "fadeIn 0.2s ease",
        }}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "#FFFFFF",
          borderRadius: "20px 20px 0 0",
          paddingBottom: "env(safe-area-inset-bottom)",
          animation: "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          display: "flex",
          flexDirection: "column",
          ...heightStyle,
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 12,
            paddingBottom: 0,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              background: "#E6EAF0",
              borderRadius: 2,
            }}
          />
        </div>

        {/* Optional header */}
        {title && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 16px",
              borderBottom: "1px solid #E6EAF0",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#111827",
                lineHeight: 1.3,
              }}
            >
              {title}
            </span>
            <button
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#98A2B3",
                padding: 4,
                borderRadius: 8,
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingLeft: 16,
            paddingRight: 16,
            paddingBottom: 16,
            paddingTop: title ? 12 : 16,
          }}
        >
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}

export default BottomSheet;
