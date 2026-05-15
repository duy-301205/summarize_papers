import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import {
  Beaker,
  CheckCircle2,
  Edit3,
  Paperclip,
  Settings,
  UploadCloud,
  X,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MainLayout from "../components/sci-sum/MainLayout";
// Import thư viện hỗ trợ SSE cho React Native
import EventSource from "react-native-sse";
// Import API Duy đã cấu hình
import * as api from "../constants/Api";

const Upload = () => {
  const router = useRouter();
  const [language, setLanguage] = useState("EN");
  const [length, setLength] = useState("MEDIUM");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [manualText, setManualText] = useState("");

  // --- STATE TIẾN ĐỘ THỜI GIAN THỰC ---
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(
    "Đợi Duy một chút, trí tuệ nhân tạo đang đọc tài liệu của bạn...",
  );

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    });

    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  };

  const handleGenerate = async () => {
    // 1. Kiểm tra đầu vào
    if (!selectedFile && !manualText.trim()) {
      Alert.alert("Thông báo", "Vui lòng chọn file hoặc nhập văn bản!");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setStatusText("Đang khởi tạo quy trình upload...");

    try {
      // 2. Chuẩn bị FormData
      const formData = new FormData();
      if (selectedFile) {
        // Đối với React Native, FormData cần cấu trúc này cho file
        formData.append("file", {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || "application/pdf",
        } as any);
      }
      if (manualText) formData.append("text", manualText);
      formData.append("language", language);
      formData.append("length", length);

      // 3. Gọi API Upload
      const res = await api.uploadPaper(formData);
      const paperId = res.data.data.paperId;

      // 4. Thiết lập SSE theo dõi tiến độ (SỬA LẠI ĐOẠN NÀY)
      const eventSource = new EventSource(
        `${api.BASE_URL}/papers/status/${paperId}`,
      );

      eventSource.addEventListener("PROGRESS" as any, (event: any) => {
        if (event.data) {
          const data = JSON.parse(event.data);
          setProgress(data.progress);
          setStatusText(data.status);

          if (data.progress >= 100) {
            eventSource.close();
            setTimeout(() => {
              setIsGenerating(false);
              router.push({
                pathname: "/analysis",
                params: { id: paperId },
              });
            }, 1000);
          } else if (data.progress === -1) {
            eventSource.close();
            setIsGenerating(false);
            Alert.alert("Lỗi phân tích", data.status);
          }
        }
      });

      // @ts-ignore
      eventSource.addEventListener("error", (err) => {
        console.error("SSE Error:", err);
        eventSource.close();
        setStatusText("Mất kết nối. Đang kiểm tra trạng thái...");
      });
    } catch (error: any) {
      console.error("Upload Error:", error);
      setIsGenerating(false);
      const errorMsg = error.response?.data?.message || "Lỗi upload tài liệu!";
      Alert.alert("Lỗi", errorMsg);
    }
  };

  return (
    <MainLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.pageHeader}>
          <Text style={styles.title}>UPLOAD ARTICLE</Text>
          <Text style={styles.subtitle}>
            Synthesize complex research into actionable insights.
          </Text>
        </View>

        <View style={styles.mainContainer}>
          {/* Document Upload Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBoxBlue}>
                <UploadCloud size={20} color="#1111d4" />
              </View>
              <Text style={styles.cardTitle}>DOCUMENT UPLOAD</Text>
            </View>

            <TouchableOpacity
              onPress={pickDocument}
              style={[styles.dropZone, selectedFile && styles.dropZoneActive]}
            >
              <View
                style={[
                  styles.circleIcon,
                  selectedFile ? styles.circleGreen : styles.circleBlue,
                ]}
              >
                {selectedFile ? (
                  <CheckCircle2 size={32} color="#10b981" />
                ) : (
                  <Paperclip size={32} color="#1111d4" />
                )}
              </View>

              {selectedFile ? (
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{selectedFile.name}</Text>
                  <TouchableOpacity
                    onPress={() => setSelectedFile(null)}
                    style={styles.removeBtn}
                  >
                    <X size={12} color="#ef4444" />
                    <Text style={styles.removeText}>REMOVE FILE</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.dropZoneText}>
                  <Text style={styles.dropTitle}>PICK A PDF OR DOCX</Text>
                  <Text style={styles.dropSub}>Max size: 25MB</Text>
                  <View style={styles.browseBtn}>
                    <Text style={styles.browseText}>BROWSE FILES</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Manual Input Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBoxIndigo}>
                <Edit3 size={20} color="#4f46e5" />
              </View>
              <Text style={styles.cardTitle}>MANUAL TEXT INPUT</Text>
            </View>
            <TextInput
              multiline
              value={manualText}
              onChangeText={setManualText}
              style={styles.textArea}
              placeholder="Paste article text or abstract here..."
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Settings Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Settings size={18} color="#1111d4" />
              <Text style={styles.cardTitle}>SUMMARY SETTINGS</Text>
            </View>

            <View style={styles.settingGroup}>
              <Text style={styles.settingLabel}>OUTPUT LANGUAGE</Text>
              <View style={styles.toggleRow}>
                {["EN", "VN"].map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    onPress={() => setLanguage(lang)}
                    style={[
                      styles.toggleBtn,
                      language === lang && styles.toggleBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        language === lang && styles.toggleTextActive,
                      ]}
                    >
                      {lang === "EN" ? "ENGLISH" : "VIETNAMESE"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.settingGroup}>
              <Text style={styles.settingLabel}>OUTPUT LENGTH</Text>
              <View style={styles.toggleRow}>
                {["SHORT", "MEDIUM", "LONG"].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setLength(opt)}
                    style={[
                      styles.toggleBtn,
                      length === opt && styles.toggleBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        length === opt && styles.toggleTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.generateBtn}
              onPress={handleGenerate}
              disabled={isGenerating}
            >
              <Zap size={20} color="#fff" fill="#fff" />
              <Text style={styles.generateText}>GENERATE SUMMARY</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Generating Modal - Tích hợp Progress thật */}
      <Modal visible={isGenerating} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <View style={styles.spinWrapper}>
              <ActivityIndicator size="large" color="#1111d4" />
              <View style={styles.beakerIcon}>
                <Beaker size={32} color="#1111d4" />
              </View>
            </View>
            <Text style={styles.loadingTitle}>AI IS ANALYSING</Text>
            <Text style={styles.loadingSub}>{statusText}</Text>
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${progress}%` }]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: 20 },
  pageHeader: { marginBottom: 25 },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
    fontStyle: "italic",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
    fontStyle: "italic",
  },
  mainContainer: { gap: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  iconBoxBlue: { backgroundColor: "#eff6ff", padding: 8, borderRadius: 10 },
  iconBoxIndigo: { backgroundColor: "#eef2ff", padding: 8, borderRadius: 10 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: 0.5,
  },
  dropZone: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
  },
  dropZoneActive: { borderColor: "#10b981", backgroundColor: "#f0fdf4" },
  circleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
  },
  circleBlue: { shadowColor: "#1111d4" },
  circleGreen: { shadowColor: "#10b981" },
  dropZoneText: { alignItems: "center" },
  dropTitle: { fontSize: 14, fontWeight: "800", color: "#1e293b" },
  dropSub: { fontSize: 12, color: "#94a3b8", marginTop: 4, marginBottom: 15 },
  browseBtn: {
    backgroundColor: "#1111d4",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  browseText: { color: "#fff", fontSize: 11, fontWeight: "900" },
  fileInfo: { alignItems: "center" },
  fileName: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "bold",
    textAlign: "center",
  },
  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
  },
  removeText: { fontSize: 9, fontWeight: "900", color: "#ef4444" },
  textArea: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 15,
    height: 180,
    textAlignVertical: "top",
    color: "#0f172a",
    fontSize: 14,
  },
  settingGroup: { marginBottom: 20 },
  settingLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#94a3b8",
    marginBottom: 10,
    marginLeft: 5,
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: 4,
    borderRadius: 16,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  toggleBtnActive: { backgroundColor: "#fff", elevation: 2 },
  toggleText: { fontSize: 11, fontWeight: "900", color: "#94a3b8" },
  toggleTextActive: { color: "#1111d4" },
  generateBtn: {
    backgroundColor: "#1111d4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 18,
    gap: 10,
    marginTop: 10,
  },
  generateText: { color: "#fff", fontWeight: "900", fontSize: 15 },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingBox: { width: "100%", alignItems: "center" },
  spinWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  beakerIcon: { position: "absolute" },
  loadingTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0f172a",
    marginTop: 30,
  },
  loadingSub: {
    textAlign: "center",
    color: "#64748b",
    fontStyle: "italic",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  progressBarBg: {
    width: 200,
    height: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
    marginTop: 30,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", backgroundColor: "#1111d4" },
});

export default Upload;
