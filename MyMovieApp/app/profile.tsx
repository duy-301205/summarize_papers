import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  CreditCard,
  Edit3,
  Lock,
  LogOut,
  Mail,
  Shield,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MainLayout from "../components/sci-sum/MainLayout";
import * as api from "../constants/Api";

const Profile = () => {
  const router = useRouter();
  const [is2FA, setIs2FA] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- STATE HIỂN THỊ THÔNG BÁO ---
  const [message, setMessage] = useState({ text: "", type: "" });

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    institution: "",
    researchInterests:
      "Natural Language Processing, Deep Learning, System Design.",
    avatarUrl: null,
  });

  const [pwdData, setPwdData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Tự động ẩn thông báo sau 3 giây
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.getMe();
      if (res.data.code === 200) {
        setProfileData({
          ...profileData,
          username: res.data.data.username,
          email: res.data.data.email,
          institution: res.data.data.institution,
          avatarUrl: res.data.data.avatarUrl,
        });
      }
    } catch (error) {
      console.error("Lỗi fetch profile:", error);
    }
  };

  const handleToggleEdit = async () => {
    if (isEditing) {
      setLoading(true);
      try {
        const res = await api.updateProfile({
          username: profileData.username,
          institution: profileData.institution,
        });
        if (res.data.code === 200) {
          setMessage({ text: "Cập nhật thành công!", type: "success" });
          setIsEditing(false);
        }
      } catch (error: any) {
        setMessage({
          text: error.response?.data?.message || "Cập nhật thất bại!",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleUpdatePassword = async () => {
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setMessage({ text: "Mật khẩu không khớp!", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await api.changePassword(pwdData);
      if (res.data.code === 200) {
        setMessage({ text: "Đã đổi mật khẩu!", type: "success" });
        setTimeout(() => setShowPasswordModal(false), 1000);
        setPwdData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.message || "Lỗi đổi mật khẩu!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      await AsyncStorage.clear();
      router.replace("/auth");
    }
  };

  return (
    <MainLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- HIỂN THỊ MESSAGE TRÊN GIAO DIỆN CHÍNH --- */}
        {message.text !== "" && !showPasswordModal && (
          <View
            style={[
              styles.messageBanner,
              message.type === "success" ? styles.msgSuccess : styles.msgError,
            ]}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={16} color="#059669" />
            ) : (
              <AlertCircle size={16} color="#ef4444" />
            )}
            <Text
              style={[
                styles.messageText,
                message.type === "success"
                  ? { color: "#059669" }
                  : { color: "#ef4444" },
              ]}
            >
              {message.text.toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri:
                    profileData.avatarUrl ||
                    `https://i.pravatar.cc/150?u=${profileData.username}`,
                }}
                style={styles.avatar}
              />
              <TouchableOpacity
                style={[styles.cameraBtn, isEditing && styles.cameraBtnActive]}
                disabled={!isEditing}
              >
                <Camera size={14} color={isEditing ? "#fff" : "#94a3b8"} />
              </TouchableOpacity>
            </View>
            <View style={styles.nameInfo}>
              <Text style={styles.userName}>
                {profileData.username?.toUpperCase() || "USER"}
              </Text>
              <Text style={styles.userSub}>{profileData.email}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.badgeBlue}>
                  <Text style={styles.badgeTextBlue}>AI EXPERT</Text>
                </View>
                <View style={styles.badgeGreen}>
                  <Text style={styles.badgeTextGreen}>PREMIUM</Text>
                </View>
                <TouchableOpacity
                  onPress={handleLogout}
                  style={styles.logoutBtnSmall}
                >
                  <LogOut size={12} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.form}>
            <ProfileInput
              label="USERNAME"
              value={profileData.username}
              onChangeText={(val: string) =>
                setProfileData({ ...profileData, username: val })
              }
              isEditing={isEditing}
            />
            <ProfileInput
              label="EMAIL ADDRESS"
              value={profileData.email}
              icon={<Mail size={16} color="#94a3b8" />}
              isEditing={false}
            />
            <ProfileInput
              label="INSTITUTION"
              value={profileData.institution}
              onChangeText={(val: string) =>
                setProfileData({ ...profileData, institution: val })
              }
              isEditing={isEditing}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>RESEARCH INTERESTS</Text>
              <TextInput
                multiline
                editable={isEditing}
                style={[
                  styles.textArea,
                  isEditing ? styles.inputActive : styles.inputDisabled,
                ]}
                value={profileData.researchInterests}
                onChangeText={(val) =>
                  setProfileData({ ...profileData, researchInterests: val })
                }
              />
            </View>

            <TouchableOpacity
              style={[
                styles.editBtn,
                isEditing ? styles.saveBtn : styles.changeBtn,
              ]}
              onPress={handleToggleEdit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={isEditing ? "#fff" : "#1111d4"} />
              ) : (
                <>
                  <Text
                    style={[
                      styles.editBtnText,
                      isEditing ? { color: "#fff" } : { color: "#1e293b" },
                    ]}
                  >
                    {isEditing ? "SAVE CHANGES" : "CHANGE PROFILE"}
                  </Text>
                  {!isEditing && <Edit3 size={14} color="#1e293b" />}
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsGrid}>
          <SettingCard
            icon={<Shield size={18} color="#1111d4" />}
            title="SECURITY"
          >
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>2FA Auth</Text>
              <Switch
                value={is2FA}
                onValueChange={setIs2FA}
                trackColor={{ false: "#e2e8f0", true: "#1111d4" }}
                thumbColor="#fff"
              />
            </View>
          </SettingCard>

          <SettingCard
            icon={<Lock size={18} color="#1111d4" />}
            title="PASSWORD"
          >
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => {
                setMessage({ text: "", type: "" });
                setShowPasswordModal(true);
              }}
            >
              <Text style={styles.outlineBtnText}>CHANGE PASSWORD</Text>
            </TouchableOpacity>
          </SettingCard>
        </View>

        <View style={styles.billingCard}>
          <View style={styles.billingInfo}>
            <View style={styles.billingIcon}>
              <CreditCard size={24} color="#1111d4" />
            </View>
            <View>
              <Text style={styles.billingTitle}>PRO PLAN</Text>
              <Text style={styles.billingSub}>Next bill: Apr 2026</Text>
            </View>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* --- MODAL ĐỔI MẬT KHẨU --- */}
      <Modal visible={showPasswordModal} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>PASSWORD</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <X size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* HIỂN THỊ THÔNG BÁO NGAY TRONG MODAL */}
            {message.text !== "" && (
              <View
                style={[
                  styles.messageBanner,
                  { marginBottom: 15 },
                  message.type === "success"
                    ? styles.msgSuccess
                    : styles.msgError,
                ]}
              >
                {message.type === "success" ? (
                  <CheckCircle2 size={16} color="#059669" />
                ) : (
                  <AlertCircle size={16} color="#ef4444" />
                )}
                <Text
                  style={[
                    styles.messageText,
                    message.type === "success"
                      ? { color: "#059669" }
                      : { color: "#ef4444" },
                  ]}
                >
                  {message.text.toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.modalForm}>
              <ModalInput
                label="CURRENT"
                placeholder="••••••••"
                secureTextEntry
                value={pwdData.oldPassword}
                onChangeText={(val: string) =>
                  setPwdData({ ...pwdData, oldPassword: val })
                }
              />
              <ModalInput
                label="NEW"
                placeholder="••••••••"
                secureTextEntry
                value={pwdData.newPassword}
                onChangeText={(val: string) =>
                  setPwdData({ ...pwdData, newPassword: val })
                }
              />
              <ModalInput
                label="CONFIRM"
                placeholder="••••••••"
                secureTextEntry
                value={pwdData.confirmPassword}
                onChangeText={(val: string) =>
                  setPwdData({ ...pwdData, confirmPassword: val })
                }
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.updateBtn}
                  onPress={handleUpdatePassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.updateBtnText}>UPDATE</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </MainLayout>
  );
};

