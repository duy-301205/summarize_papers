import { useRouter } from "expo-router";
import {
  CheckCircle2,
  Database,
  FileText,
  MoreHorizontal,
  Timer,
  TrendingUp,
  UploadCloud,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MainLayout from "../components/sci-sum/MainLayout";
import {
  getDashboardSummary,
  getMyPapers,
  getTopicsChartData,
  getVolumeChartData,
} from "../constants/Api";

const { width } = Dimensions.get("window");

const Dashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentPapers, setRecentPapers] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [topicsData, setTopicsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- LOGIC XỬ LÝ 12 THÁNG (CHỈ THAY ĐỔI PHẦN NÀY) ---
  const processVolumeData = (apiData: any[]) => {
    const monthsShort = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Bước 1: Tạo một mảng 12 số 0 đại diện cho 12 tháng
    const monthlyCounts = new Array(12).fill(0);

    // Bước 2: Duyệt qua dữ liệu API và cộng dồn vào tháng tương ứng
    apiData?.forEach((item: any) => {
      if (item.label) {
        // Chuyển chuỗi ngày tháng thành đối tượng Date
        const date = new Date(item.label);

        // Kiểm tra xem date có hợp lệ không (tránh lỗi chuỗi lạ)
        if (!isNaN(date.getTime())) {
          const monthIndex = date.getMonth(); // Trả về 0-11 (0 là tháng 1)
          monthlyCounts[monthIndex] += Number(item.value || 0);
        }
      }
    });

    // Bước 3: Map lại thành định dạng cho biểu đồ
    return monthsShort.map((month, index) => ({
      label: month,
      value: monthlyCounts[index],
    }));
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, volumeRes, topicsRes, papersRes] = await Promise.all([
          getDashboardSummary(),
          getVolumeChartData(),
          getTopicsChartData(),
          getMyPapers(0, 3),
        ]);

        setStats(statsRes.data.data);
        // Đổ dữ liệu API vào khung 12 tháng
        setVolumeData(processVolumeData(volumeRes.data.data));
        setTopicsData(topicsRes.data.data);
        setRecentPapers(papersRes.data.data.content);
      } catch (error) {
        console.error("Lỗi tích hợp Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading && !stats) {
    return (
      <MainLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1111d4" />
          <Text style={styles.loadingText}>LOADING DATA...</Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header - GIỮ NGUYÊN */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>ANALYTICS DASHBOARD</Text>
            <Text style={styles.headerSubtitle}>
              Chào Duy, hôm nay bạn muốn tóm tắt tài liệu gì?
            </Text>
          </View>
          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => router.push("/upload")}
          >
            <UploadCloud size={20} color="#fff" />
            <Text style={styles.newBtnText}>NEW</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid - GIỮ NGUYÊN */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={<FileText size={20} color="#1111d4" />}
            label="Articles"
            value={stats?.totalArticles?.toLocaleString() || "0"}
            trend="+12%"
          />
          <StatCard
            icon={<Timer size={20} color="#1111d4" />}
            label="Avg. Time"
            value={stats?.avgTime || "0s"}
            trend="-0.5s"
            isGreen
          />
          <StatCard
            icon={<Database size={20} color="#1111d4" />}
            label="Tokens"
            value={stats?.tokensConsumed || "0k"}
            trend="+5%"
          />
          <StatCard
            icon={<CheckCircle2 size={20} color="#1111d4" />}
            label="Accuracy"
            value={stats?.accuracyScore || "0%"}
            trend="+0.2%"
            isGreen
          />
        </View>

        {/* Chart Volume - THAY ĐỔI HIỂN THỊ THEO THÁNG */}
        <View style={styles.sectionCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>RESEARCH VOLUME</Text>
            <Text style={styles.chartLegend}>Yearly Overview</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chartPlaceholder}>
              {volumeData.map((item, i) => {
                const maxVal = Math.max(...volumeData.map((d) => d.value), 10);
                const barHeight = (item.value / maxVal) * 80;

                return (
                  <View key={i} style={styles.barContainer}>
                    <View style={styles.barValueWrapper}>
                      {item.value > 0 && (
                        <Text style={styles.barValueTooltip}>{item.value}</Text>
                      )}
                      <View
                        style={[styles.bar, { height: Math.max(barHeight, 2) }]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{item.label}</Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Topics Chart - GIỮ NGUYÊN */}
        <TopicsChart data={topicsData} stats={stats} />

        {/* Recent Activity - GIỮ NGUYÊN */}
        <View style={styles.activityContainer}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
            <TouchableOpacity onPress={() => router.push("/summaries")}>
              <Text style={styles.viewAllText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          {recentPapers.map((item) => (
            <ActivityItem
              key={item.id}
              item={{
                id: item.id,
                title: item.title,
                status: item.status === "DONE" ? "Completed" : "Processing",
                category: item.fileType || "Research",
                date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
              }}
            />
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </MainLayout>
  );
};

// --- SUB-COMPONENTS - GIỮ NGUYÊN ---

const StatCard = ({ icon, label, value, trend, isGreen }: any) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <View style={styles.statIconBox}>{icon}</View>
      <View
        style={[
          styles.trendBadge,
          { backgroundColor: isGreen ? "#ecfdf5" : "#eff6ff" },
        ]}
      >
        <TrendingUp size={10} color={isGreen ? "#10b981" : "#1111d4"} />
        <Text
          style={[styles.trendText, { color: isGreen ? "#10b981" : "#1111d4" }]}
        >
          {trend}
        </Text>
      </View>
    </View>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const TopicsChart = ({ data, stats }: any) => {
  const topics =
    data && data.length > 0
      ? data
      : [
          { label: "Computer Science", value: 45, color: "#1111d4" },
          { label: "Medicine", value: 25, color: "#4f46e5" },
          { label: "Physics", value: 15, color: "#8b5cf6" },
          { label: "Other", value: 15, color: "#e2e8f0" },
        ];
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>TOP RESEARCH TOPICS</Text>
      <View style={styles.topicsRow}>
        <View style={styles.donutWrapper}>
          <View style={styles.donutBase}>
            <View style={styles.donutInner}>
              <Text style={styles.donutTotal}>
                {stats?.totalArticles || "0"}
              </Text>
              <Text style={styles.donutLabel}>TOTAL</Text>
            </View>
          </View>
        </View>
        <View style={styles.topicsList}>
          {topics.map((t: any, i: number) => (
            <View key={i} style={styles.topicItem}>
              <View
                style={[
                  styles.topicDot,
                  { backgroundColor: t.color || "#1111d4" },
                ]}
              />
              <Text style={styles.topicLabelText} numberOfLines={1}>
                {t.label}
              </Text>
              <Text style={styles.topicValueText}>{t.value}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const ActivityItem = ({ item }: any) => (
  <View style={styles.activityItem}>
    <View style={{ flex: 1 }}>
      <Text style={styles.itemTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <View style={styles.itemMeta}>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemDot}>•</Text>
        <Text style={styles.itemDate}>{item.date}</Text>
      </View>
    </View>
    <View style={styles.itemActions}>
      <View
        style={[
          styles.statusBadge,
          item.status === "Processing"
            ? styles.statusProcessing
            : styles.statusDone,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            item.status === "Processing"
              ? { color: "#2563eb" }
              : { color: "#059669" },
          ]}
        >
          {item.status.toUpperCase()}
        </Text>
      </View>
      <MoreHorizontal size={20} color="#94a3b8" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  scrollContent: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: {
    marginTop: 10,
    color: "#64748b",
    fontWeight: "bold",
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 25,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    fontStyle: "italic",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
    width: width * 0.6,
  },
  newBtn: {
    backgroundColor: "#1111d4",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    elevation: 5,
  },
  newBtnText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#fff",
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statIconBox: { backgroundColor: "#eff6ff", padding: 8, borderRadius: 10 },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 20,
    gap: 2,
  },
  trendText: { fontSize: 9, fontWeight: "900" },
  statLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    marginTop: 2,
  },

  sectionCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 24,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  chartLegend: { fontSize: 10, color: "#94a3b8", fontWeight: "bold" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: 1,
  },

  // STYLES BIỂU ĐỒ THEO THÁNG
  chartPlaceholder: {
    height: 140,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingTop: 20,
    paddingHorizontal: 5,
  },
  barContainer: { alignItems: "center", width: 45, marginRight: 5 },
  barValueWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    width: "100%",
  },
  barValueTooltip: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#1111d4",
    marginBottom: 2,
  },
  bar: {
    width: 14,
    backgroundColor: "#1111d4",
    borderRadius: 4,
    opacity: 0.85,
    elevation: 2,
  },
  barLabel: { fontSize: 9, color: "#94a3b8", fontWeight: "bold", marginTop: 8 },

  topicsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 20,
  },
  donutWrapper: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  donutBase: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 10,
    borderColor: "#1111d4",
    borderTopColor: "#8b5cf6",
    borderRightColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
  },
  donutInner: { alignItems: "center" },
  donutTotal: { fontSize: 16, fontWeight: "900", color: "#0f172a" },
  donutLabel: { fontSize: 8, fontWeight: "900", color: "#94a3b8" },
  topicsList: { flex: 1, gap: 8 },
  topicItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topicDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  topicLabelText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  topicValueText: { fontSize: 12, fontWeight: "900", color: "#0f172a" },

  activityContainer: { marginTop: 25 },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAllText: { fontSize: 10, fontWeight: "900", color: "#1111d4" },
  activityItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  itemTitle: { fontSize: 14, fontWeight: "bold", color: "#0f172a" },
  itemMeta: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  itemCategory: { fontSize: 12, color: "#64748b" },
  itemDot: { marginHorizontal: 6, color: "#cbd5e1" },
  itemDate: { fontSize: 12, color: "#94a3b8" },
  itemActions: { alignItems: "flex-end", gap: 8 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusDone: { backgroundColor: "#ecfdf5", borderColor: "#a7f3d0" },
  statusProcessing: { backgroundColor: "#eff6ff", borderColor: "#bfdbfe" },
  statusText: { fontSize: 8, fontWeight: "900" },
});

export default Dashboard;
