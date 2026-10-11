import { useState } from "react";
import { ChevronLeft, User, Mail, Lock, Eye, EyeOff, Building2, CheckCircle2, Shield } from "lucide-react";

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
  const [termsAccepted, setTermsAccepted] = useState(true);
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
    if (!termsAccepted) {
      setError("Please accept the grid protocol terms.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onCreated();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md bg-[#14151B] border border-[#24262E] rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {/* Top Back Nav */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8E929E] hover:text-[#FFFFFF] mb-5 cursor-pointer"
        >
          <ChevronLeft size={16} /> Back to Sign In
        </button>

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[rgba(255,122,0,0.15)] border border-[rgba(255,122,0,0.3)] mx-auto flex items-center justify-center text-[#FF7A00] mb-3 shadow-[0_0_16px_rgba(255,122,0,0.3)]">
            <Shield size={24} />
          </div>
          <h1 className="text-xl font-bold text-white">Create Grid Account</h1>
          <p className="text-xs text-[#8E929E] mt-1">
            Register as a cluster operator to manage nodes & distribute compute tasks.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-400 font-medium">
            {error}
          </div>
        )}

        <div className="space-y-3.5">
          <div>
            <label className="text-[11px] font-semibold text-[#8E929E] block mb-1">Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E929E]" />
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Revanth R"
                className="w-full h-11 bg-[#0B0C0E] border border-[#282A32] rounded-xl pl-10 pr-3 text-xs text-white placeholder-[#667085] focus:outline-none focus:border-[#FF7A00]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#8E929E] block mb-1">Email Address</label>
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

          <div>
            <label className="text-[11px] font-semibold text-[#8E929E] block mb-1">Cluster Organization (Optional)</label>
            <div className="relative">
              <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E929E]" />
              <input
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Acharya Institute / Dev Mesh"
                className="w-full h-11 bg-[#0B0C0E] border border-[#282A32] rounded-xl pl-10 pr-3 text-xs text-white placeholder-[#667085] focus:outline-none focus:border-[#FF7A00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#8E929E] block mb-1">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E929E]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 bg-[#0B0C0E] border border-[#282A32] rounded-xl pl-10 pr-9 text-xs text-white placeholder-[#667085] focus:outline-none focus:border-[#FF7A00]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E929E] hover:text-white"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#8E929E] block mb-1">Confirm</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E929E]" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 bg-[#0B0C0E] border border-[#282A32] rounded-xl pl-10 pr-9 text-xs text-white placeholder-[#667085] focus:outline-none focus:border-[#FF7A00]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E929E] hover:text-white"
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 pt-1 text-xs text-[#8E929E] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="accent-[#FF7A00]"
            />
            I agree to the Offline Compute Grid security and peering protocols.
          </label>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white shadow-[0_2px_14px_rgba(255,122,0,0.4)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="animate-pulse">Provisioning Identity...</span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
