import { useRouter } from "expo-router";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Globe,
  MoreHorizontal,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  Users,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MainLayout from "../components/sci-sum/MainLayout";
// Import API Duy đã cấu hình
import { deletePaper, getMyPapers } from "../constants/Api";

const Summaries = () => {
  const router = useRouter();

  // --- STATES QUẢN LÝ DỮ LIỆU TỪ API ---
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Hàm fetch dữ liệu từ API
  const fetchPapers = async (page: number) => {
    setLoading(true);
    try {
      const res = await getMyPapers(page, 10);
      if (res.data.code === 200) {
        const pageData = res.data.data;
        setPapers(pageData.content);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
        setCurrentPage(pageData.number);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài báo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers(currentPage);
  }, [currentPage]);

  // Hàm xử lý xóa bài báo
  const handleDelete = (id: number, title: string) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa bài báo "${title}" không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await deletePaper(id);
              if (res.data.code === 200) {
                fetchPapers(currentPage); // Refresh lại danh sách
              }
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa bài báo này.");
            }
          },
        },
      ],
    );
  };

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

        {/* Summaries List */}
        <View style={styles.listContainer}>
          {loading ? (
            <View style={{ py: 40 }}>
              <ActivityIndicator size="large" color="#1111d4" />
            </View>
          ) : papers.length === 0 ? (
            <Text style={styles.emptyText}>Bạn chưa có bản tóm tắt nào.</Text>
          ) : (
            papers.map((item: any) => (
              <SummaryCard
                key={item.id}
                item={item}
                onDelete={() => handleDelete(item.id, item.title)}
              />
            ))
          )}

          {/* Pagination */}
          {!loading && papers.length > 0 && (
            <View style={styles.pagination}>
              <Text style={styles.paginationInfo}>
                Page {currentPage + 1} of {totalPages} ({totalElements})
              </Text>
              <View style={styles.pageActions}>
                <TouchableOpacity
                  onPress={() =>
                    setCurrentPage((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentPage === 0}
                >
                  <PageNavBtn
                    icon={
                      <ChevronLeft
                        size={16}
                        color={currentPage === 0 ? "#cbd5e1" : "#94a3b8"}
                      />
                    }
                  />
                </TouchableOpacity>

                <View style={styles.activePage}>
                  <Text style={styles.activePageText}>{currentPage + 1}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage + 1 >= totalPages}
                >
                  <PageNavBtn
                    icon={
                      <ChevronRight
                        size={16}
                        color={
                          currentPage + 1 >= totalPages ? "#cbd5e1" : "#94a3b8"
                        }
                      />
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
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

const SummaryCard = ({ item, onDelete }: any) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/analysis",
          params: { id: item.id },
        })
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.fileIconBox}>
          <FileText size={18} color="#1111d4" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardTopic}>
            {item.authors || "UNKNOWN AUTHOR"}
          </Text>
        </View>
        <TouchableOpacity onPress={onDelete}>
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.cardMeta}>
          <TypeBadge
            type={item.status === "DONE" ? "Completed" : item.status}
          />
          <Text style={styles.cardDate}>
            {new Date(item.createdAt).toLocaleDateString("vi-VN")}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() =>
              router.push({
                pathname: "/analysis",
                params: { id: item.id },
              })
            }
          >
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
  const isDone = type === "Completed";
  return (
    <View
      style={[
        styles.badge,
        isDone ? styles.badgeAbstract : styles.badgeBulleted,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          isDone ? { color: "#059669" } : { color: "#d97706" },
        ]}
      >
        {type.toUpperCase()}
      </Text>
    </View>
  );
};

const PageNavBtn = ({ icon }: any) => (
  <View style={styles.pageNavBtn}>{icon}</View>
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
  emptyText: {
    textAlign: "center",
    py: 40,
    color: "#94a3b8",
    fontStyle: "italic",
  },
});

export default Summaries;
