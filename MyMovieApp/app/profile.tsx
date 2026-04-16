import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Camera,
  Mail,
  Shield,
  Lock,
  CreditCard,
  Edit3,
  X,
  ChevronRight,
} from "lucide-react-native";
import MainLayout from "../components/sci-sum/MainLayout";

const Profile = () => {
  const [is2FA, setIs2FA] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <MainLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- PROFILE CARD --- */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?u=duy" }}
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
              <Text style={styles.userName}>DUYHOANG</Text>
              <Text style={styles.userSub}>Researcher Pro • Jan 2026</Text>
              <View style={styles.badgeRow}>
                <View style={styles.badgeBlue}>
                  <Text style={styles.badgeTextBlue}>AI EXPERT</Text>
                </View>
                <View style={styles.badgeGreen}>
                  <Text style={styles.badgeTextGreen}>PREMIUM</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.form}>
            <ProfileInput
              label="USERNAME"
              defaultValue="DuyHoang"
              isEditing={isEditing}
            />
            <ProfileInput
              label="EMAIL ADDRESS"
              defaultValue="m.duy@vnu.edu.vn"
              icon={<Mail size={16} color="#94a3b8" />}
              isEditing={isEditing}
              keyboardType="email-address"
            />
            <ProfileInput
              label="INSTITUTION"
              defaultValue="VNU University of Science"
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
                defaultValue="Natural Language Processing, Deep Learning, System Design."
              />
            </View>

            <TouchableOpacity
              style={[
                styles.editBtn,
                isEditing ? styles.saveBtn : styles.changeBtn,
              ]}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Text
                style={[
                  styles.editBtnText,
                  isEditing ? { color: "#fff" } : { color: "#1e293b" },
                ]}
              >
                {isEditing ? "SAVE CHANGES" : "CHANGE PROFILE"}
              </Text>
              {!isEditing && <Edit3 size={14} color="#1e293b" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* --- SETTINGS GRID --- */}
        <View style={styles.settingsGrid}>
          <SettingCard
            icon={<Shield size={18} color="#1111d4" />}
            title="SECURITY"
          >
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Two-Factor Auth</Text>
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
            <Text style={styles.settingDesc}>
              Update password to stay secure.
            </Text>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => setShowPasswordModal(true)}
            >
              <Text style={styles.outlineBtnText}>CHANGE PASSWORD</Text>
            </TouchableOpacity>
          </SettingCard>
        </View>

        {/* --- BILLING CARD --- */}
        <View style={styles.billingCard}>
          <View style={styles.billingInfo}>
            <View style={styles.billingIcon}>
              <CreditCard size={24} color="#1111d4" />
            </View>
            <View>
              <Text style={styles.billingTitle}>RESEARCHER PRO</Text>
              <Text style={styles.billingSub}>Next bill: April 12, 2026</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.manageBtn}>
            <Text style={styles.manageBtnText}>MANAGE</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* --- PASSWORD MODAL --- */}
      <Modal visible={showPasswordModal} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>CHANGE PASSWORD</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <X size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalForm}>
              <ModalInput
                label="CURRENT PASSWORD"
                placeholder="••••••••"
                secureTextEntry
              />
              <ModalInput
                label="NEW PASSWORD"
                placeholder="••••••••"
                secureTextEntry
              />
              <ModalInput
                label="CONFIRM NEW PASSWORD"
                placeholder="••••••••"
                secureTextEntry
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowPasswordModal(false)}
                >
                  <Text style={styles.cancelBtnText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.updateBtn}
                  onPress={() => setShowPasswordModal(false)}
                >
                  <Text style={styles.updateBtnText}>UPDATE</Text>
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
    pb: 20,
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
  userName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  userSub: { fontSize: 13, color: "#64748b", marginTop: 4 },
  badgeRow: { flexDirection: "row", gap: 8, marginTop: 12 },
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

  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: {
    fontSize: 10,
    fontWeight: "900",
    color: "#94a3b8",
    letterSpacing: 1,
    marginLeft: 4,
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
    justifyContent: "space-between",
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
  manageBtn: {
    backgroundColor: "#0f172a",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  manageBtnText: { color: "#fff", fontSize: 10, fontWeight: "900" },

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
  },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 20 },
  cancelBtn: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
  },
  cancelBtnText: { fontWeight: "700", color: "#64748b" },
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
