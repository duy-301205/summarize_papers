import React, { useState } from "react";
import {
  Search,
  Calendar,
  Globe,
  Tag,
  MoreHorizontal,
  Download,
  Share2,
  Eye,
  Plus,
  Beaker,
  UploadCloud,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavItem from "../components/NavItem";
import NotificationDropdown from "../components/NotificationDropdown";
import { SUMMARIES_LIST } from "../data/summariesData";

const MySummaries = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex h-screen bg-[#f6f6f8] font-display text-slate-900 overflow-hidden">
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#1111d4] size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
            <Beaker size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-tight ">
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
            active
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

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-20 font-display">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1111d4] transition-colors"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#f6f6f8] font-display">
          <div className="max-w-6xl mx-auto space-y-5">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase italic">
                  My Summaries
                </h2>
                <p className="text-slate-500 mt-1 font-light text-lg italic tracking-tight">
                  Access your repository of academic insights.
                </p>
              </div>
              <button
                onClick={() => navigate("/upload")}
                className="bg-[#1111d4] text-white text-[11px] font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 cursor-pointer uppercase"
              >
                <Plus size={16} /> New Summary
              </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <FilterButton icon={<Calendar size={14} />} label="All Dates" />
              <FilterButton icon={<Globe size={14} />} label="Lang" />
              <FilterButton icon={<Tag size={14} />} label="Topic" />
              <div className="ml-auto flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-[#1111d4] transition-colors">
                Sort: Newest First <MoreHorizontal size={14} />
              </div>
            </div>

            {/* FIXED TABLE - Không nhảy chữ, không scroll ngang */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed font-display">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100">
                    <th className="px-6 py-4 w-[45%]">Article Title</th>
                    <th className="px-4 py-4 text-center w-[12%]">Type</th>
                    <th className="px-4 py-4 w-[15%]">Language</th>
                    <th className="px-4 py-4 text-center w-[18%]">
                      Date Created
                    </th>
                    <th className="px-6 py-4 text-right w-[10%]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-light">
                  {SUMMARIES_LIST.map((item) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-slate-50/40 transition-colors h-[70px]"
                    >
                      <td className="px-6 py-0">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-blue-50 text-[#1111d4] rounded-lg shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <FileText size={16} />
                          </div>
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <p
                              className="font-bold text-slate-900 text-[13px] leading-tight truncate group-hover:text-[#1111d4] transition-colors cursor-pointer"
                              onClick={() => navigate("/analysis")}
                            >
                              {item.title}
                            </p>
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-tight italic truncate">
                              {item.topic}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-0 text-center">
                        <TypeBadge type={item.type} />
                      </td>
                      <td className="px-4 py-0">
                        <span className="text-[12px] font-semibold text-slate-600 truncate block">
                          {item.language}
                        </span>
                      </td>
                      <td className="px-4 py-0 text-center">
                        <span className="text-[12px] font-medium text-slate-400">
                          {item.date}
                        </span>
                      </td>
                      <td className="px-6 py-0 text-right relative">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <button
                            onClick={() => navigate("/analysis")}
                            className="p-1.5 text-slate-400 hover:text-[#1111d4] hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Eye size={14} strokeWidth={2.5} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-[#1111d4] hover:bg-blue-50 rounded-lg transition-all">
                            <Download size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                        <div className="absolute inset-y-0 right-6 flex items-center justify-end group-hover:hidden text-slate-300">
                          <MoreHorizontal size={18} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-2 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Showing 5 of 124 results
                </p>
                <div className="flex items-center gap-1.5">
                  <PageNavBtn icon={<ChevronLeft size={14} />} />
                  <span className="size-7 flex items-center justify-center text-[11px] font-black text-[#1111d4] bg-white rounded-lg border border-slate-100">
                    1
                  </span>
                  <PageNavBtn icon={<ChevronRight size={14} />} />
                </div>
              </div>
            </div>

            {/* OPTIMIZED BANNER CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6">
              <BannerCard
                variant="primary"
                icon={<Sparkles />}
                title="Batch Summary"
                desc="Streamline your research by processing multiple papers at once. Perfect for literature reviews."
                btnText="Try Batch"
              />
              <BannerCard
                variant="secondary"
                icon={<Users />}
                title="Collaboration"
                desc="Invite members to view and co-analyze summaries in real-time within your team."
                btnText="Setup Team"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const FilterButton = ({ icon, label }) => (
  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:border-[#1111d4] hover:text-[#1111d4] transition-all cursor-pointer uppercase tracking-tighter">
    {icon} {label}
  </button>
);

const TypeBadge = ({ type }) => {
  const styles = {
    Detailed: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Bulleted: "bg-amber-50 text-amber-600 border-amber-100",
    Abstract: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 border rounded-lg text-[9px] font-black uppercase tracking-tighter min-w-[70px] text-center ${styles[type]}`}
    >
      {type}
    </span>
  );
};

const PageNavBtn = ({ icon }) => (
  <button className="size-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-[#1111d4] transition-all cursor-pointer">
    {icon}
  </button>
);

const BannerCard = ({ icon, title, desc, variant, btnText }) => {
  const isPrimary = variant === "primary";
  return (
    <div
      className={`p-6 rounded-[28px] border transition-all duration-500 group relative overflow-hidden flex flex-col ${
        isPrimary
          ? "bg-[#1111d4] text-white border-transparent shadow-blue-900/10"
          : "bg-white border-slate-200 text-slate-900 shadow-sm"
      } hover:shadow-xl hover:-translate-y-1`}
    >
      <div
        className={`size-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6 ${
          isPrimary ? "bg-white/10 backdrop-blur-md" : "bg-blue-50 text-primary"
        }`}
      >
        {React.cloneElement(icon, { size: 20, strokeWidth: 2 })}
      </div>
      <div className="relative z-10 flex-1">
        <h3 className="text-lg font-black mb-1 uppercase tracking-tighter italic font-display">
          {title}
        </h3>
        <p
          className={`text-[13px] leading-relaxed mb-6 font-medium ${isPrimary ? "text-blue-100" : "text-slate-500"}`}
        >
          {desc}
        </p>
      </div>
      <button
        className={`mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] transition-all ${
          isPrimary ? "text-white" : "text-primary"
        } group-hover:gap-4`}
      >
        {btnText} <ChevronRight size={14} strokeWidth={3} />
      </button>
    </div>
  );
};

export default MySummaries;
