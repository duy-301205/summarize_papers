import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8085/api",
    timeout: 300000,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const sendOtp = (email) => API.post("/auth/forgot-password/send-otp", { email });
export const verifyOtp = (data) => API.post("/auth/forgot-password/verify-otp", data);
export const resetPassword = (data) => API.post("/auth/forgot-password/reset", data);

export const logout = () => API.post("/auth/logout");

export const getMe = () => API.get("/users/me");
export const updateProfile = (data) => API.put("/users/me", data);
export const changePassword = (data) => API.put("/users/change-password", data);

export const uploadPaper = (formData) => {
    return API.post("/papers/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
export const getPaperDetails = (paperId) => API.get(`/papers/upload/${paperId}`);
export const getPaperChunks = (paperId, page = 0, size = 100) =>
    API.get(`/papers/chunks/${paperId}?page=${page}&size=${size}`);
export const getPaperSummary = (paperId) => API.get(`/papers/summary/${paperId}`);

export const getMyPapers = (page = 0, size = 10) => {
    return API.get(`/papers/getPaper?page=${page}&size=${size}`);
};