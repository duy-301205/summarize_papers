import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Calendar,
  Globe,
  Tag,
  MoreHorizontal,
  FileText,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
} from "lucide-react";
import MainLayout from "../components/MainLayout";
import { SUMMARIES_LIST } from "../data/summariesData";

const MySummaries = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <MainLayout>
      <div className="p-6">
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

          <div className="flex flex-wrap items-center gap-2">
            <FilterButton icon={<Calendar size={14} />} label="All Dates" />
            <FilterButton icon={<Globe size={14} />} label="Lang" />
            <FilterButton icon={<Tag size={14} />} label="Topic" />
            <div className="ml-auto flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-[#1111d4] transition-colors">
              Sort: Newest First <MoreHorizontal size={14} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-display">
            <table className="w-full text-left border-collapse table-fixed">
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
                        <div className="p-1.5 bg-blue-50 text-[#1111d4] rounded-lg shrink-0 group-hover:scale-105 transition-all">
                          <FileText size={16} />
                        </div>
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <p
                            onClick={() => navigate("/analysis")}
                            className="font-bold text-slate-900 text-[13px] leading-tight truncate group-hover:text-[#1111d4] transition-colors cursor-pointer"
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
                          className="p-1.5 text-slate-400 hover:text-[#1111d4] hover:bg-blue-50 rounded-lg"
                        >
                          <Eye size={14} strokeWidth={2.5} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-[#1111d4] hover:bg-blue-50 rounded-lg">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6">
            <BannerCard
              variant="primary"
              icon={<Sparkles />}
              title="Batch Summary"
              desc="Streamline research by processing multiple papers at once."
              btnText="Try Batch"
            />
            <BannerCard
              variant="secondary"
              icon={<Users />}
              title="Collaboration"
              desc="Invite members to co-analyze summaries in real-time."
              btnText="Setup Team"
            />
          </div>
        </div>
      </div>
    </MainLayout>
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
