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
} from "lucide-react-native";
import { useRouter } from "expo-router";
import MainLayout from "../components/sci-sum/MainLayout";

// --- DATA TĨNH DUY GỬI ---
const SUMMARIES_LIST = [
  {
    id: 1,
    title: "Transformers in Computer Vision: A Survey",
    topic: "Deep Learning, AI",
    type: "Detailed",
    language: "English (EN)",
    date: "Oct 24, 2023",
  },
  {
    id: 2,
    title: "Climate Change Impact on Mekong Delta Agriculture",
    topic: "Environmental Science",
    type: "Bulleted",
    language: "Vietnamese (VN)",
    date: "Oct 22, 2023",
  },
  {
    id: 3,
    title: "CRISPR-Cas9: Gene Editing Breakthroughs in 2023",
    topic: "Biotechnology",
    type: "Abstract",
    language: "English (EN)",
    date: "Oct 19, 2023",
  },
  {
    id: 4,
    title: "Quantum Computing in Cryptography: A Review",
    topic: "Physics, Cyber Security",
    type: "Detailed",
    language: "English (EN)",
    date: "Oct 15, 2023",
  },
  {
    id: 5,
    title: "Sustainable Architecture in Tropical Regions",
    topic: "Urban Planning",
    type: "Bulleted",
    language: "Vietnamese (VN)",
    date: "Oct 12, 2023",
  },
];

const MySummaries = () => {
  const router = useRouter();

  return (
    <MainLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>MY SUMMARIES</Text>
            <Text style={styles.headerSubtitle}>
              Access your repository of academic insights.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => router.push("/upload")}
          >
            <Plus size={16} color="#fff" />
            <Text style={styles.newBtnText}>NEW</Text>
          </TouchableOpacity>
        </View>

        {/* Filters Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersRow}
        >
          <FilterButton
            icon={<Calendar size={14} color="#64748b" />}
            label="Dates"
          />
          <FilterButton
            icon={<Globe size={14} color="#64748b" />}
            label="Lang"
          />
          <FilterButton
            icon={<Tag size={14} color="#64748b" />}
            label="Topic"
          />
          <TouchableOpacity style={styles.sortBtn}>
            <Text style={styles.sortText}>SORT</Text>
            <MoreHorizontal size={14} color="#94a3b8" />
          </TouchableOpacity>
        </ScrollView>

        {/* Summaries List (Thay thế Table) */}
        <View style={styles.listContainer}>
          {SUMMARIES_LIST.map((item) => (
            <SummaryCard key={item.id} item={item} />
          ))}

          {/* Pagination Giả lập */}
          <View style={styles.pagination}>
            <Text style={styles.paginationInfo}>Showing 5 of 124</Text>
            <View style={styles.pageActions}>
              <PageNavBtn icon={<ChevronLeft size={16} color="#94a3b8" />} />
              <View style={styles.activePage}>
                <Text style={styles.activePageText}>1</Text>
              </View>
              <PageNavBtn icon={<ChevronRight size={16} color="#94a3b8" />} />
            </View>
          </View>
        </View>

        {/* Banner Cards Grid */}
        <View style={styles.bannerGrid}>
          <BannerCard
            variant="primary"
            icon={<Sparkles size={20} color="#fff" />}
            title="Batch Summary"
            desc="Process multiple papers at once."
            btnText="Try Batch"
          />
          <BannerCard
            variant="secondary"
            icon={<Users size={20} color="#1111d4" />}
            title="Collaboration"
            desc="Co-analyze in real-time."
            btnText="Setup Team"
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </MainLayout>
  );
};

// --- SUB-COMPONENTS ---

const SummaryCard = ({ item }: any) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push("/analysis")}
    >
      <View style={styles.cardHeader}>
        <View style={styles.fileIconBox}>
          <FileText size={18} color="#1111d4" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardTopic}>{item.topic.toUpperCase()}</Text>
        </View>
        <MoreHorizontal size={20} color="#cbd5e1" />
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.cardMeta}>
          <TypeBadge type={item.type} />
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Eye size={16} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Download size={16} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FilterButton = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.filterBtn}>
    {icon}
    <Text style={styles.filterLabel}>{label}</Text>
  </TouchableOpacity>
);

