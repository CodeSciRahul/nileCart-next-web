import { headers } from "next/headers";
import { serverGet } from "../serverApi.js";

const MOBILE_UA =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

export async function detectDevice() {
  const headerStore = await headers();
  const ua = headerStore.get("user-agent") || "";
  return MOBILE_UA.test(ua) ? "mobile" : "desktop";
}

/**
 * Fetch composed homepage payload (announcement, sections, popup).
 * Forwards auth cookie when present so auth targeting works.
 */
export async function fetchHome({ device } = {}) {
  const resolvedDevice = device || (await detectDevice());
  const path = `/home?device=${encodeURIComponent(resolvedDevice)}`;

  try {
    return await serverGet(path, { authenticated: true, revalidate: 60 });
  } catch {
    return { announcement: null, sections: [], popup: null };
  }
}

/** Extract hero carousel banners from /home sections; fall back to /banners. */
export async function getHeroBanners(home, { device } = {}) {
  if (home?.sections?.length) {
    const hero = home.sections.find(
      (section) =>
        section.type === "hero_banner" && section.data?.banners?.length
    );
    if (hero?.data?.banners?.length) return hero.data.banners;
  }

  const resolvedDevice = device || (await detectDevice());
  try {
    const data = await serverGet(
      `/banners?device=${encodeURIComponent(resolvedDevice)}`,
      { authenticated: true, revalidate: 60 }
    );
    return data?.banners || [];
  } catch {
    return [];
  }
}
