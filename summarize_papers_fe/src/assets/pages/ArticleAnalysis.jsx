import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Download,
  Copy,
  Share2,
  FileText,
  Clock,
  Type,
  Zap as ZapIcon,
  CheckCircle2,
  MessageSquare,
  Send,
  Sparkles,
  Loader2,
  BookOpen,
  Tag,
  Plus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

// Import API functions
import {
  getPaperDetails,
  getPaperSummary,
  askQuestion,
  getChatHistory,
  getPaperConversations,
} from "../config/api";

import Sidebar from "../components/Sidebar";
import NotificationDropdown from "../components/NotificationDropdown";

const ArticleAnalysis = () => {
  const { id: paperId } = useParams();
  const navigate = useNavigate();

  const [paperMetadata, setPaperMetadata] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("summary");
  const [userInput, setUserInput] = useState("");

  const [messages, setMessages] = useState([]);
  const [isChatting, setIsChatting] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const loadFullData = async () => {
      if (!paperId || paperId === "undefined") return;
      setLoading(true);
      try {
        const [detailsRes, summaryRes] = await Promise.all([
          getPaperDetails(paperId),
          getPaperSummary(paperId),
        ]);
        setPaperMetadata(detailsRes.data.data);
        setSummaryData(summaryRes.data.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bài báo:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFullData();
  }, [paperId]);

  // --- LOGIC LẤY DANH SÁCH PHIÊN CHAT ---
  useEffect(() => {
    const fetchConversations = async () => {
      if (activeTab === "chat" && paperId) {
        try {
          const res = await getPaperConversations(paperId);
          if (res.data.code === 200) setConversations(res.data.data);
        } catch (error) {
          console.error("Lỗi lấy danh sách hội thoại:", error);
        }
      }
    };
    fetchConversations();
  }, [activeTab, paperId]);

  // --- LOGIC TẢI LỊCH SỬ KHI CHỌN PHIÊN CHAT ---
  useEffect(() => {
    const loadHistory = async () => {
      if (activeTab === "chat" && paperId && conversationId) {
        try {
          const response = await getChatHistory(conversationId);
          if (response.data.code === 200) {
            const history = response.data.data.map((msg) => {
              let parsedSources = [];
              try {
                if (msg.sourceNodes) {
                  parsedSources =
                    typeof msg.sourceNodes === "string"
                      ? JSON.parse(msg.sourceNodes)
                      : msg.sourceNodes;
                }
              } catch (e) {
                parsedSources = [];
              }
              return {
                role: msg.role,
                content: msg.content || msg.answer || "",
                sources: parsedSources,
              };
            });
            setMessages(history);
          }
        } catch (error) {
          console.error("Lỗi khi tải lịch sử chat:", error);
        }
      }
    };
    loadHistory();
  }, [activeTab, conversationId, paperId]);

  // --- HÀM TẠO CHAT MỚI ---
  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setUserInput("");
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isChatting) return;
    const currentQuestion = userInput;
    setUserInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: currentQuestion, sources: [] },
    ]);
    setIsChatting(true);

    try {
      const response = await askQuestion({
        paperId: parseInt(paperId),
        conversationId: conversationId,
        message: currentQuestion,
      });

      if (response.data.code === 200) {
        const aiData = response.data.data;
        let parsedSources = [];
        try {
          const rawSources = aiData.sources || aiData.sourceNodes;
          if (rawSources) {
            parsedSources =
              typeof rawSources === "string"
                ? JSON.parse(rawSources)
                : rawSources;
          }
        } catch (e) {
          parsedSources = [];
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              aiData.answer || aiData.content || "Không có nội dung trả về.",
            sources: parsedSources,
          },
        ]);

        // Nếu là chat mới, cập nhật lại ID và danh sách phiên chat
        if (!conversationId && aiData.conversationId) {
          setConversationId(aiData.conversationId);
          const res = await getPaperConversations(paperId);
          if (res.data.code === 200) setConversations(res.data.data);
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Lỗi kết nối AI Service.", sources: [] },
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f6f6f8] font-display text-slate-900 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-50 shrink-0 sticky top-0 font-display text-slate-900">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/upload")}
              className="flex items-center gap-2 text-slate-500 hover:text-[#1111d4] transition-colors text-sm font-bold uppercase tracking-tighter cursor-pointer"
            >
              <ArrowLeft size={18} />{" "}
              <span className="hidden sm:inline">Back to Upload</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-100 mr-2 uppercase tracking-tighter">
              <CheckCircle2 size={14} /> Analysis Ready
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

        <div className="flex-1 flex overflow-hidden">
          {/* LEFT PANEL */}
          <section className="flex-1 flex flex-col border-r border-slate-200 bg-slate-50 min-w-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-white shrink-0">
              <span className="px-2 py-0.5 bg-[#1111d4]/10 text-[#1111d4] text-[10px] font-black rounded uppercase tracking-widest inline-block">
                Văn bản gốc
              </span>
            </div>
            <div className="flex-1 bg-slate-200/50 relative">
              {paperId && (
                <iframe
                  src={`http://localhost:8085/api/papers/view/${paperId}#toolbar=0&navpanes=0`}
                  width="100%"
                  height="100%"
                  className="border-none shadow-inner"
                  title="PDF Viewer"
                />
              )}
            </div>
          </section>

          {/* RIGHT PANEL */}
          <section className="flex-1 flex flex-col bg-white min-w-0 overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10 font-display border-l border-slate-100 text-slate-900">
            <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center shrink-0">
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <TabButton
                  active={activeTab === "summary"}
                  onClick={() => setActiveTab("summary")}
                  icon={<FileText size={16} />}
                  label="Tóm tắt"
                />
                <TabButton
                  active={activeTab === "chat"}
                  onClick={() => setActiveTab("chat")}
                  icon={<MessageSquare size={16} />}
                  label="Truy xuất"
                />
              </div>
              <div className="flex items-center gap-4">
                <MetricSmall
                  icon={<Clock size={12} />}
                  label="STATUS"
                  value={summaryData?.status || "COMPLETED"}
                />
                <MetricSmall
                  icon={<Type size={12} />}
                  label="PAPER ID"
                  value={`#${paperId}`}
                />
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col relative">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-10 h-10 text-[#1111d4] animate-spin" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                    AI đang tải kết quả phân tích...
                  </p>
                </div>
              ) : activeTab === "summary" ? (
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Sparkles size={20} className="text-[#1111d4]" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Phân tích tiêu đề
                      </h3>
                    </div>
                    <h2 className="text-2xl font-bold leading-tight text-slate-900 tracking-tight">
                      {paperMetadata?.title}
                    </h2>
                  </section>

                  <section className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 bg-slate-50/80 p-6 rounded-3xl border border-slate-100">
                      <MetricItem
                        icon={<Clock size={16} />}
                        label="Năm xuất bản"
                        value={paperMetadata?.publicationYear || "N/A"}
                      />
                      <MetricItem
                        icon={<Type size={16} />}
                        label="Tác giả"
                        value={paperMetadata?.authors || "N/A"}
                      />
                      <MetricItem
                        icon={<BookOpen size={16} />}
                        label="Tạp chí / Nguồn"
                        value={paperMetadata?.journal || "N/A"}
                        color="text-[#1111d4]"
                      />
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Tag size={18} className="text-amber-500" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Từ khóa
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {paperMetadata?.keywords ? (
                        paperMetadata.keywords.split(",").map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200 transition-all hover:border-[#1111d4]/30"
                          >
                            #{tag.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-xs">
                          Không có từ khóa
                        </span>
                      )}
                    </div>
                  </section>

                  <section className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#1111d4] rounded-xl text-white">
                        <ZapIcon size={16} className="fill-current" />
                      </div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Tóm tắt chuyên sâu
                      </h3>
                    </div>
                    <div className="bg-[#1111d4]/5 border border-[#1111d4]/10 p-8 rounded-[2rem] text-sm text-slate-700 leading-relaxed shadow-sm prose prose-blue max-w-none">
                      <ReactMarkdown>
                        {summaryData?.content ||
                          "Dữ liệu tóm tắt chưa sẵn sàng."}
                      </ReactMarkdown>
                    </div>
                  </section>
                </div>
              ) : (
                /* TAB 2: TRUY XUẤT THÔNG TIN */
                <div className="flex-1 flex flex-col h-full bg-slate-50/30 text-slate-900 overflow-hidden">
                  {/* THANH CHỌN PHIÊN CHAT */}
                  <div className="px-6 py-2 border-b border-slate-100 flex items-center bg-white/80 shrink-0">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                      <button
                        onClick={handleNewChat}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#1111d4] text-white text-[10px] font-black rounded-lg uppercase tracking-tighter shrink-0 cursor-pointer"
                      >
                        <Plus size={14} /> Chat mới
                      </button>
                      {conversations.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => setConversationId(conv.id)}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all shrink-0 cursor-pointer ${
                            conversationId === conv.id
                              ? "bg-white border-[#1111d4] text-[#1111d4] shadow-sm"
                              : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                          }`}
                        >
                          Phiên{" "}
                          {new Date(conv.createdAt).toLocaleDateString("vi-VN")}{" "}
                          {new Date(conv.createdAt).toLocaleTimeString(
                            "vi-VN",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-[#1111d4] flex items-center justify-center shrink-0">
                        <Sparkles size={14} className="text-white" />
                      </div>
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-700 leading-relaxed">
                        Chào bạn, mình đã đọc xong bài báo. Bạn cần mình trích
                        xuất thông tin cụ thể nào từ văn bản gốc không?
                      </div>
                    </div>

                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 max-w-[85%] ${
                          msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            msg.role === "user"
                              ? "bg-slate-800"
                              : "bg-[#1111d4]"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <Type size={14} className="text-white" />
                          ) : (
                            <Sparkles size={14} className="text-white" />
                          )}
                        </div>
                        <div
                          className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-[#1111d4] text-white rounded-tr-none"
                              : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                          }`}
                        >
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{msg.content || ""}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isChatting && (
                      <div className="flex gap-3 animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-slate-200" />
                        <div className="bg-white h-12 w-32 rounded-2xl border border-slate-100" />
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder={
                          isChatting
                            ? "AI đang suy nghĩ..."
                            : "Hỏi bất cứ điều gì về bài báo..."
                        }
                        value={userInput}
                        disabled={isChatting}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-[#1111d4]/20 transition-all outline-none disabled:opacity-50"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isChatting}
                        className="absolute right-2 p-2 bg-[#1111d4] text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md disabled:bg-slate-300 cursor-pointer"
                      >
                        {isChatting ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const MetricItem = ({ icon, label, value, color = "text-slate-700" }) => (
  <div className="flex items-start gap-4">
    <div className="p-2 bg-white rounded-xl shadow-sm text-slate-500">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-tighter transition-all cursor-pointer ${
      active
        ? "bg-white text-[#1111d4] shadow-sm border border-slate-100"
        : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {icon} {label}
  </button>
);

const HeaderAction = ({ icon, label }) => (
  <button className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-[#1111d4] hover:bg-slate-50 rounded-xl text-sm font-bold transition-all cursor-pointer uppercase tracking-tighter">
    {icon} <span className="hidden lg:inline">{label}</span>
  </button>
);

const MetricSmall = ({ icon, label, value }) => (
  <div className="text-right">
    <p className="text-[9px] font-black text-slate-400 tracking-widest">
      {label}
    </p>
    <div className="flex items-center justify-end gap-1 text-xs font-bold text-[#1111d4]">
      {icon} {value}
    </div>
  </div>
);

export default ArticleAnalysis;
