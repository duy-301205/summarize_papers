import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// 1. THAY ĐỔI BASE_URL: Dùng IP của máy tính thay vì localhost
// Dựa vào Metro của bạn, IP là 192.168.0.100
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.104:8085/api";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 200000,
});

// 2. INTERCEPTOR: Thay localStorage bằng AsyncStorage
API.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error("Lỗi lấy token:", e);
  }
  return config;
});

// --- AUTH API ---
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const sendOtp = (email) =>
  API.post("/auth/forgot-password/send-otp", { email });
export const verifyOtp = (data) =>
  API.post("/auth/forgot-password/verify-otp", data);
export const resetPassword = (data) =>
  API.post("/auth/forgot-password/reset", data);
export const logout = async () => {
  await AsyncStorage.removeItem("accessToken"); // Xóa token khi logout
  return API.post("/auth/logout");
};

// --- USER API ---
export const getMe = () => API.get("/users/me");
export const updateProfile = (data) => API.put("/users/me", data);
export const changePassword = (data) => API.put("/users/change-password", data);

// --- PAPER API ---
export const uploadPaper = (formData) => {
  // Lưu ý: Khi gọi hàm này, formData trên Mobile cần có cấu hình:
  // { uri: ..., name: ..., type: 'application/pdf' }
  return API.post("/papers/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getPaperDetails = (paperId) =>
  API.get(`/papers/upload/${paperId}`);
export const getPaperChunks = (paperId, page = 0, size = 100) =>
  API.get(`/papers/chunks/${paperId}?page=${page}&size=${size}`);
export const getPaperSummary = (paperId) =>
  API.get(`/papers/summary/${paperId}`);
export const getMyPapers = (page = 0, size = 10) => {
  return API.get(`/papers/getPaper?page=${page}&size=${size}`);
};

// --- ANALYTICS API ---
export const getDashboardSummary = () => API.get("/analytics/summary");
export const getVolumeChartData = () => API.get("/analytics/volume");
export const getTopicsChartData = () => API.get("/analytics/topics");

// --- CHAT API ---
export const askQuestion = (data) => API.post("/chat/ask", data);
export const getChatHistory = (conversationId) =>
  API.get(`/chat/history/${conversationId}`);
export const getPaperConversations = (paperId) =>
  API.get(`/chat/conversations/${paperId}`);

export const deletePaper = (id) => API.delete(`/papers/${id}`);

export default API;
