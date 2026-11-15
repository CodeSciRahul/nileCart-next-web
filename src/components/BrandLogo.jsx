import Image from "next/image";
import Link from "next/link";

/**
 * Asset naming:
 * - `light` → for light backgrounds (dark wordmark)
 * - `dark`  → for dark backgrounds (light wordmark)
 */
const BRAND = {
  full: {
    light: {
      src: "/brand/nilescart_full_light.png",
      width: 1526,
      height: 423,
    },
    dark: {
      src: "/brand/nilescart_full_dark.png",
      width: 1526,
      height: 422,
    },
  },
  icon: {
    light: {
      src: "/brand/nilescart_icon_light.png",
      width: 557,
      height: 423,
    },
    dark: {
      src: "/brand/nilescart_icon_dark.png",
      width: 557,
      height: 422,
    },
  },
};

function LogoImage({ asset, className, alt = "" }) {
  return (
    <Image
      src={asset.src}
      alt={alt}
      width={asset.width}
      height={asset.height}
      className={className}
      priority
      sizes="(max-width: 768px) 140px, 200px"
    />
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.compact] Icon-only mark
 * @param {"light"|"dark"|"auto"} [props.variant]
 *   - light: assets for light backgrounds (default)
 *   - dark: assets for dark backgrounds
 *   - auto: swap with `.dark` parent via CSS
 */
export function BrandLogo({
  className = "",
  compact = false,
  variant = "light",
}) {
  const isDark = variant === "dark";

  return (
    <Link
      href="/"
      className={`group inline-flex items-center transition-opacity hover:opacity-90 ${className}`}
      aria-label="Nilescart home"
    >
      <span
        className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.04em] select-none font-sans ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {compact ? "Nc" : "Nilescart"}
      </span>
    </Link>
  );
}
