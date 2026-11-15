import { apiClient, setStoredToken } from "../util/api.js";

export const sendOtp = (email) =>
  apiClient.post("/auth/send-otp", { email });

export const lookupAuthMethods = (email) =>
  apiClient.post("/auth/lookup", { email, role: "customer" });

export const loginWithPassword = async ({ email, password }) => {
  const data = await apiClient.post("/auth/login", { email, password });
  if (data.token) {
    setStoredToken(data.token);
  }
  return data;
};

export const setPassword = ({ password, confirmPassword }) =>
  apiClient.post("/auth/set-password", { password, confirmPassword });

export const changePassword = ({ currentPassword, newPassword, confirmPassword }) =>
  apiClient.post("/auth/change-password", { currentPassword, newPassword, confirmPassword });

export const sendForgotPasswordOtp = (email) =>
  apiClient.post("/auth/forgot-password/send-otp", { email, role: "customer" });

export const verifyForgotPasswordOtp = ({ email, otp }) =>
  apiClient.post("/auth/forgot-password/verify-otp", { email, otp });

export const resetPassword = ({
  resetToken,
  email,
  otp,
  newPassword,
  confirmPassword,
}) =>
  apiClient.post("/auth/forgot-password/reset", {
    resetToken,
    email,
    otp,
    newPassword,
    confirmPassword,
  });

export const verifyOtp = async ({ email, otp }) => {
  const data = await apiClient.post("/auth/verify-otp", { email, otp });

  if (data.token) {
    setStoredToken(data.token);
  }

  return data;
};

export const fetchProfile = () => apiClient.get("/users/me");

export const updateUserProfile = (profile) =>
  apiClient.put("/users/me", profile);

export const deleteAccount = () => apiClient.delete("/users/me");

export const logoutFromBackend = () => apiClient.post("/auth/logout");
