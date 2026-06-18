import { apiClient } from "../util/api.js";
import {
  ALLOWED_IMAGE_TYPES,
  UPLOAD_FOLDERS,
} from "../lib/uploadConstants.js";

const normalizeContentType = (file) => {
  const type = file.type?.toLowerCase();
  return type === "image/jpg" ? "image/jpeg" : type;
};

export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, message: "No file selected." };
  }

  const contentType = normalizeContentType(file);

  if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
    return {
      valid: false,
      message: "Invalid file type. Allowed types: JPEG, JPG, PNG, WEBP.",
    };
  }

  return { valid: true, contentType };
};

export const requestPresignedUploadUrl = async ({
  fileName,
  contentType,
  folder = UPLOAD_FOLDERS.PROFILES,
}) =>
  apiClient.post("/uploads/presign", {
    fileName,
    contentType,
    folder,
  });

export const deleteUploadedImage = (key) =>
  apiClient.delete("/uploads/delete", { data: { key } });

export const putFileToS3 = async ({ uploadUrl, file, contentType, onProgress }) => {
  if (typeof onProgress === "function") {
    onProgress(10);
  }

  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": contentType,
    },
  });

  if (typeof onProgress === "function") {
    onProgress(100);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(body || `Failed to upload image (${response.status}).`);
  }
};

export const uploadImage = async (
  file,
  { folder = UPLOAD_FOLDERS.PROFILES, onProgress } = {}
) => {
  const validation = validateImageFile(file);

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  if (typeof onProgress === "function") {
    onProgress(0);
  }

  const presign = await requestPresignedUploadUrl({
    fileName: file.name,
    contentType: validation.contentType,
    folder,
  });

  if (typeof onProgress === "function") {
    onProgress(30);
  }

  await putFileToS3({
    uploadUrl: presign.uploadUrl,
    file,
    contentType: validation.contentType,
    onProgress: (value) => {
      if (typeof onProgress === "function") {
        onProgress(30 + Math.round(value * 0.7));
      }
    },
  });

  return {
    fileUrl: presign.fileUrl,
    key: presign.key,
  };
};
