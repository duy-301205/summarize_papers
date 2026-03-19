import React from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ARTICLE_DATA, AI_SUMMARY } from "../data/analysisData";

// Import các thành phần dùng chung
import Sidebar from "../components/Sidebar";
import NotificationDropdown from "../components/NotificationDropdown";

const ArticleAnalysis = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#f6f6f8] font-display text-slate-900 overflow-hidden">
      {/* 1. SIDEBAR NAVIGATION - Sử dụng component dùng chung */}
      <Sidebar />

      {/* 2. MAIN WORKSPACE AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* --- HEADER RIÊNG BIỆT (Giữ nguyên giao diện cũ của Duy) --- */}
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

        {/* --- SPLIT SCREEN CONTENT (Giữ nguyên 100%) --- */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT PANEL: Original Article */}
          <section className="flex-1 flex flex-col border-r border-slate-200 bg-slate-50/50 min-w-0 overflow-hidden font-display">
            <div className="p-6 border-b border-slate-100 bg-white font-display">
              <span className="px-2 py-0.5 bg-[#1111d4]/10 text-[#1111d4] text-[10px] font-black rounded uppercase tracking-widest mb-2 inline-block">
                Original Article
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
              <div className="max-w-2xl mx-auto space-y-6 text-slate-600 leading-relaxed text-sm md:text-base font-light font-display">
                <h3 className="font-bold text-lg text-slate-900 font-display uppercase tracking-tight">
                  Abstract
                </h3>
                <p>{ARTICLE_DATA.abstract}</p>
                <div className="bg-[#1111d4]/5 border-l-4 border-[#1111d4] p-5 rounded-r-2xl italic text-slate-700 text-sm font-medium">
                  "{ARTICLE_DATA.highlights[0]}"
                </div>
                <h3 className="font-bold text-lg text-slate-900 font-display uppercase tracking-tight">
                  Introduction
                </h3>
                <p>
                  Genomic data is inherently high-dimensional and complex.
                  Traditional machine learning methods often struggle to capture
                  the long-range dependencies within DNA sequences...
                </p>
              </div>
            </div>
          </section>

          {/* RIGHT PANEL: AI Summary */}
          <section className="flex-1 flex flex-col bg-white min-w-0 overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10 font-display border-l border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <span className="px-3 py-1 bg-[#1111d4] text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-sm">
                AI Analysis
              </span>
              <div className="flex items-center gap-6">
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

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8 font-display">
              <div className="rounded-3xl border border-[#1111d4]/10 p-6 bg-[#1111d4]/5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Target size={22} className="text-[#1111d4]" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Objectives
                  </h3>
                </div>
                <ul className="space-y-4">
                  {AI_SUMMARY.objectives.map((obj, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm text-slate-600 leading-snug"
                    >
                      <span className="text-[#1111d4] font-bold">
                        0{i + 1}.
                      </span>{" "}
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-100 p-6 shadow-sm bg-white">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                  <Beaker size={20} className="text-slate-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest font-display text-slate-800">
                    Methodology
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6 font-display">
                  {AI_SUMMARY.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 rounded-2xl text-center border border-slate-100 transition-all hover:border-[#1111d4]/20"
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
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS (Giữ nguyên) ---
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
