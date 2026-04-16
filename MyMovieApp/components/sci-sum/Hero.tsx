import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  Sparkles,
  FileUp,
  PlayCircle,
  BarChart3,
  CheckCircle2,
} from "lucide-react-native";
// 1. Thêm import useRouter
import { useRouter } from "expo-router";

const Hero = () => {
  const router = useRouter(); // 2. Khởi tạo router

  return (
    <View style={styles.section}>
      <View style={styles.badge}>
        <Sparkles size={14} color="#1111d4" />
        <Text style={styles.badgeText}>POWERED BY TRANSFORMER MODELS</Text>
      </View>

      <Text style={styles.h1}>
        AI-Powered Scientific {"\n"}
        <Text style={{ color: "#1111d4" }}>Summarization</Text>
      </Text>

      <Text style={styles.description}>
        Unlock high-fidelity insights from academic papers. Advanced NLP models
        for VNU-HUS research.
      </Text>

      <View style={styles.buttonGroup}>
        {/* Nút Upload - Chuyển sang trang Auth hoặc Upload */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/auth")}
        >
          <FileUp size={20} color="#fff" />
          <Text style={styles.primaryBtnText}>Upload Paper</Text>
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          <TouchableOpacity style={styles.secondaryBtn}>
            <PlayCircle size={20} color="#0f172a" />
            <Text style={styles.secondaryBtnText}>Demo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.secondaryBtn,
              {
                borderWidth: 1,
                borderColor: "#e2e8f0",
                backgroundColor: "transparent",
              },
            ]}
          >
            <BarChart3 size={20} color="#64748b" />
            <Text style={[styles.secondaryBtnText, { color: "#64748b" }]}>
              Analytics
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Visual Side */}
      <View style={styles.visualContainer}>
        <View style={styles.imageCard}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000",
            }}
            style={styles.mockupImage}
            imageStyle={{ borderRadius: 16 }}
          />
          <View style={styles.mockupContent}>
            <View style={styles.skeletonLineShort} />
            <View style={styles.skeletonLineFull} />
          </View>

          <View style={styles.accuracyBadge}>
            <View style={styles.checkIcon}>
              <CheckCircle2 size={20} color="#16a34a" />
            </View>
            <View>
              <Text style={styles.accuracyLabel}>ACCURACY SCORE</Text>
              <Text style={styles.accuracyVal}>98.4%</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { padding: 20, alignItems: "center", paddingTop: 40 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 17, 212, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderSize: 1,
    borderColor: "rgba(17, 17, 212, 0.2)",
    marginBottom: 20,
  },
  badgeText: {
    color: "#1111d4",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 5,
  },
  h1: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
    lineHeight: 48,
  },
  description: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonGroup: { width: "100%", marginTop: 30, gap: 12 },
  primaryBtn: {
    backgroundColor: "#1111d4",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  primaryBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  secondaryRow: { flexDirection: "row", gap: 10 },
  secondaryBtn: {
    flex: 1,
    backgroundColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    gap: 8,
  },
  secondaryBtnText: { color: "#0f172a", fontWeight: "bold", fontSize: 14 },

  visualContainer: { marginTop: 60, width: "100%", paddingBottom: 40 },
  imageCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  mockupImage: { width: "100%", height: 180 },
  mockupContent: { marginTop: 15, gap: 10, padding: 5 },
  skeletonLineShort: {
    height: 8,
    width: 80,
    backgroundColor: "rgba(17, 17, 212, 0.1)",
    borderRadius: 4,
  },
  skeletonLineFull: {
    height: 10,
    width: "100%",
    backgroundColor: "#f1f5f9",
    borderRadius: 5,
  },
  accuracyBadge: {
    position: "absolute",
    bottom: -15,
    right: 10,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  checkIcon: { backgroundColor: "#dcfce7", padding: 6, borderRadius: 10 },
  accuracyLabel: { fontSize: 8, color: "#64748b", fontWeight: "bold" },
  accuracyVal: { fontSize: 18, fontWeight: "bold", color: "#0f172a" },
});

export default Hero;
