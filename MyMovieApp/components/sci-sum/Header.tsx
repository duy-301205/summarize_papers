import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { Search, Bell, Menu } from "lucide-react-native";
import { useRouter } from "expo-router";
// Import component thông báo Duy vừa làm
import NotificationDropdown from "./notifications";

const Header = ({ onOpenMenu }: { onOpenMenu: () => void }) => {
  const router = useRouter();
  // State để quản lý việc mở Modal thông báo
  const [isNotifVisible, setIsNotifVisible] = useState(false);

  return (
    <View style={styles.header}>
      {/* Nút mở Sidebar (Hamburger Menu) */}
      <TouchableOpacity onPress={onOpenMenu} style={styles.menuBtn}>
        <Menu size={24} color="#0f172a" />
      </TouchableOpacity>

      {/* Ô Search tinh gọn */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          placeholder="Search..."
          style={styles.searchInput}
          placeholderTextColor="#94a3b8"
        />
      </View>

      {/* Thông báo & Profile */}
      <View style={styles.rightActions}>
        {/* Bấm vào chuông để mở Modal thông báo */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setIsNotifVisible(true)}
        >
          <Bell size={20} color="#64748b" />
          {/* Chấm đỏ báo hiệu có tin chưa đọc */}
          <View style={styles.notifBadge} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?u=duy" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* --- TÍCH HỢP MODAL THÔNG BÁO TẠI ĐÂY --- */}
      <NotificationDropdown
        isVisible={isNotifVisible}
        onClose={() => setIsNotifVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  menuBtn: { padding: 4 },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, fontSize: 13, color: "#0f172a" },
  rightActions: { flexDirection: "row", alignItems: "center", gap: 15 },
  iconBtn: { position: "relative" },
  notifBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    backgroundColor: "#ef4444",
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#eff6ff",
  },
});

export default Header;
