import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header cố định */}
      <Header onOpenMenu={toggleMenu} />

      {/* Nội dung trang */}
      <View style={styles.content}>{children}</View>

      {/* Sidebar Modal */}
      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="fade" // Bạn có thể đổi thành "none" nếu muốn dùng Animated tay
        onRequestClose={toggleMenu}
      >
        <View style={styles.overlay}>
          {/* 1. SIDEBAR CONTAINER ĐƯỢC ĐƯA LÊN TRƯỚC ĐỂ NẰM BÊN TRÁI */}
          <View style={styles.sidebarContainer}>
            <Sidebar />
          </View>

          {/* 2. BACKDROP (Vùng mờ) NẰM SAU ĐỂ CHIẾM PHẦN CÒN LẠI BÊN PHẢI */}
          <TouchableWithoutFeedback onPress={toggleMenu}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f8",
  },
  content: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    flexDirection: "row", // Sắp xếp theo chiều ngang
  },
  backdrop: {
    flex: 1, // Chiếm toàn bộ phần diện tích còn lại bên phải
    backgroundColor: "rgba(15, 23, 42, 0.5)",
  },
  sidebarContainer: {
    width: "80%", // Sidebar chiếm 80% chiều ngang từ bên trái sang
    height: "100%",
    backgroundColor: "#fff",
    elevation: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});

export default MainLayout;
