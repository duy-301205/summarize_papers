import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  ArrowLeft,
  Download,
  Copy,
  Share2,
  FileText,
  Target,
  Beaker,
  Clock,
  Type,
  Zap,
  CheckCircle2,
  MessageSquare,
  Send,
  Sparkles,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import MainLayout from "../components/sci-sum/MainLayout";

// --- DATA TĨNH DUY GỬI ---
const ARTICLE_DATA = {
  title:
    "Deep Learning trong Genomics: Cách mạng hóa Y học Chính xác thông qua Suy luận Quy mô lớn",
  journal: "Nature Genetics",
  date: "Tháng 10, 2023",
  abstract:
    "Sự hội tụ của học sâu (deep learning) và giải trình tự gen quy mô lớn đã mở ra một kỷ nguyên mới cho khám phá sinh học...",
  introduction:
    "Dữ liệu gen vốn dĩ có kích thước cực lớn và độ phức tạp cao...",
  highlights: [
    "GenomicTrans giảm độ trễ suy luận xuống 45%.",
    "Cơ chế Localized Attention xử lý 1 triệu base pairs.",
    "Đạt chỉ số AUC 0.94 trong phân loại biến thể.",
  ],
};

const AI_SUMMARY = {
  readingTime: "2 min",
  wordCount: 420,
  summary:
    "Dựa trên phân tích chuyên sâu, nghiên cứu này đề xuất một kiến trúc mạng nơ-ron mới nhằm tối ưu hóa việc xử lý dữ liệu genomic quy mô lớn...",
  keywords: ["Deep Learning", "Genomics", "Transformer", "NLP"],
  objectives: [
    "Efficiency architecture",
    "Clinical genomics",
    "Biobank validation",
  ],
  metrics: [
    { label: "Architecture", value: "GenomicTrans" },
    { label: "Training", value: "1.2M Seq" },
    { label: "Inference", value: "Edge-AI" },
  ],
};

const ArticleAnalysis = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("summary"); // original, summary, chat
  const [userInput, setUserInput] = useState("");

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
          {activeTab === "original" && <OriginalContent />}
          {activeTab === "summary" && <SummaryContent />}
          {activeTab === "chat" && (
            <ChatContent userInput={userInput} setUserInput={setUserInput} />
          )}
        </View>
      </View>
    </MainLayout>
  );
};

// --- SUB-COMPONENTS ---

const OriginalContent = () => (
  <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
    <Text style={styles.articleTitle}>{ARTICLE_DATA.title}</Text>
    <View style={styles.metaRow}>
      <Clock size={12} color="#94a3b8" />
      <Text style={styles.metaText}>
        {ARTICLE_DATA.date} • {ARTICLE_DATA.journal}
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeader}>ABSTRACT</Text>
      <Text style={styles.paragraph}>{ARTICLE_DATA.abstract}</Text>
    </View>

    <View style={styles.highlightBox}>
      <Text style={styles.highlightLabel}>ĐIỂM NỔI BẬT:</Text>
      {ARTICLE_DATA.highlights.map((h, i) => (
        <View key={i} style={styles.bulletRow}>
          <CheckCircle2 size={14} color="#1111d4" />
          <Text style={styles.bulletText}>{h}</Text>
        </View>
      ))}
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeader}>INTRODUCTION</Text>
      <Text style={styles.paragraph}>{ARTICLE_DATA.introduction}</Text>
    </View>
    <View style={{ height: 40 }} />
  </ScrollView>
);

const SummaryContent = () => (
  <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
    <View style={styles.metricRow}>
      <MetricSmall
        label="READ TIME"
        value={AI_SUMMARY.readingTime}
        icon={<Clock size={12} color="#1111d4" />}
      />
      <MetricSmall
        label="WORDS"
        value={AI_SUMMARY.wordCount}
        icon={<Type size={12} color="#1111d4" />}
      />
    </View>

    <View style={styles.aiBox}>
      <View style={styles.aiHeader}>
        <Sparkles size={18} color="#1111d4" />
        <Text style={styles.aiHeaderText}>BẢN TÓM TẮT AI</Text>
      </View>
      <Text style={styles.aiBody}>{AI_SUMMARY.summary}</Text>
    </View>

    <View style={styles.tagWrapper}>
      <Text style={styles.sectionHeader}>TỪ KHÓA</Text>
      <View style={styles.tagContainer}>
        {AI_SUMMARY.keywords.map((k, i) => (
          <View key={i} style={styles.tag}>
            <Text style={styles.tagText}>#{k}</Text>
          </View>
        ))}
      </View>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeader}>MỤC TIÊU NGHIÊN CỨU</Text>
      {AI_SUMMARY.objectives.map((obj, i) => (
        <View key={i} style={styles.objRow}>
          <Text style={styles.objNum}>0{i + 1}</Text>
          <Text style={styles.objText}>{obj}</Text>
        </View>
      ))}
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionHeader}>PHƯƠNG PHÁP</Text>
      <View style={styles.metricsGrid}>
        {AI_SUMMARY.metrics.map((m, i) => (
          <View key={i} style={styles.metricCard}>
            <Text style={styles.mLabel}>{m.label}</Text>
            <Text style={styles.mValue}>{m.value}</Text>
          </View>
        ))}
      </View>
    </View>
    <View style={{ height: 40 }} />
  </ScrollView>
);

const ChatContent = ({ userInput, setUserInput }: any) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <ScrollView style={styles.chatBody}>
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

      <View style={styles.userMsg}>
        <View style={styles.userBubble}>
          <Text style={styles.userMsgText}>Phương pháp chính là gì?</Text>
        </View>
      </View>
    </ScrollView>

    <View style={styles.chatInputRow}>
      <TextInput
        style={styles.chatInput}
        placeholder="Hỏi bất cứ điều gì..."
        value={userInput}
        onChangeText={setUserInput}
      />
      <TouchableOpacity style={styles.sendBtn}>
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

// --- STYLES ---

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

  metricsGrid: { flexDirection: "row", gap: 10 },
  metricCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  mLabel: { fontSize: 8, fontWeight: "900", color: "#94a3b8", marginBottom: 4 },
  mValue: { fontSize: 11, fontWeight: "900", color: "#1111d4" },

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

export default ArticleAnalysis;
