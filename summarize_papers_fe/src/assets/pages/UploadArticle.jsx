import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Dùng để chuyển trang
import {
  Beaker,
  UploadCloud,
  FileText,
  Settings,
  BarChart3,
  Search,
  Paperclip,
  Edit3,
  Languages,
  Zap,
  Info,
  CheckCircle2,
  ChevronDown,
  X,
  Loader2, // Icon xoay cho loading
} from "lucide-react";

import NavItem from "../components/NavItem";
import Tip from "../components/Tip";
import NotificationDropdown from "../components/NotificationDropdown";

const UploadArticle = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("EN");
  const [length, setLength] = useState("MEDIUM");
  const [isGenerating, setIsGenerating] = useState(false); // Trạng thái chờ

  // LOGIC ĐÍNH KÈM FILE
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file);
  };

  const onBrowseClick = () => fileInputRef.current.click();

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // LOGIC XỬ LÝ GENERATE
  const handleGenerate = () => {
    setIsGenerating(true);

    // Giả lập thời gian AI xử lý 3 giây trước khi chuyển trang
    setTimeout(() => {
      setIsGenerating(false);
      navigate("/analysis"); // Chuyển sang trang kết quả (Result Page)
    }, 3000);
  };

  return (
    <div className="relative flex h-screen bg-[#f6f6f8] font-display text-slate-900 overflow-hidden">
      {/* 1. Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 font-display">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#1111d4] size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
            <Beaker size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 text-lg font-bold leading-tight  tracking-tight">
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
            active
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
            label="AI Settings"
          />
        </nav>

        <div className="p-6 mt-auto border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
              Storage Usage
            </p>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
              <div
                className="bg-[#1111d4] h-1.5 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
            <p className="text-[10px] font-bold text-slate-700">
              12.4 GB / 20 GB
            </p>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-20">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1111d4] transition-colors"
                size={18}
              />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#1111d4]/20 focus:bg-white transition-all text-sm outline-none font-light"
                placeholder="Search research papers, summaries..."
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <NotificationDropdown />
            <div className="h-8 w-px bg-slate-200"></div>
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

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#f6f6f8]">
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase italic">
                Upload Article
              </h2>
              <p className="text-slate-500 mt-1 font-light text-lg italic tracking-tight">
                Synthesize complex research into actionable insights.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Upload Section */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm group hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-slate-900 uppercase tracking-tighter">
                    <div className="p-2 bg-blue-50 rounded-lg text-[#1111d4]">
                      <UploadCloud size={20} />
                    </div>
                    Document Upload
                  </h3>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.docx"
                  />
                  <div
                    onClick={onBrowseClick}
                    className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${selectedFile ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-slate-50 hover:bg-white hover:border-[#1111d4]/40"}`}
                  >
                    <div
                      className={`size-20 rounded-full flex items-center justify-center mb-6 shadow-sm transition-transform ${selectedFile ? "bg-white text-emerald-500" : "bg-white text-[#1111d4]"}`}
                    >
                      {selectedFile ? (
                        <CheckCircle2 size={32} />
                      ) : (
                        <Paperclip size={32} strokeWidth={1.5} />
                      )}
                    </div>
                    {selectedFile ? (
                      <div className="text-center">
                        <p className="text-emerald-700 font-bold text-lg uppercase tracking-tight">
                          File Ready
                        </p>
                        <p className="text-slate-500 text-sm mt-1 max-w-[250px] truncate mx-auto font-light">
                          {selectedFile.name}
                        </p>
                        <button
                          onClick={removeFile}
                          className="mt-4 flex items-center gap-1 mx-auto text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors"
                        >
                          <X size={12} /> Remove file
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-slate-900 font-bold text-lg uppercase tracking-tighter">
                          Drop your PDF or DOCX here
                        </p>
                        <p className="text-slate-400 text-sm mb-8">
                          Maximum file size: 25MB
                        </p>
                        <button className="bg-[#1111d4] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:opacity-90 transition-all cursor-pointer uppercase">
                          Browse Files
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Manual Input */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-slate-900 uppercase tracking-tighter">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                      <Edit3 size={20} />
                    </div>
                    Manual Text Input
                  </h3>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm focus:ring-2 focus:ring-[#1111d4]/10 focus:bg-white transition-all outline-none min-h-[220px] font-light leading-relaxed"
                    placeholder="Paste article text or abstract here..."
                  ></textarea>
                </div>
              </div>

              {/* Sidebar Settings */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm sticky top-8">
                  <h3 className="text-lg font-bold mb-8 text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
                    <Settings size={18} className="text-[#1111d4]" /> Summary
                    Settings
                  </h3>

                  <div className="space-y-8">
                    {/* Language Toggle */}
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                        Output Language
                      </label>
                      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <button
                          onClick={() => setLanguage("EN")}
                          className={`py-2.5 rounded-xl text-xs font-black transition-all ${language === "EN" ? "bg-white text-[#1111d4] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          ENGLISH
                        </button>
                        <button
                          onClick={() => setLanguage("VN")}
                          className={`py-2.5 rounded-xl text-xs font-black transition-all ${language === "VN" ? "bg-white text-[#1111d4] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          VIETNAMESE
                        </button>
                      </div>
                    </div>

                    {/* Length Selection */}
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                        Output Length
                      </label>
                      <div className="flex p-1.5 bg-[#f6f6f8] rounded-2xl border border-slate-100">
                        {["SHORT", "MEDIUM", "LONG"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setLength(opt)}
                            className={`flex-1 py-3 rounded-xl text-[11px] font-black transition-all ${length === opt ? "bg-white text-[#1111d4] shadow-sm" : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/30"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full bg-[#1111d4] text-white rounded-2xl py-4 flex items-center justify-center gap-3 font-black text-base shadow-xl shadow-blue-900/20 hover:-translate-y-1 active:translate-y-0 transition-all group disabled:opacity-70 disabled:cursor-not-allowed uppercase"
                    >
                      <Zap
                        size={20}
                        className="fill-current group-hover:animate-pulse"
                      />
                      Generate Summary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- LOADING OVERLAY --- */}
      {isGenerating && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative">
            {/* Vòng quay vô tận */}
            <div className="size-24 border-4 border-slate-100 border-t-[#1111d4] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Beaker className="text-[#1111d4] animate-bounce" size={32} />
            </div>
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              AI is Analysing
            </h3>
            <p className="text-slate-500 font-medium italic mt-2 flex items-center justify-center gap-2">
              Đợi Duy một chút, trí tuệ nhân tạo đang đọc tài liệu của bạn...
            </p>
          </div>
          {/* Progress bar giả */}
          <div className="mt-8 w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#1111d4] animate-progress-loading"></div>
          </div>
        </div>
      )}
    </div>
  );
};

const Checkbox = ({ label, defaultChecked = false }) => (
  <label className="flex items-center gap-3 cursor-pointer group font-display">
    <input
      type="checkbox"
      defaultChecked={defaultChecked}
      className="size-5 rounded-lg border-slate-200 text-[#1111d4] focus:ring-[#1111d4]/20"
    />
    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tighter">
      {label}
    </span>
  </label>
);

export default UploadArticle;
