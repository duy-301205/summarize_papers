import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react-native";

// Giả lập DATA Duy gửi (Duy có thể import từ file data thực tế)
const NOTIFICATIONS_DATA = [
  {
    id: 1,
    type: "success",
    title: "Summary Ready",
    desc: "Your paper analysis is complete.",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    type: "comment",
    title: "New Lab Comment",
    desc: "Dr. Elena left a note on your research.",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    type: "error",
    title: "Upload Failed",
    desc: "The file format is not supported.",
    time: "3h ago",
    unread: false,
  },
];

const NotificationDropdown = ({ isVisible, onClose }: any) => {
  const renderIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} color="#059669" />;
      case "comment":
        return <MessageSquare size={18} color="#1111d4" />;
      case "error":
        return <AlertCircle size={18} color="#ef4444" />;
      default:
        return <RefreshCw size={18} color="#64748b" />;
    }
  };

  const unreadCount = NOTIFICATIONS_DATA.filter((n) => n.unread).length;

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Thông báo</Text>
              <Text style={styles.subtitle}>
                Bạn có {unreadCount} tin nhắn mới
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* List */}
          <ScrollView style={styles.list}>
            {NOTIFICATIONS_DATA.map((noti) => (
              <TouchableOpacity
                key={noti.id}
                style={[styles.item, !noti.unread && styles.readItem]}
              >
                {noti.unread && <View style={styles.unreadIndicator} />}

                <View
                  style={[
                    styles.iconBox,
                    noti.type === "success"
                      ? { backgroundColor: "#ecfdf5" }
                      : noti.type === "comment"
                        ? { backgroundColor: "#eff6ff" }
                        : noti.type === "error"
                          ? { backgroundColor: "#fef2f2" }
                          : { backgroundColor: "#f1f5f9" },
                  ]}
                >
                  {renderIcon(noti.type)}
                </View>

                <View style={styles.itemContent}>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {noti.title}
                    </Text>
                    <Text style={styles.itemTime}>{noti.time}</Text>
                  </View>
                  <Text style={styles.itemDesc} numberOfLines={2}>
                    {noti.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <TouchableOpacity style={styles.footer}>
            <Text style={styles.footerText}>XEM TẤT CẢ THÔNG BÁO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: Dimensions.get("window").height * 0.7,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  title: { fontSize: 18, fontWeight: "900", color: "#0f172a" },
  subtitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  closeBtn: { backgroundColor: "#f8fafc", padding: 8, borderRadius: 12 },

  list: { padding: 12 },
  item: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    marginBottom: 8,
    backgroundColor: "#fff",
    position: "relative",
    overflow: "hidden",
  },
  readItem: { opacity: 0.6 },
  unreadIndicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#1111d4",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContent: { flex: 1, marginLeft: 12 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: { fontSize: 14, fontWeight: "bold", color: "#0f172a" },
  itemTime: { fontSize: 10, color: "#94a3b8" },
  itemDesc: { fontSize: 12, color: "#64748b", marginTop: 4, lineHeight: 18 },

  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#1111d4",
    letterSpacing: 1,
  },
});

export default NotificationDropdown;
