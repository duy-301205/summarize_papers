import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileText,
  MessageSquare,
  Send,
  Share2,
  Sparkles,
  Type,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MainLayout from "../components/sci-sum/MainLayout";
// Import API Duy đã cấu hình
import {
  askQuestion,
  getPaperDetails,
  getPaperSummary,
} from "../constants/Api";

const Analysis = () => {
  const router = useRouter();
  const { id: paperId } = useLocalSearchParams(); // Lấy paperId từ URL

  const [activeTab, setActiveTab] = useState("summary");
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(true);

  // --- STATES DỮ LIỆU ---
  const [paperMetadata, setPaperMetadata] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);

  const chatEndRef = useRef<ScrollView>(null);

  // 1. Tải Metadata và Summary khi vào trang
  useEffect(() => {
    const loadFullData = async () => {
      if (!paperId) return;
      setLoading(true);
      try {
        const [detailsRes, summaryRes] = await Promise.all([
          getPaperDetails(paperId as string),
          getPaperSummary(paperId as string),
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

  // 2. Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    setTimeout(() => chatEndRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  // 3. Hàm gửi tin nhắn cho AI
  const handleSendMessage = async () => {
    if (!userInput.trim() || isChatting) return;

    const currentQuestion = userInput;
    setUserInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: currentQuestion },
    ]);
    setIsChatting(true);

    try {
      const response = await askQuestion({
        paperId: parseInt(paperId as string),
        conversationId: conversationId,
        message: currentQuestion,
      });

      if (response.data.code === 200) {
        const aiData = response.data.data;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: aiData.answer || aiData.content },
        ]);
        if (!conversationId && aiData.conversationId) {
          setConversationId(aiData.conversationId);
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Lỗi kết nối dịch vụ AI." },
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#1111d4" />
          <Text style={{ marginTop: 10, color: "#64748b" }}>
            Đang tải phân tích...
          </Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <View style={styles.container}>
        {/* Sub Header - Action Bar */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ArrowLeft size={20} color="#64748b" />
          </TouchableOpacity>
          <View style={styles.actionGroup}>
            <TouchableOpacity style={styles.iconAction}>
              <Download size={18} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconAction}>
              <Copy size={18} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Share2 size={16} color="#fff" />
              <Text style={styles.shareBtnText}>SHARE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Custom Tab Selector */}
        <View style={styles.tabContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScroll}
          >
            <TabItem
              active={activeTab === "original"}
              label="VĂN BẢN GỐC"
              icon={<FileText size={14} />}
              onClick={() => setActiveTab("original")}
            />
            <TabItem
              active={activeTab === "summary"}
              label="TÓM TẮT AI"
              icon={<Sparkles size={14} />}
              onClick={() => setActiveTab("summary")}
            />
            <TabItem
              active={activeTab === "chat"}
              label="HỎI ĐÁP"
              icon={<MessageSquare size={14} />}
              onClick={() => setActiveTab("chat")}
            />
          </ScrollView>
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          {activeTab === "original" && (
            <OriginalContent metadata={paperMetadata} />
          )}
          {activeTab === "summary" && (
            <SummaryContent metadata={paperMetadata} summary={summaryData} />
          )}
          {activeTab === "chat" && (
            <ChatContent
              messages={messages}
              userInput={userInput}
              setUserInput={setUserInput}
              onSend={handleSendMessage}
              isChatting={isChatting}
              chatEndRef={chatEndRef}
            />
          )}
        </View>
      </View>
    </MainLayout>
  );
};

// --- SUB-COMPONENTS TÍCH HỢP DATA ---

const OriginalContent = ({ metadata }: any) => (
  <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
    <Text style={styles.articleTitle}>{metadata?.title}</Text>
    <View style={styles.metaRow}>
      <Clock size={12} color="#94a3b8" />
      <Text style={styles.metaText}>
        {metadata?.publicationYear} • {metadata?.journal || "Original Document"}
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeader}>AUTHORS</Text>
      <Text style={styles.paragraph}>{metadata?.authors || "N/A"}</Text>
    </View>

    <View style={styles.highlightBox}>
      <Text style={styles.highlightLabel}>FILE INFO:</Text>
      <View style={styles.bulletRow}>
        <CheckCircle2 size={14} color="#1111d4" />
        <Text style={styles.bulletText}>Type: {metadata?.fileType}</Text>
      </View>
      <View style={styles.bulletRow}>
        <CheckCircle2 size={14} color="#1111d4" />
        <Text style={styles.bulletText}>
          Size: {(metadata?.fileSize / 1024 / 1024).toFixed(2)} MB
        </Text>
      </View>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeader}>STATUS</Text>
      <Text style={styles.paragraph}>
        Dữ liệu gốc đã được hệ thống SciSum AI xử lý hoàn tất.
      </Text>
    </View>
    <View style={{ height: 40 }} />
  </ScrollView>
);

