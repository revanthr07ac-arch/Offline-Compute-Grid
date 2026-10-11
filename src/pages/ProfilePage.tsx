import { useState } from "react";
import {
  ChevronRight,
  Copy,
  LogOut,
  Monitor,
  Smartphone,
  Globe,
  CheckCircle2,
  Edit2,
  Key,
  Shield,
  Activity,
  User,
  X,
  Check
} from "lucide-react";
import { useToast } from "../components/Toast";

interface UserProfile {
  fullName: string;
  email: string;
  avatar: string;
  role?: string;
}

interface ProfilePageProps {
  currentUser?: UserProfile;
  onLogout?: () => void;
  onUpdateUser?: (user: UserProfile) => void;
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 flex-shrink-0 ${
        on
          ? "bg-gradient-to-r from-[#FF7A00] to-[#FF5500] shadow-[0_0_10px_rgba(255,122,0,0.5)]"
          : "bg-[#282A32]"
      }`}
    >
      <div
        className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.75 transition-transform duration-200 shadow-md ${
          on ? "translate-x-5.5" : "translate-x-0.75"
        }`}
      />
    </div>
  );
}

export default function ProfilePage({
  currentUser = {
    fullName: "REVANTH R",
    email: "revanth.r.07.ac@gmail.com",
    avatar: "RR",
    role: "Cluster Administrator",
  },
  onLogout,
  onUpdateUser,
}: ProfilePageProps) {
  const { showToast } = useToast();

  const [user, setUser] = useState<UserProfile>(currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.fullName);
  const [editEmail, setEditEmail] = useState(user.email);

  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [loginNotifs, setLoginNotifs] = useState(true);

  const [apiKeys, setApiKeys] = useState([
    { id: "k1", name: "Production Grid Controller", masked: "ocg_live_88af••••••••90AB", full: "ocg_live_88af94285190AB" },
    { id: "k2", name: "Dev SDK Gateway", masked: "ocg_live_41c2••••••••E391", full: "ocg_live_41c2789124E391" },
  ]);

  const [sessions, setSessions] = useState([
    { id: "s1", device: "Desktop-A7X (Windows 11)", ip: "192.168.1.101", status: "Current Session", current: true },
    { id: "s2", device: "MacBook-Pro (macOS)", ip: "192.168.1.118", status: "Active 42m ago", current: false },
    { id: "s3", device: "Pixel 8 Pro (Android 14)", ip: "192.168.1.135", status: "Active 2d ago", current: false },
  ]);

  const handleSaveProfile = () => {
    const updated = {
      ...user,
      fullName: editName.trim() || user.fullName,
      email: editEmail.trim() || user.email,
      avatar: editName.trim().slice(0, 2).toUpperCase() || user.avatar,
    };
    setUser(updated);
    onUpdateUser?.(updated);
    localStorage.setItem("ocg_user", JSON.stringify(updated));
    setIsEditing(false);
    showToast({ type: "success", message: "Operator profile details updated." });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard?.writeText(key);
    showToast({ type: "success", message: "API key copied to clipboard." });
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    showToast({ type: "info", message: "API key permanently revoked." });
  };

  const handleNewKey = () => {
    const newK = {
      id: `k-${Date.now()}`,
      name: `Cluster Key #${apiKeys.length + 1}`,
      masked: `ocg_live_${Math.random().toString(16).substring(2, 6)}••••••••${Math.random().toString(16).substring(2, 6)}`,
      full: `ocg_live_${Math.random().toString(16).substring(2, 18)}`,
    };
    setApiKeys((prev) => [newK, ...prev]);
    showToast({ type: "success", message: "New API token provisioned." });
  };

  const handleRevokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast({ type: "info", message: "Remote session terminated." });
  };

  const handleRevokeAllSessions = () => {
    setSessions((prev) => prev.filter((s) => s.current));
    showToast({ type: "warning", message: "All background sessions logged out." });
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#FFFFFF] pb-24">
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 bg-[#111217]/95 backdrop-blur-md border-b border-[#24262E] px-4 py-3 flex items-center justify-between">
        <h1 className="text-base font-bold text-[#FFFFFF]">Operator Profile</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1.5 rounded-xl bg-[#18191E] border border-[#282A32] text-xs font-semibold text-[#FF7A00] hover:bg-[#20222A] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Edit2 size={13} /> Edit Profile
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">
        {/* User Hero Card */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF7A00] to-[#FF5500] text-black font-extrabold text-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,122,0,0.4)] flex-shrink-0">
            {user.avatar || "RR"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#FFFFFF] truncate">{user.fullName}</h2>
              <span className="px-2 py-0.5 rounded-md bg-[#FF7A00]/15 border border-[#FF7A00]/30 text-[#FF7A00] text-[10px] font-bold uppercase tracking-wider">
                Admin
              </span>
            </div>
            <p className="text-xs text-[#8E929E] truncate mt-0.5">{user.email}</p>
            <p className="text-[11px] text-emerald-400 font-mono mt-1">● Master Controller Authorization Active</p>
          </div>
        </div>

        {/* Cluster Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#14151B] border border-[#24262E] rounded-xl p-3.5 text-center">
            <span className="text-xl font-bold text-[#FFFFFF]">47</span>
            <span className="text-[11px] text-[#8E929E] block mt-0.5">Tasks Created</span>
          </div>
          <div className="bg-[#14151B] border border-[#24262E] rounded-xl p-3.5 text-center">
            <span className="text-xl font-bold text-[#FF7A00]">8</span>
            <span className="text-[11px] text-[#8E929E] block mt-0.5">Nodes Managed</span>
          </div>
          <div className="bg-[#14151B] border border-[#24262E] rounded-xl p-3.5 text-center">
            <span className="text-xl font-bold text-emerald-400">14d</span>
            <span className="text-[11px] text-[#8E929E] block mt-0.5">Grid Uptime</span>
          </div>
        </div>

        {/* API Tokens */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key size={16} className="text-[#FF7A00]" />
              <h3 className="text-sm font-bold text-white">Cluster API Tokens</h3>
            </div>
            <button
              onClick={handleNewKey}
              className="px-2.5 py-1 rounded-lg bg-[#FF7A00]/15 border border-[#FF7A00]/30 text-xs font-semibold text-[#FF7A00] hover:bg-[#FF7A00]/25 transition-colors cursor-pointer"
            >
              + New Key
            </button>
          </div>

          <div className="divide-y divide-[#20222A]">
            {apiKeys.map((k) => (
              <div key={k.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white">{k.name}</p>
                  <p className="text-[11px] font-mono text-[#8E929E] truncate">{k.masked}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyKey(k.full)}
                    className="p-1.5 rounded-lg bg-[#18191E] border border-[#282A32] text-xs text-[#FF7A00] hover:text-white"
                    title="Copy Token"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    onClick={() => handleRevokeKey(k.id)}
                    className="p-1.5 rounded-lg bg-[#18191E] border border-[#282A32] text-xs text-red-400 hover:text-red-300"
                    title="Revoke Token"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Options */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-[#FF7A00]" />
            <h3 className="text-sm font-bold text-white">Security & Guardrails</h3>
          </div>
          <div className="divide-y divide-[#20222A]">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Two-Factor Authentication (2FA)</p>
                <p className="text-[11px] text-[#8E929E]">Require TOTP authenticator prompt</p>
              </div>
              <Toggle on={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Hardware Biometric Authentication</p>
                <p className="text-[11px] text-[#8E929E]">Use WebAuthn / Windows Hello</p>
              </div>
              <Toggle on={biometric} onToggle={() => setBiometric(!biometric)} />
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Security Event Notifications</p>
                <p className="text-[11px] text-[#8E929E]">Alert on unknown subnet node logins</p>
              </div>
              <Toggle on={loginNotifs} onToggle={() => setLoginNotifs(!loginNotifs)} />
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-[#14151B] border border-[#24262E] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Active Sessions</h3>
            <button
              onClick={handleRevokeAllSessions}
              className="text-xs text-red-400 hover:underline"
            >
              Revoke All Others
            </button>
          </div>
          <div className="divide-y divide-[#20222A]">
            {sessions.map((s) => (
              <div key={s.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#18191E] border border-[#282A32] text-[#FF7A00]">
                    <Monitor size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{s.device}</p>
                    <p className="text-[11px] text-[#8E929E] font-mono">{s.ip} • {s.status}</p>
                  </div>
                </div>
                {!s.current && (
                  <button
                    onClick={() => handleRevokeSession(s.id)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            showToast({ type: "info", message: "Logging out of grid session..." });
            onLogout?.();
          }}
          className="w-full h-12 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-500/25 active:scale-98 transition-all cursor-pointer shadow-lg"
        >
          <LogOut size={16} /> Sign Out of Cluster Session
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div
          onClick={() => setIsEditing(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#14151B] border border-[#282A32] rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User size={16} className="text-[#FF7A00]" /> Edit Operator Profile
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-[#8E929E] hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-[#8E929E] block mb-1">Full Name</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-9 bg-[#0B0C0E] border border-[#282A32] rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#8E929E] block mb-1">Email Address</label>
                <input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full h-9 bg-[#0B0C0E] border border-[#282A32] rounded-xl px-3 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl border border-[#282A32] text-xs text-[#8E929E]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF5500] text-xs font-semibold text-white shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
