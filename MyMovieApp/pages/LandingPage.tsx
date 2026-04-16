import React from "react";
import { ScrollView, StyleSheet } from "react-native";
// Nên dùng SafeAreaView từ thư viện này để xử lý tai thỏ tốt hơn
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../components/sci-sum/Navbar";
import Hero from "../components/sci-sum/Hero";
import Footer from "../components/sci-sum/Footer";

const LandingPage = () => {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Navbar />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Hero />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f6f6f8",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default LandingPage;