const TypeBadge = ({ type }: any) => {
  const isDetailed = type === "Detailed";
  const isAbstract = type === "Abstract";
  return (
    <View
      style={[
        styles.badge,
        isDetailed
          ? styles.badgeDetailed
          : isAbstract
            ? styles.badgeAbstract
            : styles.badgeBulleted,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          isDetailed
            ? { color: "#4f46e5" }
            : isAbstract
              ? { color: "#059669" }
              : { color: "#d97706" },
        ]}
      >
        {type.toUpperCase()}
      </Text>
    </View>
  );
};

const PageNavBtn = ({ icon }: any) => (
  <TouchableOpacity style={styles.pageNavBtn}>{icon}</TouchableOpacity>
);

const BannerCard = ({ icon, title, desc, variant, btnText }: any) => {
  const isPrimary = variant === "primary";
  return (
    <View
      style={[
        styles.banner,
        isPrimary ? styles.bannerPrimary : styles.bannerSecondary,
      ]}
    >
      <View
        style={[
          styles.bannerIconBox,
          isPrimary
            ? { backgroundColor: "rgba(255,255,255,0.1)" }
            : { backgroundColor: "#eff6ff" },
        ]}
      >
        {icon}
      </View>
      <Text
        style={[
          styles.bannerTitle,
          isPrimary ? { color: "#fff" } : { color: "#0f172a" },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.bannerDesc,
          isPrimary ? { color: "#bfdbfe" } : { color: "#64748b" },
        ]}
        numberOfLines={2}
      >
        {desc}
      </Text>
      <TouchableOpacity style={styles.bannerBtn}>
        <Text
          style={[
            styles.bannerBtnText,
            isPrimary ? { color: "#fff" } : { color: "#1111d4" },
          ]}
        >
          {btnText}
        </Text>
        <ChevronRight size={14} color={isPrimary ? "#fff" : "#1111d4"} />
      </TouchableOpacity>
    </View>
  );
};

// --- STYLES ---

const styles = StyleSheet.create({
  scrollContent: { padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
    fontStyle: "italic",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
    fontStyle: "italic",
  },
  newBtn: {
    backgroundColor: "#1111d4",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  newBtnText: { color: "#fff", fontWeight: "bold", fontSize: 11 },

  filtersRow: { flexDirection: "row", marginBottom: 20 },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    gap: 6,
  },
  filterLabel: { fontSize: 10, fontWeight: "900", color: "#64748b" },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    gap: 4,
  },
  sortText: { fontSize: 10, fontWeight: "900", color: "#94a3b8" },

  listContainer: { gap: 12 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  fileIconBox: { backgroundColor: "#eff6ff", padding: 8, borderRadius: 10 },
  cardTitle: { fontSize: 14, fontWeight: "bold", color: "#0f172a" },
  cardTopic: {
    fontSize: 8,
    fontWeight: "900",
    color: "#94a3b8",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 12,
  },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardDate: { fontSize: 11, color: "#94a3b8" },
  cardActions: { flexDirection: "row", gap: 8 },
  actionBtn: { padding: 4 },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeDetailed: { backgroundColor: "#eef2ff", borderColor: "#e0e7ff" },
  badgeBulleted: { backgroundColor: "#fffbeb", borderColor: "#fef3c7" },
  badgeAbstract: { backgroundColor: "#ecfdf5", borderColor: "#d1fae5" },
  badgeText: { fontSize: 9, fontWeight: "900" },

  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 5,
  },
  paginationInfo: { fontSize: 10, fontWeight: "bold", color: "#94a3b8" },
  pageActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  pageNavBtn: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
  },
  activePage: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#1111d4",
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  activePageText: { fontSize: 11, fontWeight: "bold", color: "#1111d4" },

  bannerGrid: { flexDirection: "row", gap: 12, marginTop: 25 },
  banner: { flex: 1, padding: 16, borderRadius: 24, borderWidth: 1 },
  bannerPrimary: { backgroundColor: "#1111d4", borderColor: "transparent" },
  bannerSecondary: { backgroundColor: "#fff", borderColor: "#e2e8f0" },
  bannerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "900",
    fontStyle: "italic",
    marginBottom: 4,
  },
  bannerDesc: { fontSize: 11, lineHeight: 16, marginBottom: 12 },
  bannerBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  bannerBtnText: { fontSize: 10, fontWeight: "900" },
});

export default MySummaries;
