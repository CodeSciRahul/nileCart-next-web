"use client";

import axios from "axios";
import {appConfig} from "@/config";

const API_URL = appConfig.serverApiUrl || "/api";
const TOKEN_KEY = "saavana_token";

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data || {};
    const status = error.response?.status;

    let message = data.message;

    if (!message) {
      if (!status && error.message === "Network Error") {
        message = "Unable to connect. Check your internet connection.";
      } else if (status === 401) {
        message = "Session expired. Please sign in again.";
      } else if (status === 403) {
        message = "You don't have permission to perform this action.";
      } else if (status === 404) {
        message = "Resource not found.";
      } else if (status >= 500) {
        message = "Server error. Please try again later.";
      } else {
        message = `Request failed (${status || "network"})`;
      }
    }

    const apiError = new Error(message);
    apiError.status = status;
    apiError.data = data;
    return Promise.reject(apiError);
  }
);