// --- HELPERS ---
const ProfileInput = ({ label, icon, isEditing, ...props }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      {icon && <View style={styles.inputIcon}>{icon}</View>}
      <TextInput
        editable={isEditing}
        style={[
          styles.input,
          isEditing ? styles.inputActive : styles.inputDisabled,
          icon && { paddingLeft: 40 },
        ]}
        {...props}
      />
    </View>
  </View>
);

const SettingCard = ({ icon, title, children }: any) => (
  <View style={styles.settingCard}>
    <View style={styles.settingHeader}>
      {icon}
      <Text style={styles.settingTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const ModalInput = ({ label, ...props }: any) => (
  <View style={{ marginBottom: 15 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.modalInput}
      placeholderTextColor="#cbd5e1"
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  scrollContent: { padding: 20 },

  // MESSAGE STYLES
  messageBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    gap: 10,
  },
  msgSuccess: { backgroundColor: "#ecfdf5", borderColor: "#a7f3d0" },
  msgError: { backgroundColor: "#fef2f2", borderColor: "#fecaca" },
  messageText: { fontSize: 10, fontWeight: "900", letterSpacing: 1 },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  avatarWrapper: { position: "relative" },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#f8fafc",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#f1f5f9",
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  cameraBtnActive: { backgroundColor: "#1111d4" },
  nameInfo: { alignItems: "center", marginTop: 15 },
  userName: { fontSize: 22, fontWeight: "900", color: "#0f172a" },
  userSub: { fontSize: 13, color: "#64748b", marginTop: 4 },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    alignItems: "center",
  },
  badgeBlue: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  badgeTextBlue: { color: "#1111d4", fontSize: 9, fontWeight: "900" },
  badgeGreen: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },
  badgeTextGreen: { color: "#059669", fontSize: 9, fontWeight: "900" },
  logoutBtnSmall: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
  },

  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: {
    fontSize: 10,
    fontWeight: "900",
    color: "#94a3b8",
    letterSpacing: 1,
  },
  inputContainer: { position: "relative", justifyContent: "center" },
  inputIcon: { position: "absolute", left: 12, zIndex: 1 },
  input: {
    padding: 14,
    borderRadius: 16,
    fontSize: 14,
    fontWeight: "700",
    borderWidth: 1,
  },
  inputActive: {
    backgroundColor: "#fff",
    borderColor: "#1111d4",
    color: "#0f172a",
  },
  inputDisabled: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    color: "#64748b",
  },
  textArea: {
    height: 80,
    padding: 14,
    borderRadius: 16,
    textAlignVertical: "top",
    fontWeight: "600",
    borderWidth: 1,
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    gap: 10,
    marginTop: 10,
  },
  saveBtn: { backgroundColor: "#1111d4" },
  changeBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  editBtnText: { fontWeight: "900", fontSize: 12 },

  settingsGrid: { flexDirection: "row", gap: 12, marginTop: 20 },
  settingCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
  },
  settingTitle: { fontSize: 11, fontWeight: "900", color: "#0f172a" },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleLabel: { fontSize: 12, fontWeight: "700", color: "#1e293b" },
  settingDesc: { fontSize: 10, color: "#64748b", marginBottom: 12 },
  outlineBtn: {
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  outlineBtnText: { fontSize: 9, fontWeight: "900", color: "#475569" },

  billingCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 6,
    borderLeftColor: "#1111d4",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  billingInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  billingIcon: { backgroundColor: "#eff6ff", padding: 10, borderRadius: 12 },
  billingTitle: {
    fontSize: 15,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#0f172a",
  },
  billingSub: { fontSize: 12, color: "#64748b" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { backgroundColor: "#fff", borderRadius: 32, padding: 24 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  modalTitle: { fontSize: 18, fontWeight: "900", color: "#0f172a" },
  modalForm: { gap: 10 },
  modalInput: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    fontSize: 14,
    color: "#0f172a",
  },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 20 },
  updateBtn: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#1111d4",
  },
  updateBtnText: { fontWeight: "900", color: "#fff" },
});

export default Profile;
