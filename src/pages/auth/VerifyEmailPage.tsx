import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Mail, ShieldCheck } from "lucide-react";

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
  }, [countdown]);

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

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerified();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md bg-[#14151B] border border-[#24262E] rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8E929E] hover:text-[#FFFFFF] mb-5 cursor-pointer"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[rgba(255,122,0,0.15)] border border-[rgba(255,122,0,0.3)] mx-auto flex items-center justify-center text-[#FF7A00] mb-3 shadow-[0_0_16px_rgba(255,122,0,0.3)]">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-xl font-bold text-white">Security Verification</h1>
          <p className="text-xs text-[#8E929E] mt-1">
            Enter the 6-digit cluster auth code sent to <span className="text-[#FF7A00] font-mono">{email}</span>.
          </p>
        </div>

        {/* 6 Digit Input Boxes */}
        <div className="flex justify-center gap-2 mb-6">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-13 text-center text-lg font-bold font-mono bg-[#0B0C0E] border border-[#282A32] focus:border-[#FF7A00] rounded-xl text-white outline-none transition-colors"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white shadow-[0_2px_14px_rgba(255,122,0,0.4)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? "Verifying..." : "Verify & Authorize"}
        </button>

        <div className="text-center mt-4">
          <button
            onClick={() => countdown === 0 && setCountdown(60)}
            disabled={countdown > 0}
            className="text-xs text-[#8E929E] hover:text-[#FF7A00] disabled:opacity-50"
          >
            {countdown > 0 ? `Resend code in ${countdown}s` : "Resend Code"}
          </button>
        </div>
      </div>
    </div>
  );
}
