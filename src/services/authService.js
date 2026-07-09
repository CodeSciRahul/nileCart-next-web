import { apiClient, setStoredToken } from "../util/api.js";

export const sendOtp = (email) =>
  apiClient.post("/auth/send-otp", { email });

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