const SummaryContent = ({ metadata, summary }: any) => (
  <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
    <View style={styles.metricRow}>
      <MetricSmall
        label="YEAR"
        value={metadata?.publicationYear}
        icon={<Clock size={12} color="#1111d4" />}
      />
      <MetricSmall
        label="ID"
        value={`#${metadata?.id}`}
        icon={<Type size={12} color="#1111d4" />}
      />
    </View>

    <View style={styles.aiBox}>
      <View style={styles.aiHeader}>
        <Sparkles size={18} color="#1111d4" />
        <Text style={styles.aiHeaderText}>BẢN TÓM TẮT AI</Text>
      </View>
      <Text style={styles.aiBody}>
        {summary?.content || "Đang tạo tóm tắt..."}
      </Text>
    </View>

    <View style={styles.tagWrapper}>
      <Text style={styles.sectionHeader}>TỪ KHÓA</Text>
      <View style={styles.tagContainer}>
        {metadata?.keywords?.split(",").map((k: string, i: number) => (
          <View key={i} style={styles.tag}>
            <Text style={styles.tagText}>#{k.trim()}</Text>
          </View>
        )) || (
          <Text style={{ color: "#94a3b8", fontStyle: "italic" }}>
            Không có từ khóa
          </Text>
        )}
      </View>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeader}>THÔNG TIN NGUỒN</Text>
      <View style={styles.objRow}>
        <Text style={styles.objNum}>01</Text>
        <Text style={styles.objText}>{metadata?.journal || "N/A"}</Text>
      </View>
      <View style={styles.objRow}>
        <Text style={styles.objNum}>02</Text>
        <Text style={styles.objText}>{metadata?.authors || "N/A"}</Text>
      </View>
    </View>

    <View style={{ height: 40 }} />
  </ScrollView>
);

const ChatContent = ({
  messages,
  userInput,
  setUserInput,
  onSend,
  isChatting,
  chatEndRef,
}: any) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
    keyboardVerticalOffset={100}
  >
    <ScrollView style={styles.chatBody} ref={chatEndRef}>
      <View style={styles.aiMsg}>
        <View style={styles.aiAvatar}>
          <Sparkles size={14} color="#fff" />
        </View>
        <View style={styles.aiBubble}>
          <Text style={styles.aiMsgText}>
            Chào Duy, mình đã sẵn sàng giải đáp về bài báo này!
          </Text>
        </View>
      </View>

      {messages.map((msg: any, index: number) => (
        <View
          key={index}
          style={msg.role === "user" ? styles.userMsg : styles.aiMsg}
        >
          {msg.role !== "user" && (
            <View style={styles.aiAvatar}>
              <Sparkles size={14} color="#fff" />
            </View>
          )}
          <View
            style={[
              styles.aiBubble,
              msg.role === "user" ? styles.userBubble : {},
            ]}
          >
            <Text
              style={[
                styles.aiMsgText,
                msg.role === "user" ? styles.userMsgText : {},
              ]}
            >
              {msg.content}
            </Text>
          </View>
        </View>
      ))}

      {isChatting && (
        <View style={styles.aiMsg}>
          <ActivityIndicator size="small" color="#1111d4" />
        </View>
      )}
    </ScrollView>

    <View style={styles.chatInputRow}>
      <TextInput
        style={styles.chatInput}
        placeholder="Hỏi bất cứ điều gì..."
        value={userInput}
        onChangeText={setUserInput}
        editable={!isChatting}
      />
      <TouchableOpacity
        style={[styles.sendBtn, isChatting && { opacity: 0.5 }]}
        onPress={onSend}
        disabled={isChatting}
      >
        <Send size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
);

