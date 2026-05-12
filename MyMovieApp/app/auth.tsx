import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Beaker,
  Building2,
  ChevronLeft,
  Lock,
  Mail,
  User,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as api from "../constants/Api";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    institution: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetToken, setResetToken] = useState("");

  const [forgotStep, setForgotStep] = useState("none");
  const [otp, setOtp] = useState(new Array(6).fill(""));

  // Sửa lỗi gạch đỏ bằng cách định nghĩa kiểu cho useRef
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      // Dùng optional chaining ?. để an toàn
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (forgotStep === "none") {
        if (isLogin) {
          const res = await api.login({
            email: formData.email,
            password: formData.password,
          });
          if (res.data.code === 200) {
            await AsyncStorage.setItem(
              "accessToken",
              res.data.data.accessToken,
            );
            await AsyncStorage.setItem(
              "refreshToken",
              res.data.data.refreshToken,
            );
            router.replace("/dashboard");
          }
        } else {
          const res = await api.register({
            email: formData.email,
            password: formData.password,
            username: formData.username,
            institution: formData.institution,
          });
          if (res.data.code === 200) {
            Alert.alert("Thành công", "Đăng ký thành công!");
            setIsLogin(true);
          }
        }
      } else if (forgotStep === "email") {
        const res = await api.sendOtp(formData.email);
        if (res.data.code === 200) {
          setForgotStep("otp");
        }
      } else if (forgotStep === "otp") {
        const res = await api.verifyOtp({
          email: formData.email,
          otp: otp.join(""),
        });
        if (res.data.code === 200) {
          setResetToken(res.data.data.resetToken);
          setForgotStep("reset");
        }
      } else if (forgotStep === "reset") {
        const res = await api.resetPassword({
          email: formData.email,
          resetToken: resetToken,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        });
        if (res.data.code === 200) {
          Alert.alert("Thành công", "Đổi mật khẩu thành công!");
          setForgotStep("none");
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra!";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrapper}>
            <TouchableOpacity
              onPress={() => router.push("/")}
              style={styles.logoRow}
            >
              <View style={styles.logoBox}>
                <Beaker size={20} color="#fff" />
              </View>
              <Text style={styles.logoText}>SciSum AI</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formCard}>
            <View style={styles.titleSection}>
              {forgotStep !== "none" && (
                <TouchableOpacity
                  onPress={() => setForgotStep("none")}
                  style={styles.backBtn}
                >
                  <ChevronLeft size={24} color="#94a3b8" />
                </TouchableOpacity>
              )}
              <View>
                <Text style={styles.h2}>
                  {forgotStep === "none"
                    ? isLogin
                      ? "Log In"
                      : "Create account"
                    : forgotStep === "email"
                      ? "Reset Password"
                      : forgotStep === "otp"
                        ? "Verify OTP"
                        : "New Password"}
                </Text>
                <Text style={styles.subtitle}>
                  {forgotStep === "none"
                    ? isLogin
                      ? "Enter your credentials."
                      : "Start your 14-day trial."
                    : "Follow the steps to secure account."}
                </Text>
              </View>
            </View>

            <View style={styles.form}>
              {forgotStep === "none" ? (
                <>
                  {!isLogin && (
                    <>
                      <InputGroup
                        label="Username"
                        placeholder="Hoàng Mạnh Duy"
                        icon={<User size={18} color="#94a3b8" />}
                        value={formData.username}
                        onChangeText={(v) => handleInputChange("username", v)}
                      />
                      <InputGroup
                        label="Institution"
                        placeholder="VNU-HUS"
                        icon={<Building2 size={18} color="#94a3b8" />}
                        value={formData.institution}
                        onChangeText={(v) =>
                          handleInputChange("institution", v)
                        }
                      />
                    </>
                  )}
                  <InputGroup
                    label="Work Email"
                    placeholder="duy.hm@vnu.edu.vn"
                    icon={<Mail size={18} color="#94a3b8" />}
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(v) => handleInputChange("email", v)}
                  />
                  <InputGroup
                    label="Password"
                    placeholder="••••••••"
                    icon={<Lock size={18} color="#94a3b8" />}
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(v) => handleInputChange("password", v)}
                  />
                  {isLogin && (
                    <TouchableOpacity
                      onPress={() => setForgotStep("email")}
                      style={styles.forgotBtn}
                    >
                      <Text style={styles.forgotBtnText}>Forgot password?</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : forgotStep === "email" ? (
                <InputGroup
                  label="Email Address"
                  placeholder="duy.hm@vnu.edu.vn"
                  icon={<Mail size={18} color="#94a3b8" />}
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(v) => handleInputChange("email", v)}
                />
              ) : forgotStep === "otp" ? (
                <View style={styles.otpRow}>
                  {otp.map((data, index) => (
                    <TextInput
                      key={index}
                      style={styles.otpInput}
                      keyboardType="number-pad"
                      maxLength={1}
                      ref={(el) => (otpRefs.current[index] = el)}
                      value={data}
                      onChangeText={(v) => handleOtpChange(v, index)}
                    />
                  ))}
                </View>
              ) : (
                <>
                  <InputGroup
                    label="New Password"
                    placeholder="••••••••"
                    icon={<Lock size={18} color="#94a3b8" />}
                    secureTextEntry
                    value={formData.newPassword}
                    onChangeText={(v) => handleInputChange("newPassword", v)}
                  />
                  <InputGroup
                    label="Confirm Password"
                    placeholder="••••••••"
                    icon={<Lock size={18} color="#94a3b8" />}
                    secureTextEntry
                    value={formData.confirmPassword}
                    onChangeText={(v) =>
                      handleInputChange("confirmPassword", v)
                    }
                  />
                </>
              )}

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>
                      {forgotStep === "none"
                        ? isLogin
                          ? "Log In"
                          : "Create Account"
                        : forgotStep === "email"
                          ? "Send OTP"
                          : forgotStep === "otp"
                            ? "Verify Code"
                            : "Update Password"}
                    </Text>
                    <ArrowRight size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {forgotStep === "none" && (
              <View style={styles.switchBox}>
                <Text style={styles.switchText}>
                  {isLogin ? "New to SciSum AI? " : "Already have an account? "}
                </Text>
                <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                  <Text style={styles.linkText}>
                    {isLogin ? "Create account" : "Log in here"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Định nghĩa Interface để hết gạch đỏ ở InputGroup
interface InputGroupProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChangeText: (text: string) => void;
  [key: string]: any; // Cho phép các props khác như placeholder, secureTextEntry...
}

const InputGroup = ({
  label,
  icon,
  value,
  onChangeText,
  ...props
}: InputGroupProps) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <View style={styles.inputIcon}>{icon}</View>
      <TextInput
        style={styles.input}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f8" },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: "center",
  },
  logoWrapper: { alignItems: "center", marginBottom: 25 },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoBox: { backgroundColor: "#1111d4", padding: 6, borderRadius: 8 },
  logoText: {
    color: "#0f172a",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 24,
    shadowColor: "#1111d4",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backBtn: { marginRight: 12 },
  h2: { fontSize: 26, fontWeight: "bold", color: "#0f172a" },
  subtitle: { color: "#64748b", marginTop: 4, fontSize: 14 },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: "bold", color: "#334155", marginLeft: 4 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: "#0f172a" },
  forgotBtn: { alignSelf: "flex-end" },
  forgotBtnText: { color: "#1111d4", fontSize: 12, fontWeight: "bold" },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  otpInput: {
    width: 42,
    height: 50,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#1111d4",
  },
  submitBtn: {
    backgroundColor: "#1111d4",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    marginTop: 10,
    gap: 10,
  },
  submitBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  switchBox: { flexDirection: "row", justifyContent: "center", marginTop: 25 },
  switchText: { color: "#64748b", fontSize: 14 },
  linkText: { color: "#1111d4", fontWeight: "bold", fontSize: 14 },
});

export default Auth;
