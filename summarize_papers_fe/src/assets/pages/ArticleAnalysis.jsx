import React from "react";
import {
  ArrowLeft,
  Download,
  Copy,
  Share2,
  FileText,
  Target,
  Beaker,
  TrendingUp,
  ShieldCheck,
  Clock,
  Type,
  UploadCloud,
  BarChart3,
  Settings,
  Zap as ZapIcon,
  Search,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ARTICLE_DATA, AI_SUMMARY } from "../data/analysisData";
import NotificationDropdown from "../components/NotificationDropdown";
import NavItem from "../components/NavItem";

const ArticleAnalysis = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#f6f6f8] font-display text-slate-900 overflow-hidden">
      {/* 1. SIDEBAR NAVIGATION */}
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
          {/* GIỮ ACTIVE Ở ĐÂY - Vì đây là kết quả của quá trình Upload */}
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
            label="Analytics Dashboard"
          />
          <NavItem
            to="/settings"
            icon={<Settings size={18} />}
            label="AI Model Settings"
          />
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              JD
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-bold text-slate-900 leading-none">
                Hoàng Mạnh Duy
              </p>
              <p className="text-[10px] text-slate-500 uppercase mt-1">
                Premium Plan
              </p>
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5 tracking-widest">
              Storage Usage
            </p>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5">
              <div
                className="bg-primary h-1.5 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
            <p className="text-[10px] font-bold text-slate-700 font-display">
              1.2 GB / 2 GB
            </p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* --- HEADER --- */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/upload")}
              className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-bold"
            >
              <ArrowLeft size={18} />{" "}
              <span className="hidden sm:inline">Back to Upload</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-100 mr-2 uppercase tracking-tighter">
              <CheckCircle2 size={14} /> Summary Generated
            </div>
            <HeaderAction icon={<Download size={18} />} label="Download" />
            <HeaderAction icon={<Copy size={18} />} label="Copy" />
            <button className="flex items-center gap-2 bg-[#1111d4] text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
              <Share2 size={18} /> Share
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <NotificationDropdown />
          </div>
        </header>

        {/* --- SPLIT SCREEN CONTENT --- */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT PANEL: Original Article */}
          <section className="flex-1 flex flex-col border-r border-slate-200 bg-slate-50/50 min-w-0 overflow-hidden font-display">
            <div className="p-6 border-b border-slate-100 bg-white font-display">
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded uppercase tracking-widest mb-2 inline-block">
                Original Article
              </span>
              <h2 className="text-xl font-bold leading-tight mb-2 truncate font-display">
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
                <div className="bg-[#1111d4]/5 border-l-4 border-[#1111d4] p-5 rounded-r-2xl italic text-slate-700 text-sm">
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
          <section className="flex-1 flex flex-col bg-white min-w-0 overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10 font-display">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-black rounded uppercase tracking-widest">
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
              {/* Objectives Section */}
              <div className="rounded-3xl border border-primary/10 p-6 bg-primary/5">
                <div className="flex items-center gap-3 mb-4">
                  <Target size={22} className="text-primary" />
                  <h3 className="text-sm font-black uppercase tracking-widest">
                    Objectives
                  </h3>
                </div>
                <ul className="space-y-4">
                  {AI_SUMMARY.objectives.map((obj, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm text-slate-600 leading-snug"
                    >
                      <span className="text-primary font-bold">0{i + 1}.</span>{" "}
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Methodology Section */}
              <div className="rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Beaker size={20} className="text-slate-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest font-display">
                    Methodology
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6 font-display">
                  {AI_SUMMARY.metrics.map((m, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 rounded-2xl text-center border border-slate-100 font-display"
                    >
                      <p className="text-[9px] text-slate-400 uppercase font-black mb-1">
                        {m.label}
                      </p>
                      <p className="text-[11px] font-bold text-primary">
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

// --- HELPER COMPONENTS ---
const HeaderAction = ({ icon, label }) => (
  <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all cursor-pointer">
    {icon} <span className="hidden lg:inline">{label}</span>
  </button>
);

const MetricSmall = ({ icon, label, value }) => (
  <div className="text-right">
    <p className="text-[9px] font-black text-slate-400 tracking-widest font-display">
      {label}
    </p>
    <div className="flex items-center justify-end gap-1 text-xs font-bold text-primary font-display">
      {icon} {value}
    </div>
  </div>
);

const ResultRow = ({ icon, title, desc, color }) => (
  <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
    <div
      className={`size-10 rounded-xl ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs font-black text-slate-900 uppercase tracking-tighter leading-none mb-1 font-display">
        {title}
      </p>
      <p className="text-[12px] text-slate-500 leading-snug font-display">
        {desc}
      </p>
    </div>
  </div>
);

export default ArticleAnalysis;
