import { ImageResponse } from "next/og";
import { fetchCategoryBySlug } from "@/lib/data/category";
import { getCategoryImageSrc } from "@/lib/categoryHelpers";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const alt = "Category preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image({ params }) {
  const { slug } = await params;

  let category = null;
  try {
    const data = await fetchCategoryBySlug(slug);
    category = data?.category || null;
  } catch {
    category = null;
  }

  const name = category?.name || "Shop";
  const imageUrl = getCategoryImageSrc(category?.image);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#1a1a1a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: "55%",
            height: "100%",
            display: "flex",
            position: "relative",
            background: "#FFECB3",
          }}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              width={660}
              height={630}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(26,26,26,0.15) 0%, rgba(26,26,26,0.85) 100%)",
              display: "flex",
            }}
          />
        </div>

        <div
          style={{
            width: "45%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "56px",
            background: "#1a1a1a",
            color: "#ffffff",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#FFBF00",
              textTransform: "uppercase",
            }}
          >
            {SITE.name} · Shop
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              lineHeight: 1.1,
              maxHeight: 240,
              overflow: "hidden",
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: 22, color: "#ccc" }}>
            Explore curated picks in this collection
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
