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
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md bg-[#14151B] border border-[#24262E] rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8E929E] hover:text-[#FFFFFF] mb-5 cursor-pointer"
        >
          <ChevronLeft size={16} /> Back to Sign In
        </button>

        {!sent ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(255,122,0,0.15)] border border-[rgba(255,122,0,0.3)] mx-auto flex items-center justify-center text-[#FF7A00] mb-3 shadow-[0_0_16px_rgba(255,122,0,0.3)]">
                <Lock size={22} />
              </div>
              <h1 className="text-xl font-bold text-white">Reset Password</h1>
              <p className="text-xs text-[#8E929E] mt-1">
                Enter your operator email to receive emergency key reset instructions.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[#8E929E] block mb-1">Registered Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E929E]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="revanth.r.07.ac@gmail.com"
                    className="w-full h-11 bg-[#0B0C0E] border border-[#282A32] rounded-xl pl-10 pr-3 text-xs text-white placeholder-[#667085] focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={loading || !email}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white shadow-[0_2px_14px_rgba(255,122,0,0.4)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Generating Reset Token..." : "Send Reset Link"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-lg font-bold text-white">Reset Link Dispatched</h2>
            <p className="text-xs text-[#8E929E] leading-relaxed">
              We have transmitted password reset token instructions to <span className="text-[#FF7A00] font-mono">{email}</span>.
            </p>
            <button
              onClick={onBack}
              className="mt-2 px-6 py-2.5 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-white hover:border-[#FF7A00]"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
