import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Timer,
  Database,
  CheckCircle2,
  UploadCloud,
  Loader2,
} from "lucide-react";
import MainLayout from "../components/MainLayout";
import StatCard from "../components/StatCard";
import TableRow from "../components/TableRow";
import VolumeChart from "../components/VolumeChart";
import TopicsChart from "../components/TopicsChart";
import {
  getDashboardSummary,
  getVolumeChartData,
  getTopicsChartData,
  getMyPapers,
} from "../config/api";

const Dashboard = () => {
  const navigate = useNavigate();

  // States quản lý dữ liệu tích hợp từ API
  const [stats, setStats] = useState(null);
  const [recentPapers, setRecentPapers] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Gọi đồng thời 4 API để tối ưu tốc độ load
        const [statsRes, volumeRes, topicsRes, papersRes] = await Promise.all([
          getDashboardSummary(),
          getVolumeChartData(),
          getTopicsChartData(),
          getMyPapers(0, 3), // Lấy 3 bài báo gần nhất cho bảng Activity
        ]);

        // Cập nhật dữ liệu vào State
        setStats(statsRes.data.data);
        setVolumeData(volumeRes.data.data);
        setTopicsData(topicsRes.data.data);
        setRecentPapers(papersRes.data.data.content);
      } catch (error) {
        console.error("Lỗi tích hợp dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <MainLayout>
      <div className="px-4 py-5 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-5 sm:space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase italic">
                Analytics Dashboard
              </h2>
              <p className="text-slate-500 mt-1 font-light text-sm sm:text-lg italic tracking-tight">
                Chào Duy, hôm nay bạn muốn tóm tắt tài liệu gì?
              </p>
            </div>
            <button
              onClick={() => navigate("/upload")}
              className="w-full sm:w-auto justify-center bg-[#1111d4] text-white text-sm font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 cursor-pointer uppercase font-display"
            >
              <UploadCloud size={18} /> New Summary
            </button>
          </div>

          {/* Stat Cards Section - Data from /analytics/summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<FileText size={20} className="text-[#1111d4]" />}
              label="Articles Processed"
              value={stats?.totalArticles?.toLocaleString() || "0"}
              trend="+12%"
            />
            <StatCard
              icon={<Timer size={20} className="text-[#1111d4]" />}
              label="Avg. Time"
              value={stats?.avgTime || "0s"}
              trend="-0.5s"
              isGreen
            />
            <StatCard
              icon={<Database size={20} className="text-[#1111d4]" />}
              label="Tokens Consumed"
              value={stats?.tokensConsumed || "0k"}
              trend="+5%"
            />
            <StatCard
              icon={<CheckCircle2 size={20} className="text-[#1111d4]" />}
              label="Accuracy Score"
              value={stats?.accuracyScore || "0%"}
              trend="+0.2%"
              isGreen
            />
          </div>

          {/* Charts Section - Data from /volume and /topics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
            <VolumeChart data={volumeData} />
            <TopicsChart data={topicsData} />
          </div>

          {/* Recent Research Activity - Data from /papers/getPaper */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8 sm:mb-12 font-display">
            <div className="px-4 sm:px-8 py-5 sm:py-6 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center bg-white">
              <h4 className="font-black text-slate-900 uppercase tracking-tight">
                Recent Research Activity
              </h4>
              <button
                onClick={() => navigate("/summaries")}
                className="text-xs font-black text-[#1111d4] hover:underline cursor-pointer uppercase tracking-widest text-left sm:text-right"
              >
                View All Articles
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[720px]">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black">
                    <th className="px-4 sm:px-8 py-4">Article Title</th>
                    <th className="px-4 sm:px-8 py-4 text-center">Status</th>
                    <th className="px-4 sm:px-8 py-4">Type</th>
                    <th className="px-4 sm:px-8 py-4">Date</th>
                    <th className="px-4 sm:px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2
                            className="animate-spin text-[#1111d4]"
                            size={24}
                          />
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Loading activity...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : recentPapers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-12 text-center text-slate-400 italic text-sm"
                      >
                        Chưa có hoạt động nào được ghi nhận.
                      </td>
                    </tr>
                  ) : (
                    recentPapers.map((paper) => (
                      <TableRow
                        key={paper.id}
                        id={paper.id}
                        title={paper.title}
                        status={
                          paper.status === "DONE" ? "Completed" : paper.status
                        }
                        category={paper.fileType || "Research"}
                        date={new Date(paper.createdAt).toLocaleDateString(
                          "vi-VN",
                        )}
                        // Duy có thể thêm prop id={paper.id} vào TableRow để click mở bài
                      />
                    ))
                  )}
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
