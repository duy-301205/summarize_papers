import React, { useState } from "react";
import {
  Beaker,
  UploadCloud,
  FileText,
  BarChart3,
  Settings,
  Search,
  User,
  Shield,
  CreditCard,
  Mail,
  Camera,
  Globe,
  Bell,
  CheckCircle2,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavItem from "../components/NavItem";
import NotificationDropdown from "../components/NotificationDropdown";

const Profile = () => {
  const navigate = useNavigate();
  const [is2FA, setIs2FA] = useState(true);
  const [isEmailNoti, setIsEmailNoti] = useState(true);

  return (
    <div className="flex h-screen bg-[#f6f6f8] font-display text-slate-900 overflow-hidden">
      {/* 1. SIDEBAR NAVIGATION - Đồng bộ hoàn toàn */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#1111d4] size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
            <Beaker size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 text-lg font-bold leading-tight uppercase tracking-tight">
              SciSum AI
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Research Hub
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavItem
            to="/upload"
            icon={<UploadCloud size={18} />}
            label="Upload Article"
          />
          <NavItem
            to="/summaries"
            icon={<FileText size={18} />}
            label="My Summaries"
          />
          <NavItem
            to="/dashboard"
            icon={<BarChart3 size={18} />}
            label="Analytics"
          />
          <NavItem
            to="/settings"
            icon={<Settings size={18} />}
            label="Settings Profile"
            active
          />
        </nav>

        <div className="p-6 mt-auto border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
              Storage Usage
            </p>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
              <div
                className="bg-[#1111d4] h-1.5 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
            <p className="text-[10px] font-bold text-slate-700 font-display text-center uppercase tracking-tighter">
              12.4 GB / 20 GB
            </p>
          </div>
          <button className="w-full flex items-center justify-center gap-2 text-red-500 font-bold text-sm hover:bg-red-50 py-2 rounded-xl transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* HEADER - Đồng bộ chiều cao h-20 */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10 font-display">
          <div className="flex-1 max-w-xl font-display">
            <div className="relative group font-display">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1111d4] transition-colors"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#1111d4]/20 focus:bg-white transition-all text-sm outline-none font-light"
                placeholder="Search settings, documentation..."
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <NotificationDropdown />
            <div className="h-8 w-px bg-slate-200 font-display"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">
                  Hoàng Mạnh Duy
                </p>
                <p className="text-[10px] font-bold text-[#1111d4] uppercase mt-1 tracking-tighter">
                  VNU Researcher
                </p>
              </div>
              <img
                className="size-10 rounded-full border-2 border-blue-100 shadow-sm object-cover"
                src="https://i.pravatar.cc/150?u=duy"
                alt="Avatar"
              />
            </div>
          </div>
        </header>

        {/* PROFILE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#f6f6f8] font-display">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
                User Settings
              </h2>
              <p className="text-slate-500 mt-1 font-light text-lg">
                Manage your academic profile and preferences.
              </p>
            </div>

            {/* Main Info Card */}
            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100">
                <div className="relative group">
                  <div className="size-28 rounded-full border-4 border-slate-50 overflow-hidden shadow-inner">
                    <img
                      className="size-full object-cover"
                      src="https://i.pravatar.cc/150?u=duy"
                      alt="Profile"
                    />
                  </div>
                  <button className="absolute bottom-1 right-1 p-2 bg-[#1111d4] text-white rounded-full border-4 border-white shadow-lg hover:scale-110 transition-transform cursor-pointer">
                    <Camera size={16} />
                  </button>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                    Hoàng Mạnh Duy
                  </h3>
                  <p className="text-slate-500 font-medium">
                    Researcher Pro • Member since Jan 2026
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-blue-50 text-[#1111d4] text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-widest">
                      AI Expert
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest">
                      Premium Plan
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInput label="Full Name" value="Hoàng Mạnh Duy" />
                <ProfileInput
                  label="Email Address"
                  value="m.duy@vnu.edu.vn"
                  icon={<Mail size={16} />}
                />
                <div className="md:col-span-2">
                  <ProfileInput
                    label="Institution / Affiliation"
                    value="University of Science, Vietnam National University, Hanoi"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                    Research Interests
                  </label>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[13px] font-medium focus:ring-2 focus:ring-[#1111d4]/20 transition-all outline-none min-h-[100px]"
                    defaultValue="Natural Language Processing, Deep Learning, System Design, AI Summarization."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="bg-[#1111d4] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:opacity-90 active:scale-95 transition-all cursor-pointer">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Security & Preferences Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SettingCard icon={<Shield size={20} />} title="Security">
                <div className="flex items-center justify-between py-3 border-b border-slate-50">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Password</p>
                    <p className="text-[10px] text-slate-400 uppercase">
                      Last changed 2 months ago
                    </p>
                  </div>
                  <button className="text-[10px] font-black text-[#1111d4] uppercase border border-slate-100 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all cursor-pointer">
                    Change
                  </button>
                </div>
                <ToggleRow
                  label="Two-Factor Auth"
                  checked={is2FA}
                  onChange={() => setIs2FA(!is2FA)}
                />
              </SettingCard>

              <SettingCard icon={<Globe size={20} />} title="Preferences">
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Interface Language
                    </label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#1111d4]/10">
                      <option>English (US)</option>
                      <option>Tiếng Việt (VN)</option>
                    </select>
                  </div>
                  <ToggleRow
                    label="Email Notifications"
                    checked={isEmailNoti}
                    onChange={() => setIsEmailNoti(!isEmailNoti)}
                  />
                </div>
              </SettingCard>
            </div>

            {/* Billing Banner */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm border-l-8 border-l-[#1111d4]">
              <div className="flex items-center gap-6">
                <div className="size-14 rounded-2xl bg-blue-50 text-[#1111d4] flex items-center justify-center shrink-0">
                  <CreditCard size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">
                    Researcher Pro Plan
                  </h4>
                  <p className="text-slate-500 font-medium text-sm mt-1">
                    Next billing cycle: April 12, 2026 ($19.00/month)
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-3 rounded-xl text-[#1111d4] font-black text-[11px] uppercase tracking-widest hover:bg-blue-50 transition-all cursor-pointer">
                  Manage Billing
                </button>
                <button className="px-6 py-3 rounded-xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all cursor-pointer shadow-lg shadow-slate-200">
                  View Invoices
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const ProfileInput = ({ label, value, icon }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
      {label}
    </label>
    <div className="relative group">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1111d4]">
          {icon}
        </span>
      )}
      <input
        type="text"
        defaultValue={value}
        className={`w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[13px] font-bold text-slate-700 focus:ring-2 focus:ring-[#1111d4]/20 transition-all outline-none ${icon ? "pl-11" : ""}`}
      />
    </div>
  </div>
);

const SettingCard = ({ icon, title, children }) => (
  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest mb-6">
      <span className="text-[#1111d4]">{icon}</span> {title}
    </h4>
    <div className="space-y-2">{children}</div>
  </div>
);

const ToggleRow = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <p className="text-xs font-bold text-slate-900">{label}</p>
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${checked ? "bg-[#1111d4]" : "bg-slate-200"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  </div>
);

export default Profile;
