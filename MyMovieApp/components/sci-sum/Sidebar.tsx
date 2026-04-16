import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  Beaker,
  UploadCloud,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { label: "Upload Article", icon: UploadCloud, href: "/upload" },
    { label: "My Summaries", icon: FileText, href: "/summaries" },
    { label: "Analytics", icon: BarChart3, href: "/dashboard" },
    { label: "Settings Profile", icon: Settings, href: "/profile" },
  ];

  return (
    <View style={styles.sidebar}>
      {/* Brand Header */}
      <View style={styles.brand}>
        <View style={styles.logoBox}>
          <Beaker size={24} color="#fff" strokeWidth={2.5} />
        </View>
        <View>
          <Text style={styles.brandTitle}>SCISUM AI</Text>
          <Text style={styles.brandSub}>Research Hub</Text>
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <TouchableOpacity
              key={item.href}
              onPress={() => router.push(item.href as any)}
              style={[styles.navItem, isActive && styles.navItemActive]}
            >
              <Icon size={20} color={isActive ? "#1111d4" : "#64748b"} />
              <Text
                style={[styles.navLabel, isActive && styles.navLabelActive]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Storage & Logout */}
      <View style={styles.footer}>
        <View style={styles.storageBox}>
          <Text style={styles.storageText}>STORAGE USAGE</Text>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: "65%" }]} />
          </View>
          <Text style={styles.storageDetail}>12.4 GB / 20 GB</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace("/auth")}
        >
          <LogOut size={18} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: { flex: 1, backgroundColor: "#fff", padding: 20 },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 40,
    marginTop: 20,
  },
  logoBox: { backgroundColor: "#1111d4", padding: 8, borderRadius: 12 },
  brandTitle: { fontSize: 18, fontWeight: "bold", color: "#0f172a" },
  brandSub: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94a3b8",
    letterSpacing: 1,
  },

  nav: { flex: 1, gap: 8 },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  navItemActive: { backgroundColor: "#eff6ff" },
  navLabel: { fontSize: 14, fontWeight: "600", color: "#64748b" },
  navLabelActive: { color: "#1111d4" },

  footer: { borderTopWidth: 1, borderColor: "#f1f5f9", paddingTop: 20 },
  storageBox: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  storageText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94a3b8",
    marginBottom: 8,
  },
  progressBg: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: { height: 6, backgroundColor: "#1111d4", borderRadius: 3 },
  storageDetail: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },
  logoutText: { color: "#ef4444", fontWeight: "bold", fontSize: 14 },
});

export default Sidebar;
