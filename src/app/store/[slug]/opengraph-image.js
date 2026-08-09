import { ImageResponse } from "next/og";
import { fetchSellerBySlug } from "@/lib/data/sellers";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const alt = "Store preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image({ params }) {
  const { slug } = await params;

  let seller = null;
  try {
    const data = await fetchSellerBySlug(slug);
    seller = data?.seller || null;
  } catch {
    seller = null;
  }

  const name = seller?.storeName || "Store";
  const logoUrl =
    typeof seller?.logo === "string" ? seller.logo : seller?.logo?.url;
  const description =
    seller?.description?.slice(0, 120) ||
    `Shop products from ${name} on ${SITE.name}.`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(160deg, #FFF5D1 0%, #FFECB3 50%, #FFBF00 100%)",
          fontFamily: "sans-serif",
          padding: 64,
          gap: 28,
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 28,
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "4px solid rgba(26,26,26,0.08)",
          }}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt=""
              width={140}
              height={140}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ fontSize: 64, fontWeight: 900, color: "#1a1a1a" }}>
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "#4a3728",
              textTransform: "uppercase",
            }}
          >
            {SITE.name} Store
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: "#1a1a1a",
              maxWidth: 900,
              textAlign: "center",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#4a3728",
              maxWidth: 760,
              textAlign: "center",
            }}
          >
            {description}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
