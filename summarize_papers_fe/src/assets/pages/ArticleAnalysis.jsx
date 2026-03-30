import React, { useState } from "react";
import {
  ArrowLeft,
  Download,
  Copy,
  Share2,
  FileText,
  Target,
  Beaker,
  Clock,
  Type,
  Zap as ZapIcon,
  CheckCircle2,
  MessageSquare,
  Send,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ARTICLE_DATA, AI_SUMMARY } from "../data/analysisData";

// Import các thành phần dùng chung
import Sidebar from "../components/Sidebar";
import NotificationDropdown from "../components/NotificationDropdown";

const ArticleAnalysis = () => {
  const navigate = useNavigate();
  // Quản lý tab hiện tại: 'summary' hoặc 'chat'
  const [activeTab, setActiveTab] = useState("summary");
  const [userInput, setUserInput] = useState("");

  return (
    <div className="flex h-screen bg-[#f6f6f8] font-display text-slate-900 overflow-hidden">
      {/* 1. SIDEBAR NAVIGATION */}
      <Sidebar />

      {/* 2. MAIN WORKSPACE AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* --- HEADER --- */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-50 shrink-0 sticky top-0 font-display">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/upload")}
              className="flex items-center gap-2 text-slate-500 hover:text-[#1111d4] transition-colors text-sm font-bold uppercase tracking-tighter cursor-pointer"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back to Upload</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-100 mr-2 uppercase tracking-tighter">
              <CheckCircle2 size={14} /> Summary Generated
            </div>
            <HeaderAction icon={<Download size={18} />} label="Download" />
            <HeaderAction icon={<Copy size={18} />} label="Copy" />
            <button className="flex items-center gap-2 bg-[#1111d4] text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-900/20 active:scale-95 uppercase tracking-tighter mr-2 cursor-pointer">
              <Share2 size={18} /> Share
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="relative z-[100]">
              <NotificationDropdown />
            </div>
          </div>
        </header>

        {/* --- SPLIT SCREEN CONTENT --- */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT PANEL: Original Article */}
          <section className="flex-1 flex flex-col border-r border-slate-200 bg-slate-50/50 min-w-0 overflow-hidden font-display">
            <div className="p-6 border-b border-slate-100 bg-white font-display">
              <span className="px-2 py-0.5 bg-[#1111d4]/10 text-[#1111d4] text-[10px] font-black rounded uppercase tracking-widest mb-2 inline-block">
                Văn bản gốc
              </span>
              <h2 className="text-xl font-bold leading-tight mb-2 truncate font-display text-slate-900">
                {ARTICLE_DATA.title}
              </h2>
              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter font-display">
                <span className="flex items-center gap-1 font-display">
                  <Clock size={12} /> {ARTICLE_DATA.date}
                </span>
                <span className="flex items-center gap-1 underline underline-offset-2">
                  {ARTICLE_DATA.journal}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar font-display">
              <div className="max-w-2xl mx-auto space-y-8 text-slate-600 leading-relaxed text-sm md:text-base font-light font-display">
                {/* Abstract Section */}
                <div>
                  <h3 className="font-bold text-lg text-slate-900 font-display uppercase tracking-tight mb-3">
                    Abstract
                  </h3>
                  <p className="text-justify">{ARTICLE_DATA.abstract}</p>
                </div>

                {/* Highlights Box */}
                <div className="bg-[#1111d4]/5 border-l-4 border-[#1111d4] p-5 rounded-r-2xl text-slate-700 text-sm font-medium">
                  <p className="font-bold mb-2 not-italic text-[#1111d4] uppercase text-[10px] tracking-widest">
                    Điểm nổi bật:
                  </p>
                  <ul className="list-disc ml-5 space-y-2 italic">
                    {ARTICLE_DATA.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                {/* Introduction Section */}
                <div>
                  <h3 className="font-bold text-lg text-slate-900 font-display uppercase tracking-tight mb-3">
                    Introduction
                  </h3>
                  <div className="whitespace-pre-line text-justify">
                    {ARTICLE_DATA.introduction}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT PANEL: AI Analysis + Retrieval Tab */}
          <section className="flex-1 flex flex-col bg-white min-w-0 overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10 font-display border-l border-slate-100">
            {/* TAB SELECTOR HEADER */}
            <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <TabButton
                  active={activeTab === "summary"}
                  onClick={() => setActiveTab("summary")}
                  icon={<FileText size={16} />}
                  label="Tóm tắt"
                />
                <TabButton
                  active={activeTab === "chat"}
                  onClick={() => setActiveTab("chat")}
                  icon={<MessageSquare size={16} />}
                  label="Truy xuất"
                />
              </div>

              <div className="flex items-center gap-4">
                <MetricSmall
                  icon={<Clock size={12} />}
                  label="READ TIME"
                  value={AI_SUMMARY.readingTime}
                />
                <MetricSmall
                  icon={<Type size={12} />}
                  label="WORDS"
                  value={AI_SUMMARY.wordCount}
                />
              </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-hidden flex flex-col relative">
              {activeTab === "summary" ? (
                /* TAB 1: HIỂN THỊ TÓM TẮT */
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8 font-display">
                  {/* 1. BẢN TÓM TẮT */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Sparkles size={20} className="text-[#1111d4]" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                        Bản tóm tắt
                      </h3>
                    </div>
                    <div className="bg-[#1111d4]/5 border border-[#1111d4]/10 p-6 rounded-3xl text-sm text-slate-600 leading-relaxed italic shadow-sm">
                      {AI_SUMMARY.summary}
                    </div>
                  </section>

                  {/* 2. KEYWORDS */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <ZapIcon size={20} className="text-amber-500" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                        Từ khóa
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {AI_SUMMARY.keywords.map((tag, i) => (
                        <span
                          key={i}
                          className="px-4 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-full border border-slate-100 hover:border-[#1111d4]/20 transition-all"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* 3. OBJECTIVES */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Target size={20} className="text-[#1111d4]" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                        Mục tiêu
                      </h3>
                    </div>
                    <div className="rounded-3xl border border-slate-100 p-6 bg-white shadow-sm space-y-4">
                      {AI_SUMMARY.objectives.map((obj, i) => (
                        <div
                          key={i}
                          className="flex gap-4 items-start text-sm text-slate-600"
                        >
                          <span className="w-6 h-6 rounded-lg bg-[#1111d4]/10 text-[#1111d4] flex items-center justify-center shrink-0 font-black text-[10px]">
                            0{i + 1}
                          </span>
                          <p className="leading-snug">{obj}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 4. METHODOLOGY */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Beaker size={20} className="text-emerald-500" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                        Phương pháp
                      </h3>
                    </div>
                    <div className="rounded-3xl border border-slate-100 p-6 shadow-sm bg-white">
                      <div className="grid grid-cols-3 gap-3">
                        {AI_SUMMARY.metrics.map((m, i) => (
                          <div
                            key={i}
                            className="p-3 bg-slate-50 rounded-2xl text-center border border-slate-100"
                          >
                            <p className="text-[9px] text-slate-400 uppercase font-black mb-1 tracking-tighter">
                              {m.label}
                            </p>
                            <p className="text-[11px] font-bold text-[#1111d4]">
                              {m.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>
              ) : (
                /* TAB 2: TRUY XUẤT THÔNG TIN (Giao diện Chat) */
                <div className="flex-1 flex flex-col h-full bg-slate-50/30">
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {/* Welcome Message */}
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-[#1111d4] flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                        <Sparkles size={14} className="text-white" />
                      </div>
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-700 leading-relaxed">
                        Chào Tùng, mình đã đọc kỹ bài báo{" "}
                        <b>{ARTICLE_DATA.title}</b>. Bạn cần mình trích xuất
                        thông tin gì hay giải thích phần nào không?
                      </div>
                    </div>

                    {/* Example User Message */}
                    <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        DUY
                      </div>
                      <div className="bg-[#1111d4] p-4 rounded-2xl rounded-tr-none shadow-md text-sm text-white leading-relaxed">
                        Phương pháp chính được sử dụng trong nghiên cứu này là
                        gì?
                      </div>
                    </div>
                  </div>

                  {/* Input area */}
                  <div className="p-6 bg-white border-t border-slate-100">
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder="Hỏi bất cứ điều gì về bài báo..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-[#1111d4]/20 transition-all outline-none"
                      />
                      <button className="absolute right-2 p-2 bg-[#1111d4] text-white rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md">
                        <Send size={18} />
                      </button>
                    </div>
                    <p className="text-center text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-widest">
                      Powered by AI Information Retrieval System
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS (Giữ nguyên) ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-tighter transition-all cursor-pointer ${
      active
        ? "bg-white text-[#1111d4] shadow-sm"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {icon} {label}
  </button>
);

const HeaderAction = ({ icon, label }) => (
  <button className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-[#1111d4] hover:bg-slate-50 rounded-xl text-sm font-bold transition-all cursor-pointer uppercase tracking-tighter">
    {icon} <span className="hidden lg:inline">{label}</span>
  </button>
);

const MetricSmall = ({ icon, label, value }) => (
  <div className="text-right">
    <p className="text-[9px] font-black text-slate-400 tracking-widest font-display">
      {label}
    </p>
    <div className="flex items-center justify-end gap-1 text-xs font-bold text-[#1111d4] font-display">
      {icon} {value}
    </div>
  </div>
);

export default ArticleAnalysis;
