import React from "react";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate
import {
  Beaker,
  UploadCloud,
  FileText,
  Settings,
  BarChart3,
  Search,
  Timer,
  Database,
  CheckCircle2,
} from "lucide-react";

import NavItem from "../components/NavItem";
import StatCard from "../components/StatCard";
import TableRow from "../components/TableRow";
import VolumeChart from "../components/VolumeChart";
import TopicsChart from "../components/TopicsChart";
import NotificationDropdown from "../components/NotificationDropdown";

const Dashboard = () => {
  const navigate = useNavigate(); // Khởi tạo navigate để chuyển trang

  return (
    <div className="flex h-screen bg-[#f6f6f8] font-display text-slate-900 overflow-hidden">
      {/* 1. Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#1111d4] size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
            <Beaker size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-tight font-display">
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
            active
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
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-slate-700">
                1.2 GB / 2.0 GB
              </p>
              <button className="text-[10px] font-bold text-[#1111d4] hover:underline cursor-pointer">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden font-display">
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1111d4] transition-colors"
                size={18}
              />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#1111d4]/20 focus:bg-white transition-all text-sm outline-none font-light"
                placeholder="Search research papers, summaries, or citations..."
                type="text"
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
                alt="Profile"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#f6f6f8]">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase italic">
                  Analytics Dashboard
                </h2>
                <p className="text-slate-500 mt-1 font-light text-lg italic tracking-tight">
                  Chào bạn, hôm nay bạn muốn tóm tắt tài liệu gì?
                </p>
              </div>
              <button
                onClick={() => navigate("/upload")}
                className="bg-[#1111d4] text-white text-sm font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 cursor-pointer uppercase font-display"
              >
                <UploadCloud size={18} /> New Summary
              </button>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<FileText size={20} className="text-[#1111d4]" />}
                label="Articles Processed"
                value="1,284"
                trend="+12%"
              />
              <StatCard
                icon={<Timer size={20} className="text-[#1111d4]" />}
                label="Avg. Time"
                value="4.2s"
                trend="-0.5s"
                isGreen
              />
              <StatCard
                icon={<Database size={20} className="text-[#1111d4]" />}
                label="Tokens Consumed"
                value="850.4k"
                trend="+5%"
              />
              <StatCard
                icon={<CheckCircle2 size={20} className="text-[#1111d4]" />}
                label="Accuracy Score"
                value="98.2%"
                trend="+0.2%"
                isGreen
              />
            </div>

            {/* BIỂU ĐỒ PHÂN TÍCH */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <VolumeChart />
              <TopicsChart />
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white font-display">
                <h4 className="font-black text-slate-900 uppercase tracking-tight">
                  Recent Research Activity
                </h4>
                {/* NÚT VIEW ALL ĐÃ ĐƯỢC CHỈNH SỬA */}
                <button
                  onClick={() => navigate("/summaries")}
                  className="text-xs font-black text-[#1111d4] hover:underline cursor-pointer uppercase tracking-widest"
                >
                  View All Articles
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-display">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black">
                      <th className="px-8 py-4 tracking-widest">
                        Article Title
                      </th>
                      <th className="px-8 py-4 tracking-widest text-center">
                        Status
                      </th>
                      <th className="px-8 py-4 tracking-widest">Category</th>
                      <th className="px-8 py-4 tracking-widest">Date</th>
                      <th className="px-8 py-4 text-right tracking-widest">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <TableRow
                      title="Neural Network Efficiency in VNU Cloud"
                      status="Completed"
                      category="AI / Tech"
                      date="Oct 24, 2023"
                    />
                    <TableRow
                      title="CRISPR-Cas9 Patterns in Rice Genomes"
                      status="Processing"
                      category="Genetics"
                      date="Oct 24, 2023"
                    />
                    <TableRow
                      title="Thermal Dynamics of Superconductors"
                      status="Completed"
                      category="Physics"
                      date="Oct 23, 2023"
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
