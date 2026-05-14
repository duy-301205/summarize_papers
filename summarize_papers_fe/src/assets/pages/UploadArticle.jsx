import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Paperclip,
  Settings,
  Zap,
  CheckCircle2,
  X,
  Beaker,
} from "lucide-react";
import MainLayout from "../components/MainLayout";
import * as api from "../config/api";

const UploadArticle = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("EN");
  const [length, setLength] = useState("MEDIUM");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // --- THÊM STATE ĐỂ HIỂN THỊ TIẾN ĐỘ ---
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(
    "Đợi Duy một chút, trí tuệ nhân tạo đang đọc tài liệu của bạn...",
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleGenerate = async () => {
    // 1. Kiểm tra dữ liệu đầu vào
    if (!selectedFile) {
      alert("Vui lòng upload file!");
      return;
    }

    // Bắt đầu trạng thái Loading (Giao diện cũ của chú sẽ hiển thị)
    setIsGenerating(true);
    setProgress(0);
    setStatusText("Đang khởi tạo quy trình upload...");

    try {
      // 2. Chuẩn bị FormData để gửi lên Server
      const formData = new FormData();
      if (selectedFile) formData.append("file", selectedFile);
      formData.append("language", language);
      formData.append("length", length);

      // 3. Gọi API Upload (Hàm này trả về paperId ngay lập tức sau khi lưu DB thành công)
      const res = await api.uploadPaper(formData);

      // Lấy paperId từ cấu trúc ApiResponse chuẩn
      const paperId = res.data.data.paperId;

      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:8085/api";

      // 4. Thiết lập kết nối SSE để theo dõi tiến độ thời gian thực
      // URL này khớp với Endpoint @GetMapping("/status/{paperId}") ở Backend
      const eventSource = new EventSource(
        `${API_URL}/papers/status/${paperId}`,
      );

      // Lắng nghe sự kiện "PROGRESS" từ SseService của Spring Boot
      eventSource.addEventListener("PROGRESS", (event) => {
        const data = JSON.parse(event.data);

        // Cập nhật các State để thanh loading và dòng chữ trạng thái thay đổi
        setProgress(data.progress);
        setStatusText(data.status);

        // Kiểm tra nếu quy trình hoàn tất (100%)
        if (data.progress >= 100) {
          eventSource.close(); // Đóng kết nối để giải phóng tài nguyên

          // Tạo độ trễ ngắn để người dùng kịp nhìn thấy trạng thái "Hoàn tất"
          setTimeout(() => {
            setIsGenerating(false);
            // Chuyển sang trang kết quả kèm theo paperId để trang đó gọi API summary
            navigate(`/analysis/${paperId}`);
          }, 1000);
        }

        // Kiểm tra nếu có lỗi xảy ra trong Pipeline AI (-1)
        else if (data.progress === -1) {
          eventSource.close();
          setIsGenerating(false);
          alert("Lỗi phân tích: " + data.status);
        }
      });

      // Xử lý lỗi kết nối mạng SSE
      eventSource.onerror = (err) => {
        console.error("SSE Connection Error:", err);
        eventSource.close();
        setStatusText("Mất kết nối. Đang kiểm tra trạng thái tóm tắt...");
      };
    } catch (error) {
      console.error("Upload Error:", error);
      setIsGenerating(false);
      const errorMsg = error.response?.data?.message || "Lỗi upload tài liệu!";
      alert(errorMsg);
    }
  };

  return (
    <MainLayout>
      <div className="p-8">
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
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-slate-900 uppercase tracking-tighter">
                  <div className="p-2 bg-blue-50 rounded-lg text-[#1111d4]">
                    <UploadCloud size={20} />
                  </div>{" "}
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
                  onClick={() => fileInputRef.current.click()}
                  className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${selectedFile ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-slate-50 hover:bg-white hover:border-[#1111d4]/40"}`}
                >
                  <div
                    className={`size-20 rounded-full flex items-center justify-center mb-6 shadow-sm ${selectedFile ? "bg-white text-emerald-500" : "bg-white text-[#1111d4]"}`}
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
                      <p className="text-slate-500 text-sm mt-1 truncate max-w-[250px] mx-auto">
                        {selectedFile.name}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className="mt-4 flex items-center gap-1 mx-auto text-[10px] font-black text-red-500 uppercase tracking-widest"
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
                        Maximum file size: 10MB
                      </p>
                      <button className="bg-[#1111d4] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 uppercase">
                        Browse Files
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm sticky top-8 h-fit font-display">
              <h3 className="text-lg font-bold mb-8 text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
                <Settings size={18} className="text-[#1111d4]" /> Summary
                Settings
              </h3>
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                    Output Language
                  </label>
                  <div className="p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl text-xs font-black bg-white text-[#1111d4] shadow-sm cursor-default"
                    >
                      VIETNAMESE
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                    Output Length
                  </label>
                  <div className="flex p-1.5 bg-[#f6f6f8] rounded-2xl border border-slate-100">
                    {["SHORT", "MEDIUM", "LONG"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setLength(opt)}
                        className={`flex-1 py-3 rounded-xl text-[11px] font-black transition-all ${length === opt ? "bg-white text-[#1111d4] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-[#1111d4] text-white rounded-2xl py-4 flex items-center justify-center gap-3 font-black text-base shadow-xl shadow-blue-900/20 hover:-translate-y-1 active:translate-y-0 transition-all group disabled:opacity-70 uppercase"
                >
                  <Zap
                    size={20}
                    className="fill-current group-hover:animate-pulse"
                  />{" "}
                  Generate Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isGenerating && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-300 font-display">
          <div className="relative">
            {/* Vòng xoay progress thực tế */}
            <div className="size-24 border-4 border-slate-100 border-t-[#1111d4] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Beaker className="text-[#1111d4] animate-bounce" size={32} />
            </div>
          </div>
          <div className="mt-8 text-center px-4">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              AI is Analysing
            </h3>
            <p className="text-slate-500 font-medium italic mt-2">
              {statusText}
            </p>
          </div>
          <div className="mt-8 w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            {/* Thanh loading chạy theo progress thực từ server */}
            <div
              className="h-full bg-[#1111d4] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default UploadArticle;
