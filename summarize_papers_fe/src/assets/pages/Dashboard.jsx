import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Timer,
  Database,
  CheckCircle2,
  UploadCloud,
} from "lucide-react";
import MainLayout from "../components/MainLayout";
import StatCard from "../components/StatCard";
import TableRow from "../components/TableRow";
import VolumeChart from "../components/VolumeChart";
import TopicsChart from "../components/TopicsChart";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase italic">
                Analytics Dashboard
              </h2>
              <p className="text-slate-500 mt-1 font-light text-lg italic tracking-tight">
                Chào Duy, hôm nay bạn muốn tóm tắt tài liệu gì?
              </p>
            </div>
            <button
              onClick={() => navigate("/upload")}
              className="bg-[#1111d4] text-white text-sm font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 cursor-pointer uppercase font-display"
            >
              <UploadCloud size={18} /> New Summary
            </button>
          </div>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <VolumeChart />
            <TopicsChart />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-12 font-display">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h4 className="font-black text-slate-900 uppercase tracking-tight">
                Recent Research Activity
              </h4>
              <button
                onClick={() => navigate("/summaries")}
                className="text-xs font-black text-[#1111d4] hover:underline cursor-pointer uppercase tracking-widest"
              >
                View All Articles
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black">
                    <th className="px-8 py-4">Article Title</th>
                    <th className="px-8 py-4 text-center">Status</th>
                    <th className="px-8 py-4">Category</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4 text-right">Actions</th>
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
    </MainLayout>
  );
};

export default Dashboard;
