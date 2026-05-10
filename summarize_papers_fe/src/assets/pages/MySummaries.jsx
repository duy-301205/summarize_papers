import React, { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import MainLayout from "../components/MainLayout";
import { getMyPapers } from "../config/api"; // Đảm bảo hàm này gọi tới /api/papers

const MySummaries = () => {
  const navigate = useNavigate();

  // States quản lý dữ liệu từ API
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Hàm fetch dữ liệu
  const fetchPapers = async (page) => {
    setLoading(true);
    try {
      // Gọi API với page và size mặc định là 10
      const res = await getMyPapers(page, 10);
      const pageData = res.data.data; // Đây là đối tượng Page từ Spring

      setPapers(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
      setCurrentPage(pageData.number);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài báo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers(currentPage);
  }, [currentPage]);

  // Hàm chuyển hướng sang trang phân tích chi tiết
  const handleViewAnalysis = (id) => {
    navigate(`/analysis/${id}`);
  };

  return (
    <MainLayout>
      <div className="p-6 font-display">
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

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black border-b border-slate-100">
                  <th className="px-6 py-4 w-[45%]">Article Title</th>
                  <th className="px-4 py-4 text-center w-[12%]">Status</th>
                  <th className="px-4 py-4 w-[15%]">Authors</th>
                  <th className="px-4 py-4 text-center w-[18%]">
                    Date Created
                  </th>
                  <th className="px-6 py-4 text-right w-[10%]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-light">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2
                          className="animate-spin text-[#1111d4]"
                          size={32}
                        />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Đang tải dữ liệu...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : papers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-20 text-center text-slate-400 italic text-sm"
                    >
                      Bạn chưa có bản tóm tắt nào.
                    </td>
                  </tr>
                ) : (
                  papers.map((item) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-slate-50/40 transition-colors h-[70px]"
                    >
                      <td className="px-6 py-0">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-blue-50 text-[#1111d4] rounded-lg shrink-0">
                            <FileText size={16} />
                          </div>
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <p
                              onClick={() => handleViewAnalysis(item.id)}
                              title={item.title}
                              className="font-bold text-slate-900 text-[13px] leading-tight truncate group-hover:text-[#1111d4] transition-colors cursor-pointer"
                            >
                              {item.title}
                            </p>
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-tight italic truncate">
                              {item.fileType} •{" "}
                              {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-0 text-center">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-0">
                        <span className="text-[12px] font-semibold text-slate-600 truncate block">
                          {item.authors || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-0 text-center">
                        <span className="text-[12px] font-medium text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </td>
                      <td className="px-6 py-0 text-right relative">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <button
                            onClick={() => handleViewAnalysis(item.id)}
                            className="p-1.5 text-slate-400 hover:text-[#1111d4] hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Eye size={14} strokeWidth={2.5} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-[#1111d4] hover:bg-blue-50 rounded-lg cursor-pointer">
                            <Download size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                        <div className="absolute inset-y-0 right-6 flex items-center justify-end group-hover:hidden text-slate-300">
                          <MoreHorizontal size={18} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Phân trang */}
            <div className="px-6 py-2 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Showing page {currentPage + 1} of {totalPages} ({totalElements}{" "}
                results)
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentPage === 0}
                  className="disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <PageNavBtn icon={<ChevronLeft size={14} />} />
                </button>
                <span className="size-7 flex items-center justify-center text-[11px] font-black text-[#1111d4] bg-white rounded-lg border border-slate-100">
                  {currentPage + 1}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage + 1 >= totalPages}
                  className="disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <PageNavBtn icon={<ChevronRight size={14} />} />
                </button>
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

const StatusBadge = ({ status }) => {
  const isDone = status === "DONE";
  return (
    <span
      className={`inline-block px-2 py-0.5 border rounded-lg text-[9px] font-black uppercase tracking-tighter min-w-[70px] text-center ${
        isDone
          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
          : "bg-amber-50 text-amber-600 border-amber-100"
      }`}
    >
      {status}
    </span>
  );
};

const PageNavBtn = ({ icon }) => (
  <div className="size-7 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-[#1111d4] transition-all cursor-pointer">
    {icon}
  </div>
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
        } group-hover:gap-4 cursor-pointer`}
      >
        {btnText} <ChevronRight size={14} strokeWidth={3} />
      </button>
    </div>
  );
};

export default MySummaries;
