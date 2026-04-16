import React from "react";
import { View, Text, StyleSheet } from "react-native";
// Phải là lucide-react-native
import { Beaker, Twitter, Linkedin, Github } from "lucide-react-native";

const Footer = () => {
  return (
    <View style={styles.footer}>
      <View style={styles.brand}>
        <View style={styles.logoBox}>
          {/* Kiểm tra an toàn: chỉ render khi Beaker tồn tại */}
          {Beaker && <Beaker size={20} color="#fff" strokeWidth={2.5} />}
        </View>
        <Text style={styles.brandText}>SciSum AI</Text>
      </View>

      <Text style={styles.desc}>
        Empowering the scientific community through AI.
      </Text>

      <View style={styles.socials}>
        {Twitter && <Twitter size={20} color="#94a3b8" />}
        {Linkedin && <Linkedin size={20} color="#94a3b8" />}
        {Github && <Github size={20} color="#94a3b8" />}
      </View>

      <View style={styles.divider} />

      <Text style={styles.copyright}>
        © 2026 SciSum AI. All rights reserved.
      </Text>
      <Text style={styles.author}>
        HOÀNG MẠNH DUY — VNU UNIVERSITY OF SCIENCE
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 40,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    paddingBottom: 60, // Thêm padding để tránh dính tai thỏ dưới
  },
  brand: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  logoBox: {
    backgroundColor: "#1111d4", // Đã sửa từ 'bg' thành 'backgroundColor'
    padding: 6,
    borderRadius: 8,
  },
  brandText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#0f172a",
  },
  desc: {
    color: "#64748b",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 25,
  },
  socials: { flexDirection: "row", gap: 30, marginBottom: 30 },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 20,
  },
  copyright: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 5,
    textAlign: "center",
  },
  author: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94a3b8",
    letterSpacing: 1,
    textAlign: "center",
  },
});

export default Footer;
