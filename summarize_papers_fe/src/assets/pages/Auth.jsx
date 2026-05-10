import React, { useState, useRef } from "react";
import {
  Beaker,
  Sparkles,
  Users,
  User,
  Building2,
  Mail,
  Lock,
  ArrowRight,
  BadgeCheck,
  LogIn,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../config/api";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- FORM DATA STATE ---
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    institution: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetToken, setResetToken] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [message, setMessage] = useState({ text: "", type: "" });
  // --- LOGIC FORGOT PASSWORD ---
  const [forgotStep, setForgotStep] = useState("none");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpRefs = useRef([]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value !== "" && index < 5) otpRefs.current[index + 1].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (forgotStep === "none") {
        if (isLogin) {
          // --- API LOGIN ---
          const res = await api.login({
            email: formData.email,
            password: formData.password,
          });
          if (res.data.code === 200) {
            localStorage.setItem("accessToken", res.data.data.accessToken);
            localStorage.setItem("refreshToken", res.data.data.refreshToken);
            setMessage({ text: "Đăng nhập thành công!", type: "success" });
            setTimeout(() => navigate("/dashboard"), 1000);
          }
        } else {
          // --- API REGISTER ---
          const res = await api.register({
            email: formData.email,
            password: formData.password,
            username: formData.username,
            institution: formData.institution,
          });
          if (res.data.code === 200) {
            setMessage({ text: "Đăng ký thành công!", type: "success" });
            setIsLogin(true);
          }
        }
      } else if (forgotStep === "email") {
        // --- API SEND OTP ---
        const res = await api.sendOtp(formData.email);
        if (res.data.code === 200) {
          setMessage({ text: "Đã gửi mã OTP!", type: "success" });
          setForgotStep("otp");
        }
      } else if (forgotStep === "otp") {
        // --- API VERIFY OTP ---
        const res = await api.verifyOtp({
          email: formData.email,
          otp: otp.join(""),
        });
        if (res.data.code === 200) {
          setResetToken(res.data.data.resetToken);
          setMessage({ text: "Xác thực thành công!", type: "success" });
          setForgotStep("reset");
        }
      } else if (forgotStep === "reset") {
        // --- API RESET PASSWORD ---
        const res = await api.resetPassword({
          email: formData.email,
          resetToken: resetToken,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        });
        if (res.data.code === 200) {
          setMessage({ text: "Đổi mật khẩu thành công!", type: "success" });
          setForgotStep("none");
          setIsLogin(true);
        }
      }
    } catch (error) {
      // SỬA TẠI ĐÂY: Lấy message từ server trả về thay vì để chữ cố định
      const errorMessage =
        error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!";
      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] font-display text-slate-900 flex flex-col antialiased">
      {/* Header - GIỮ NGUYÊN */}
      <header className="flex items-center justify-between border-b border-blue-100 px-6 md:px-20 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 text-[#1111d4]">
          <div className="size-8 flex items-center justify-center bg-[#1111d4] text-white rounded-lg shadow-lg shadow-blue-900/20">
            <Beaker size={20} strokeWidth={2.5} />
          </div>
          <h2 className="text-slate-900 text-xl font-bold tracking-tight">
            SciSum AI
          </h2>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-sm text-slate-500 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setForgotStep("none");
              setMessage({ text: "", type: "" });
            }}
            className="h-10 px-6 border border-[#1111d4] text-[#1111d4] hover:bg-blue-50 transition-all rounded-lg text-sm font-bold flex items-center gap-2"
          >
            {isLogin ? (
              <>
                <User size={16} /> Register
              </>
            ) : (
              <>
                <LogIn size={16} /> Log In
              </>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="max-w-[1100px] w-full grid md:grid-cols-2 gap-16 items-center">
          {/* LEFT SIDE - GIỮ NGUYÊN */}
          <div className="hidden md:flex flex-col gap-8 pr-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-900 font-display">
                {isLogin ? (
                  <>
                    Welcome back to <br />
                    <span className="text-[#1111d4]">SciSum AI</span> journey.
                  </>
                ) : (
                  <>
                    Accelerate your <br />
                    <span className="text-[#1111d4]">Research</span> journey.
                  </>
                )}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed font-light font-display">
                {isLogin
                  ? "Log in to access your saved papers, summaries, and research insights."
                  : "Join over 50,000 academics using SciSum AI to synthesize papers and discover breakthroughs faster."}
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1111d4] shrink-0 transition-colors group-hover:bg-blue-100">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 font-display">
                    AI-Powered Summaries
                  </p>
                  <p className="text-sm text-slate-500">
                    Core insights delivered in seconds.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1111d4] shrink-0 transition-colors group-hover:bg-blue-100">
                  <Users size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 font-display">
                    Institutional Collaboration
                  </p>
                  <p className="text-sm text-slate-500">
                    Seamlessly share findings with your lab.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-6 bg-white rounded-2xl border border-blue-50 shadow-sm">
              <div className="flex -space-x-3 mb-4">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    className="h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-sm"
                    src={`https://i.pravatar.cc/150?u=${i + 20}`}
                    alt="User"
                  />
                ))}
                <div className="h-10 w-10 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                  +12k
                </div>
              </div>
              <p className="text-sm italic text-slate-600 leading-relaxed">
                "SciSum AI has fundamentally changed làm thế nào tôi tiếp cận
                quá trình review tài liệu khoa học."
              </p>
              <p className="text-xs font-bold mt-3 text-[#1111d4] uppercase tracking-wider">
                — Dr. Elena Rossi, MIT
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: FORM */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-blue-900/5 border border-blue-50 w-full transition-all duration-300">
            <div className="mb-8 relative">
              {forgotStep !== "none" && (
                <button
                  type="button"
                  onClick={() => {
                    setForgotStep("none");
                    setMessage({ text: "", type: "" });
                  }}
                  className="absolute -top-1 -left-2 p-2 text-slate-400 hover:text-[#1111d4]"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <h2
                className={`text-3xl font-bold text-slate-900 font-display ${forgotStep !== "none" ? "ml-8" : ""}`}
              >
                {forgotStep === "none"
                  ? isLogin
                    ? "Log In"
                    : "Create account"
                  : forgotStep === "email"
                    ? "Reset Password"
                    : forgotStep === "otp"
                      ? "Verify OTP"
                      : "New Password"}
              </h2>

              {/* CHỈ THAY ĐỔI LOGIC HIỂN THỊ TẠI ĐÂY */}
              <p
                className={`mt-2 font-medium transition-colors duration-300 ${forgotStep !== "none" ? "ml-8" : ""} ${
                  message.type === "error"
                    ? "text-red-500"
                    : message.type === "success"
                      ? "text-green-500"
                      : "text-slate-500"
                }`}
              >
                {message.text
                  ? message.text
                  : forgotStep === "none"
                    ? isLogin
                      ? "Enter your credentials to continue."
                      : "Start your 14-day free trial today."
                    : "Follow the steps to secure your account."}
              </p>
            </div>

            {forgotStep === "none" && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                <SocialButton icon="google" />
                <SocialButton icon="badge" />
                <SocialButton icon="linkedin" />
              </div>
            )}

            {forgotStep === "none" && (
              <div className="relative flex items-center mb-8">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                  Or continue with email
                </span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {forgotStep === "none" ? (
                <>
                  {!isLogin && (
                    <>
                      <InputGroup
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Hoàng Mạnh Duy"
                        icon={<User size={18} />}
                        type="text"
                        required
                      />
                      <InputGroup
                        label="Institution"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        placeholder="VNU University of Science"
                        icon={<Building2 size={18} />}
                        type="text"
                        required
                      />
                    </>
                  )}
                  <InputGroup
                    label="Work Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="duy.hm@vnu.edu.vn"
                    icon={<Mail size={18} />}
                    type="email"
                    required
                  />
                  <InputGroup
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={<Lock size={18} />}
                    type="password"
                    required
                  />
                  {isLogin && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotStep("email");
                          setMessage({ text: "", type: "" });
                        }}
                        className="text-xs font-bold text-[#1111d4] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </>
              ) : forgotStep === "email" ? (
                <InputGroup
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="duy.hm@vnu.edu.vn"
                  icon={<Mail size={18} />}
                  type="email"
                  required
                />
              ) : forgotStep === "otp" ? (
                <div className="flex justify-between gap-2 py-4">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      ref={(el) => (otpRefs.current[index] = el)}
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      className="size-12 border-2 border-slate-100 rounded-xl text-center font-bold focus:border-[#1111d4] outline-none transition-all"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <InputGroup
                    label="New Password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={<Lock size={18} />}
                    type="password"
                    required
                  />
                  <InputGroup
                    label="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    icon={<Lock size={18} />}
                    type="password"
                    required
                  />
                </>
              )}

              {!isLogin && forgotStep === "none" && (
                <div className="flex items-start gap-3 py-2">
                  <input
                    className="mt-1 size-4 rounded border-slate-300 text-[#1111d4] focus:ring-[#1111d4]"
                    id="terms"
                    type="checkbox"
                    required
                  />
                  <label
                    className="text-xs text-slate-500 leading-tight"
                    htmlFor="terms"
                  >
                    I agree to the{" "}
                    <a
                      className="text-[#1111d4] font-bold hover:underline"
                      href="#"
                    >
                      Terms
                    </a>{" "}
                    and{" "}
                    <a
                      className="text-[#1111d4] font-bold hover:underline"
                      href="#"
                    >
                      Privacy
                    </a>
                    .
                  </label>
                </div>
              )}

              <button
                disabled={loading}
                className="w-full bg-[#1111d4] hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {forgotStep === "none"
                      ? isLogin
                        ? "Log In"
                        : "Create Account"
                      : forgotStep === "email"
                        ? "Send OTP"
                        : forgotStep === "otp"
                          ? "Verify Code"
                          : "Update Password"}
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>

            {forgotStep === "none" && (
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">
                  {isLogin ? "New to SciSum AI?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setMessage({ text: "", type: "" });
                    }}
                    className="text-[#1111d4] font-bold hover:underline"
                  >
                    {isLogin ? "Create an account" : "Log in here"}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="px-6 md:px-20 py-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        <p>© 2026 SciSum AI Inc. All rights reserved.</p>
        <div className="flex gap-8 text-slate-400">
          <a className="hover:text-[#1111d4] transition-colors" href="#">
            Help Center
          </a>
          <a className="hover:text-[#1111d4] transition-colors" href="#">
            Institutional Pricing
          </a>
        </div>
      </footer>
    </div>
  );
};

const InputGroup = ({
  label,
  placeholder,
  icon,
  type,
  required,
  name,
  value,
  onChange,
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-bold text-slate-700 ml-1 font-display">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1111d4] transition-colors">
        {icon}
      </div>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-[#f6f6f8] text-slate-900 focus:ring-2 focus:ring-[#1111d4] focus:border-transparent transition-all outline-none text-sm font-display font-light"
        placeholder={placeholder}
        type={type}
      />
    </div>
  </div>
);

const SocialButton = ({ icon }) => (
  <button
    type="button"
    className="flex items-center justify-center py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
  >
    {icon === "google" && (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    )}
    {icon === "badge" && <BadgeCheck size={20} className="text-green-600" />}
    {icon === "linkedin" && (
      <svg className="w-5 h-5 fill-[#0077B5]" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    )}
  </button>
);

export default Auth;
