import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Mail,
  Shield,
  Lock,
  CreditCard,
  Edit3,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from "lucide-react";
import MainLayout from "../components/MainLayout";
import * as api from "../config/api";

const Profile = () => {
  const navigate = useNavigate();
  const [is2FA, setIs2FA] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // --- STATE LƯU THÔNG TIN USER ---
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    institution: "",
    researchInterests:
      "Natural Language Processing, Deep Learning, System Design.",
    avatarUrl: null,
  });

  // --- STATE CHO MODAL ĐỔI MẬT KHẨU ---
  const [pwdData, setPwdData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Tự động ẩn thông báo sau 4 giây
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 1. Lấy dữ liệu profile khi vào trang
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.getMe();
      if (res.data.code === 200) {
        setProfileData({
          ...profileData,
          username: res.data.data.username,
          email: res.data.data.email,
          institution: res.data.data.institution,
          avatarUrl: res.data.data.avatarUrl,
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin:", error);
    }
  };

  // 2. Xử lý lưu Profile
  const handleToggleEdit = async () => {
    if (isEditing) {
      setLoading(true);
      setMessage({ text: "", type: "" });
      try {
        const res = await api.updateProfile({
          username: profileData.username,
          institution: profileData.institution,
        });
        if (res.data.code === 200) {
          setMessage({
            text: "Cập nhật thông tin thành công!",
            type: "success",
          });
          setIsEditing(false);
        }
      } catch (error) {
        setMessage({
          text: error.response?.data?.message || "Cập nhật thất bại!",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  // 3. Xử lý đổi mật khẩu
  const handleUpdatePassword = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await api.changePassword(pwdData);
      if (res.data.code === 200) {
        setMessage({ text: "Đổi mật khẩu thành công!", type: "success" });
        setTimeout(() => setShowPasswordModal(false), 1500);
        setPwdData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Mật khẩu cũ không chính xác!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // 4. Xử lý Đăng xuất (Tích hợp API logout)
  const handleLogout = async () => {
    try {
      // Gọi API logout ở backend
      await api.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Luôn xóa storage và về trang auth kể cả API có lỗi hay không
      localStorage.clear();
      navigate("/auth");
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPwdData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setMessage({ text: "", type: "" });
  };

  return (
    <MainLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* HIỂN THỊ THÔNG BÁO TẠI TRANG CHÍNH */}
          {message.text && !showPasswordModal && (
            <div
              className={`flex items-center gap-3 p-4 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-red-50 text-red-600 border border-red-100"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span className="text-sm font-bold uppercase tracking-tight">
                {message.text}
              </span>
            </div>
          )}

          {/* --- PROFILE CARD --- */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm font-display">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 pb-10 border-b border-slate-100">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="size-28 rounded-full border-4 border-slate-50 overflow-hidden shadow-inner">
                    <img
                      className="size-full object-cover"
                      src={
                        profileData.avatarUrl ||
                        `https://i.pravatar.cc/150?u=${profileData.username}`
                      }
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
                    {profileData.username || "User"}
                  </h3>
                  <p className="text-slate-500 font-medium text-sm">
                    {profileData.email} • Member since Jan 2026
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

              {/* NÚT LOGOUT */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-widest"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileInput
                label="Username"
                value={profileData.username}
                onChange={(val) =>
                  setProfileData({ ...profileData, username: val })
                }
                isEditing={isEditing}
              />
              <ProfileInput
                label="Email Address"
                value={profileData.email}
                icon={<Mail size={16} />}
                isEditing={false}
              />
              <div className="md:col-span-2">
                <ProfileInput
                  label="Institution / Affiliation"
                  value={profileData.institution}
                  onChange={(val) =>
                    setProfileData({ ...profileData, institution: val })
                  }
                  isEditing={isEditing}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Research Interests
                </label>
                <textarea
                  readOnly={!isEditing}
                  value={profileData.researchInterests}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      researchInterests: e.target.value,
                    })
                  }
                  className={`w-full border rounded-2xl p-4 text-[13px] font-medium transition-all outline-none min-h-[100px] ${isEditing ? "bg-white border-[#1111d4]/20 ring-2 ring-[#1111d4]/5 focus:border-[#1111d4]" : "bg-slate-50 border-slate-100 text-slate-500"}`}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                disabled={loading}
                onClick={handleToggleEdit}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-[0.98] ${isEditing ? "bg-[#1111d4] text-white" : "bg-white border border-slate-200 text-slate-700"}`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  <>
                    <Edit3 size={14} /> Change Profile
                  </>
                )}
              </button>
            </div>
          </div>

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
                <button
                  onClick={() => {
                    setMessage({ text: "", type: "" });
                    setShowPasswordModal(true);
                  }}
                  className="w-full py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#1111d4]/30 hover:text-[#1111d4] transition-all text-[11px] font-black uppercase tracking-widest text-slate-700"
                >
                  Change Password
                </button>
              </div>
            </SettingCard>
          </div>
        </div>
      </div>

      {/* MODAL CHANGE PASSWORD */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-display">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                  Change Password
                </h3>
                <button
                  onClick={closePasswordModal}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {message.text && (
                <div
                  className={`flex items-center gap-3 p-3 mb-6 rounded-xl ${
                    message.type === "success"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-red-50 text-red-600 border border-red-100"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <span className="text-[11px] font-bold uppercase tracking-tight">
                    {message.text}
                  </span>
                </div>
              )}

              <div className="space-y-5">
                <PasswordInput
                  label="Current Password"
                  value={pwdData.oldPassword}
                  onChange={(val) =>
                    setPwdData({ ...pwdData, oldPassword: val })
                  }
                />
                <PasswordInput
                  label="New Password"
                  value={pwdData.newPassword}
                  onChange={(val) =>
                    setPwdData({ ...pwdData, newPassword: val })
                  }
                />
                <PasswordInput
                  label="Confirm New Password"
                  value={pwdData.confirmPassword}
                  onChange={(val) =>
                    setPwdData({ ...pwdData, confirmPassword: val })
                  }
                />

                <div className="mt-10 flex gap-3">
                  <button
                    onClick={closePasswordModal}
                    className="flex-1 py-4 rounded-2xl border border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loading}
                    onClick={handleUpdatePassword}
                    className="flex-1 py-4 rounded-2xl bg-[#1111d4] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "Update Now"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

// --- HELPERS ---
const ProfileInput = ({ label, value, icon, isEditing, onChange }) => (
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
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`w-full border rounded-2xl p-4 text-[13px] font-bold transition-all outline-none ${icon ? "pl-11" : ""} ${isEditing ? "bg-white border-[#1111d4]/20 ring-4 ring-[#1111d4]/5 text-slate-700" : "bg-slate-50 border-slate-100 text-slate-500 cursor-default"}`}
      />
    </div>
  </div>
);

const PasswordInput = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {label}
    </label>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="••••••••"
      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-[#1111d4]/30 focus:ring-4 focus:ring-[#1111d4]/5 transition-all"
    />
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
