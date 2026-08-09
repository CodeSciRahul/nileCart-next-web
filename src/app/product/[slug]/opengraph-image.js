import { ImageResponse } from "next/og";
import { fetchProductBySlug } from "@/lib/data/products";
import { getProductImageUrl } from "@/lib/productHelpers";
import { formatProductPriceLabel } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const alt = "Product preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image({ params }) {
  const { slug } = await params;

  let product = null;
  try {
    const data = await fetchProductBySlug(slug);
    product = data?.product || null;
  } catch {
    product = null;
  }

  const title = product?.title || "Product";
  const priceLabel = product ? formatProductPriceLabel(product) : null;
  const imageUrl = product ? getProductImageUrl(product) : null;
  const brand =
    (typeof product?.brand === "object"
      ? product?.brand?.name
      : product?.brand) ||
    product?.seller?.storeName ||
    SITE.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: "48%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#FFECB3",
            overflow: "hidden",
          }}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              width={580}
              height={630}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                fontSize: 120,
                fontWeight: 900,
                color: "#FFBF00",
              }}
            >
              {title.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div
          style={{
            width: "52%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 48px",
            background: "linear-gradient(180deg, #FFFDF6 0%, #FFF5D1 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#1a1a1a",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#FFBF00",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
              }}
            >
              N
            </div>
            NILESCART
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#777777",
              }}
            >
              {brand}
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 900,
                lineHeight: 1.15,
                color: "#1a1a1a",
                maxHeight: 180,
                overflow: "hidden",
              }}
            >
              {title.length > 70 ? `${title.slice(0, 67)}…` : title}
            </div>
            {priceLabel ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: "#1a1a1a",
                  }}
                >
                  {priceLabel}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    background: "#FFBF00",
                    padding: "8px 14px",
                    color: "#1a1a1a",
                  }}
                >
                  Shop now
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ fontSize: 18, color: "#777777" }}>
            {SITE.tagline} · nilescart
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
