import { cookies } from "next/headers";
import { getServerApiBaseUrl } from "./apiConfig.js";

const buildApiError = (data, status) => {
  const error = new Error(data?.message || `Request failed (${status})`);
  error.status = status;
  error.data = data;
  return error;
};

/**
 * Server-side GET with ISR-friendly caching.
 * Authenticated requests stay uncached (user-specific).
 */
export async function serverGet(path, options = {}) {
  const {
    authenticated = false,
    revalidate = 60,
    tags = [],
    cache,
  } = options;
  const headers = { "Content-Type": "application/json" };

  if (authenticated) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      headers.Cookie = `token=${token}`;
    }
  }

  const fetchCache =
    cache ||
    (authenticated
      ? "no-store"
      : undefined);

  const response = await fetch(`${getServerApiBaseUrl()}${path}`, {
    headers,
    ...(fetchCache
      ? { cache: fetchCache }
      : {
          next: {
            revalidate,
            ...(tags.length ? { tags } : {}),
          },
        }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw buildApiError(data, response.status);
  }

  return data;
}
