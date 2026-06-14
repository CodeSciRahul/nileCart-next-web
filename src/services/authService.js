import { apiClient, setStoredToken } from "../util/api.js";

export const syncBackendSession = async (firebaseToken) => {
  const data = await apiClient.post("/auth/login", { token: firebaseToken });

  if (data.token) {
    setStoredToken(data.token);
  }

  return data;
};

export const fetchProfile = () => apiClient.get("/users/me");

export const updateUserProfile = (profile) =>
  apiClient.put("/users/me", profile);

export const logoutFromBackend = () => apiClient.post("/auth/logout");
