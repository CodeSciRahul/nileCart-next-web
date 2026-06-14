import { cookies } from "next/headers";

const getServerApiBaseUrl = () => {
  if (process.env.API_URL) {
    return process.env.API_URL.replace(/\/$/, "");
  }

  if (process.env.NEXT_PUBLIC_API_URL?.startsWith("http")) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }

  return "http://localhost:5000/api";
};

const buildApiError = (data, status) => {
  const error = new Error(data?.message || `Request failed (${status})`);
  error.status = status;
  error.data = data;
  return error;
};

export async function serverGet(path, options = {}) {
  const { authenticated = false, revalidate = 60 } = options;
  const headers = { "Content-Type": "application/json" };

  if (authenticated) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      headers.Cookie = `token=${token}`;
    }
  }

  const response = await fetch(`${getServerApiBaseUrl()}${path}`, {
    headers,
    ...(authenticated
      ? { cache: "no-store" }
      : { next: { revalidate } }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw buildApiError(data, response.status);
  }

  return data;
}
