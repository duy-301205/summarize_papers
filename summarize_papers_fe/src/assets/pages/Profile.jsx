import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Mail,
  Shield,
  Lock,
  CreditCard,
  LogOut,
  Edit3,
  X,
  ChevronLeft,
} from "lucide-react";
import MainLayout from "../components/MainLayout";

const Profile = () => {
  const navigate = useNavigate();
  const [is2FA, setIs2FA] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Quản lý Modal và Step
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [modalStep, setModalStep] = useState("change");

  // Quản lý mã OTP
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpRefs = useRef([]);

  const handleToggleEdit = () => {
    if (isEditing) console.log("Saving changes...");
    setIsEditing(!isEditing);
  };

  const handleLogout = () => navigate("/auth");

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setModalStep("change");
    setOtp(new Array(6).fill("")); // Reset OTP khi đóng
  };

  // Logic xử lý nhập OTP
  const handleOtpChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return false; // Chỉ cho phép nhập số

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Tự động nhảy sang ô tiếp theo
    if (value !== "" && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Nhấn Backspace để quay lại ô trước
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  return (
    <MainLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* --- PROFILE CARD --- */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm font-display">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100">
              <div className="relative group">
                <div className="size-28 rounded-full border-4 border-slate-50 overflow-hidden shadow-inner">
                  <img
                    className="size-full object-cover"
                    src="https://i.pravatar.cc/150?u=duy"
                    alt="Profile"
                  />
                </div>
                <button
                  className={`absolute bottom-1 right-1 p-2 rounded-full border-4 border-white shadow-lg transition-all ${isEditing ? "bg-[#1111d4] text-white scale-110" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                >
                  <Camera size={16} />
                </button>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                  DuyHoang
                </h3>
                <p className="text-slate-500 font-medium text-sm">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileInput
                label="Username"
                value="DuyHoang"
                isEditing={isEditing}
              />
              <ProfileInput
                label="Email Address"
                value="m.duy@vnu.edu.vn"
                icon={<Mail size={16} />}
                isEditing={isEditing}
              />
              <div className="md:col-span-2">
                <ProfileInput
                  label="Institution / Affiliation"
                  value="University of Science, VNU Hanoi"
                  isEditing={isEditing}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Research Interests
                </label>
                <textarea
                  readOnly={!isEditing}
                  className={`w-full border rounded-2xl p-4 text-[13px] font-medium transition-all outline-none min-h-[100px] ${isEditing ? "bg-white border-[#1111d4]/20 ring-2 ring-[#1111d4]/5 focus:border-[#1111d4]" : "bg-slate-50 border-slate-100 text-slate-500"}`}
                  defaultValue="Natural Language Processing, Deep Learning, System Design."
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleToggleEdit}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 ${isEditing ? "bg-[#1111d4] text-white" : "bg-white border border-slate-200 text-slate-700"}`}
              >
                {isEditing ? (
                  "Save Changes"
                ) : (
                  <>
                    <Edit3 size={14} /> Change Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* --- SETTINGS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-display">
            <SettingCard icon={<Shield size={20} />} title="Security">
              <ToggleRow
                label="Two-Factor Auth"
                checked={is2FA}
                onChange={() => setIs2FA(!is2FA)}
              />
            </SettingCard>
            <SettingCard icon={<Lock size={20} />} title="Password">
              <div className="py-2">
                <p className="text-[11px] text-slate-500 font-medium mb-4">
                  Update your account password to stay secure.
                </p>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#1111d4]/30 hover:text-[#1111d4] transition-all text-[11px] font-black uppercase tracking-widest text-slate-700"
                >
                  Change Password
                </button>
              </div>
            </SettingCard>
          </div>

          <div className="bg-white border border-slate-200 rounded-[32px] p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm border-l-8 border-l-[#1111d4] font-display">
            <div className="flex items-center gap-6">
              <div className="size-14 rounded-2xl bg-blue-50 text-[#1111d4] flex items-center justify-center shrink-0">
                <CreditCard size={28} />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 uppercase italic">
                  Researcher Pro Plan
                </h4>
                <p className="text-slate-500 font-medium text-sm">
                  Next billing cycle: April 12, 2026
                </p>
              </div>
            </div>
            <button className="px-6 py-3 rounded-xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest shadow-lg">
              Manage Billing
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-display">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  {modalStep === "otp" && (
                    <button
                      onClick={() => setModalStep("change")}
                      className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                    {modalStep === "change"
                      ? "Change Password"
                      : "Verify Email"}
                  </h3>
                </div>
                <button
                  onClick={closePasswordModal}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {modalStep === "change" ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Current Password
                      </label>
                      <button
                        onClick={() => setModalStep("otp")}
                        className="text-[10px] font-bold text-[#1111d4] hover:underline uppercase tracking-tighter cursor-pointer"
                      >
                        Forgot?
                      </button>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-[#1111d4]/30 focus:ring-4 focus:ring-[#1111d4]/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-[#1111d4]/30 focus:ring-4 focus:ring-[#1111d4]/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-[#1111d4]/30 focus:ring-4 focus:ring-[#1111d4]/5 transition-all"
                    />
                  </div>
                  <div className="mt-10 flex gap-3">
                    <button
                      onClick={closePasswordModal}
                      className="flex-1 py-4 rounded-2xl border border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button className="flex-1 py-4 rounded-2xl bg-[#1111d4] text-white font-black text-xs uppercase tracking-widest">
                      Update Now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="size-16 bg-blue-50 text-[#1111d4] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mail size={32} />
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    We've sent a 6-digit code to
                  </p>
                  <p className="text-sm font-black text-slate-900 mb-8">
                    m.duy@vnu.edu.vn
                  </p>

                  <div className="flex justify-between gap-2 mb-8">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        ref={(el) => (otpRefs.current[index] = el)}
                        value={data}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        className="size-12 bg-slate-50 border border-slate-100 rounded-xl text-center text-lg font-black text-slate-900 outline-none focus:border-[#1111d4] focus:ring-4 focus:ring-[#1111d4]/5 transition-all"
                      />
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium mb-10 italic">
                    Didn't receive the code?{" "}
                    <button className="text-[#1111d4] font-black uppercase tracking-tighter">
                      Resend
                    </button>
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setModalStep("change")}
                      className="flex-1 py-4 rounded-2xl border border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest"
                    >
                      Back
                    </button>
                    <button className="flex-1 py-4 rounded-2xl bg-[#1111d4] text-white font-black text-xs uppercase tracking-widest shadow-lg">
                      Verify Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

// --- HELPERS ---
const ProfileInput = ({ label, value, icon, isEditing }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
      {label}
    </label>
    <div className="relative group">
      {icon && (
        <span
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? "text-[#1111d4]" : "text-slate-300"}`}
        >
          {icon}
        </span>
      )}
      <input
        type="text"
        readOnly={!isEditing}
        defaultValue={value}
        className={`w-full border rounded-2xl p-4 text-[13px] font-bold transition-all outline-none ${icon ? "pl-11" : ""} ${isEditing ? "bg-white border-[#1111d4]/20 ring-4 ring-[#1111d4]/5 text-slate-700" : "bg-slate-50 border-slate-100 text-slate-500 cursor-default"}`}
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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-[#1111d4]" : "bg-slate-200"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  </div>
);

export default Profile;
