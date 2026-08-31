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
  const kind = compact ? "icon" : "full";
  const heightClass = compact
    ? "h-8 w-auto sm:h-9"
    : "h-8 w-auto sm:h-9 md:h-10";

  return (
    <Link
      href="/"
      className={`group inline-flex items-center transition-opacity hover:opacity-90 ${className}`}
      aria-label="Nilescart home"
    >
      {variant === "auto" ? (
        <>
          <LogoImage
            asset={BRAND[kind].light}
            className={`${heightClass} dark:hidden`}
          />
          <LogoImage
            asset={BRAND[kind].dark}
            className={`${heightClass} hidden dark:block`}
          />
        </>
      ) : (
        <LogoImage
          asset={BRAND[kind][variant] || BRAND[kind].light}
          className={heightClass}
        />
      )}
    </Link>
  );
}
