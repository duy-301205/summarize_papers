import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Beaker, LogIn } from "lucide-react-native";
import { useRouter } from "expo-router";

const Navbar = () => {
  const router = useRouter(); // 2. Khởi tạo router

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        {/* Logo Section - Bấm vào quay về trang chủ */}
        <TouchableOpacity
          style={styles.logoContainer}
          activeOpacity={0.8}
          onPress={() => router.push("/")}
        >
          <View style={styles.logoIcon}>
            <Beaker size={20} color="#fff" strokeWidth={2.5} />
          </View>
          <Text style={styles.logoText}>SciSum AI</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push("/auth")} // 3. Chuyển sang app/auth.tsx
          >
            <LogIn size={18} color="#1111d4" />
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: "rgba(246, 246, 248, 0.8)",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoIcon: {
    bg: "#1111d4",
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#1111d4",
    shadowColor: "#1111d4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#0f172a",
  },
  actions: { flexDirection: "row", alignItems: "center" },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    padding: 8,
  },
  loginText: {
    color: "#1111d4",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 14,
  },
});

export default Navbar;