// --- HELPERS ---

const TabItem = ({ active, label, icon, onClick }: any) => (
  <TouchableOpacity
    onPress={onClick}
    style={[styles.tabItem, active && styles.tabActive]}
  >
    {React.cloneElement(icon, { color: active ? "#1111d4" : "#94a3b8" })}
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const MetricSmall = ({ label, value, icon }: any) => (
  <View style={styles.metricSmall}>
    <Text style={styles.msLabel}>{label}</Text>
    <View style={styles.msValueRow}>
      {icon}
      <Text style={styles.msValue}>{value}</Text>
    </View>
  </View>
);

// --- STYLES (GIỮ NGUYÊN) ---

const styles = StyleSheet.create({
  container: { flex: 1 },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backBtn: { padding: 8 },
  actionGroup: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconAction: { padding: 8, backgroundColor: "#f8fafc", borderRadius: 10 },
  shareBtn: {
    backgroundColor: "#1111d4",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  shareBtnText: { color: "#fff", fontSize: 10, fontWeight: "900" },

  tabContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tabScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
    backgroundColor: "#f1f5f9",
  },
  tabActive: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  tabLabel: { fontSize: 10, fontWeight: "900", color: "#94a3b8" },
  tabLabelActive: { color: "#1111d4" },

  content: { flex: 1, backgroundColor: "#f6f6f8" },
  scrollBody: { flex: 1, padding: 20 },
  articleTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    fontStyle: "italic",
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    marginBottom: 25,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
  },

  section: { marginBottom: 30 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1111d4",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
    textAlign: "justify",
  },

  highlightBox: {
    backgroundColor: "#eff6ff",
    padding: 20,
    borderRadius: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#1111d4",
    marginBottom: 30,
  },
  highlightLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#1111d4",
    marginBottom: 10,
  },
  bulletRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  bulletText: { flex: 1, fontSize: 13, color: "#1e293b", fontStyle: "italic" },

  metricRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginBottom: 20,
  },
  metricSmall: { alignItems: "flex-end" },
  msLabel: { fontSize: 8, fontWeight: "900", color: "#94a3b8" },
  msValueRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  msValue: { fontSize: 12, fontWeight: "900", color: "#1111d4" },

  aiBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#dbeafe",
    shadowColor: "#1111d4",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    marginBottom: 25,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  aiHeaderText: { fontSize: 12, fontWeight: "900", color: "#1e293b" },
  aiBody: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    fontStyle: "italic",
  },

  tagWrapper: { marginBottom: 25 },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tagText: { fontSize: 11, fontWeight: "700", color: "#64748b" },

  objRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
    alignItems: "flex-start",
  },
  objNum: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
    color: "#1111d4",
    textAlign: "center",
    lineHeight: 24,
    fontSize: 10,
    fontWeight: "900",
  },
  objText: { flex: 1, fontSize: 14, color: "#475569" },

  chatBody: { flex: 1, padding: 20 },
  aiMsg: { flexDirection: "row", gap: 10, marginBottom: 20 },
  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1111d4",
    justifyContent: "center",
    alignItems: "center",
  },
  aiBubble: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    flex: 1,
  },
  aiMsgText: { fontSize: 14, color: "#334155", lineHeight: 20 },
  userMsg: { flexDirection: "row-reverse", marginBottom: 20 },
  userBubble: {
    backgroundColor: "#1111d4",
    padding: 15,
    borderRadius: 20,
    borderTopRightRadius: 0,
  },
  userMsgText: { fontSize: 14, color: "#fff" },
  chatInputRow: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    gap: 10,
    alignItems: "center",
  },
  chatInput: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: "#1111d4",
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Analysis;
