import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Paperclip,
  Edit3,
  Settings,
  Zap,
  CheckCircle2,
  X,
  Beaker,
} from "lucide-react";
import MainLayout from "../components/MainLayout";

const UploadArticle = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("EN");
  const [length, setLength] = useState("MEDIUM");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      navigate("/analysis");
    }, 3000);
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
                        Maximum file size: 25MB
                      </p>
                      <button className="bg-[#1111d4] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 uppercase">
                        Browse Files
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm font-display">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-slate-900 uppercase tracking-tighter">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Edit3 size={20} />
                  </div>{" "}
                  Manual Text Input
                </h3>
                <textarea
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm focus:ring-2 focus:ring-[#1111d4]/10 focus:bg-white transition-all outline-none min-h-[220px] font-light leading-relaxed"
                  placeholder="Paste article text or abstract here..."
                />
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
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <button
                      onClick={() => setLanguage("EN")}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all ${language === "EN" ? "bg-white text-[#1111d4] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      ENGLISH
                    </button>
                    <button
                      onClick={() => setLanguage("VN")}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all ${language === "VN" ? "bg-white text-[#1111d4] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
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
            <div className="size-24 border-4 border-slate-100 border-t-[#1111d4] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Beaker className="text-[#1111d4] animate-bounce" size={32} />
            </div>
          </div>
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              AI is Analysing
            </h3>
            <p className="text-slate-500 font-medium italic mt-2">
              Đợi Duy một chút, trí tuệ nhân tạo đang đọc tài liệu của bạn...
            </p>
          </div>
          <div className="mt-8 w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#1111d4] animate-progress-loading"></div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default UploadArticle;
