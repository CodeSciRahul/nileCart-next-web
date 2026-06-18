export const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || "";
};

export const getImageKey = (image) => {
  if (!image || typeof image === "string") return "";
  return image.key || "";
};

export const toStoredImage = ({ fileUrl, key }) => {
  if (!fileUrl?.trim()) {
    throw new Error("Missing file URL after upload.");
  }

  return {
    url: fileUrl.trim(),
    key: key?.trim() || undefined,
  };
};

export const serializeStoredImage = (input) => {
  if (!input) return null;

  const url = typeof input === "string" ? input.trim() : input.url?.trim();
  if (!url) return null;

  const payload = { url };
  const key = typeof input === "object" ? input.key?.trim() : "";
  if (key) payload.key = key;

  return payload;
};
