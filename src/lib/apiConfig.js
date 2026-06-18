const trimTrailingSlash = (value) => value?.trim().replace(/\/$/, "") ?? "";

const readEnv = (key) => {
  const value = process.env[key];
  return typeof value === "string" ? value.trim() : undefined;
};

/**
 * Server-side API base URL (SSR, Server Components).
 * Requires API_URL or NEXT_PUBLIC_API_URL in environment.
 */
export const getServerApiBaseUrl = () => {
  const apiUrl = readEnv("API_URL") || readEnv("NEXT_PUBLIC_API_URL");

  if (!apiUrl) {
    throw new Error(
      "Missing API_URL. Set API_URL in your .env file."
    );
  }

  return trimTrailingSlash(apiUrl);
};

/**
 * Browser/client API base URL.
 * Defaults to /api so requests can be proxied via next.config rewrites.
 */
export const getClientApiBaseUrl = () => {
  const clientUrl = readEnv("NEXT_PUBLIC_API_URL");
  return clientUrl ? trimTrailingSlash(clientUrl) : "/api";
};

/**
 * Rewrite target for next.config.mjs (/api/* → backend).
 * Uses API_URL, then API_REWRITE_TARGET, then NEXT_PUBLIC_API_URL.
 */
export const getApiRewriteTarget = () => {
  const target =
    readEnv("API_URL") ||
    readEnv("API_REWRITE_TARGET") ||
    readEnv("NEXT_PUBLIC_API_URL");

  return target ? trimTrailingSlash(target) : null;
};
