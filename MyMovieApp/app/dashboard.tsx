import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  FileText,
  Timer,
  Database,
  CheckCircle2,
  UploadCloud,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import MainLayout from "../components/sci-sum/MainLayout";

const { width } = Dimensions.get("window");

const Dashboard = () => {
  const router = useRouter();

  const recentActivity = [
    {
      id: "1",
      title: "Neural Network Efficiency in VNU Cloud",
      status: "Completed",
      category: "AI / Tech",
      date: "Oct 24, 2023",
    },
    {
      id: "2",
      title: "CRISPR-Cas9 Patterns in Rice Genomes",
      status: "Processing",
      category: "Genetics",
      date: "Oct 24, 2023",
    },
    {
      id: "3",
      title: "Thermal Dynamics of Superconductors",
      status: "Completed",
      category: "Physics",
      date: "Oct 23, 2023",
    },
  ];

  return (
    <MainLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Dashboard Header */}
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

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={<FileText size={20} color="#1111d4" />}
            label="Articles"
            value="1,284"
            trend="+12%"
          />
          <StatCard
            icon={<Timer size={20} color="#1111d4" />}
            label="Avg. Time"
            value="4.2s"
            trend="-0.5s"
            isGreen
          />
          <StatCard
            icon={<Database size={20} color="#1111d4" />}
            label="Tokens"
            value="850.4k"
            trend="+5%"
          />
          <StatCard
            icon={<CheckCircle2 size={20} color="#1111d4" />}
            label="Accuracy"
            value="98.2%"
            trend="+0.2%"
            isGreen
          />
        </View>

        {/* Chart Card: Volume */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>RESEARCH VOLUME</Text>
          <View style={styles.chartPlaceholder}>
            {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
              <View key={i} style={[styles.bar, { height: h }]} />
            ))}
          </View>
        </View>

        {/* Chart Card: Top Topics (MỚI CẬP NHẬT) */}
        <TopicsChart />

        {/* Activity List */}
        <View style={styles.activityContainer}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
            <TouchableOpacity onPress={() => router.push("/summaries")}>
              <Text style={styles.viewAllText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>

          {recentActivity.map((item) => (
            <ActivityItem key={item.id} item={item} />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </MainLayout>
  );
};

// --- SUB-COMPONENTS ---

const TopicsChart = () => {
  const topics = [
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
              <Text style={styles.donutTotal}>12.8k</Text>
              <Text style={styles.donutLabel}>TOTAL</Text>
            </View>
          </View>
        </View>
        <View style={styles.topicsList}>
          {topics.map((t, i) => (
            <View key={i} style={styles.topicItem}>
              <View style={[styles.topicDot, { backgroundColor: t.color }]} />
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: 1,
  },
  chartPlaceholder: {
    height: 100,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    marginTop: 20,
  },
  bar: { width: 15, backgroundColor: "#1111d4", borderRadius: 4, opacity: 0.8 },

  // TOPICS CHART STYLES
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
