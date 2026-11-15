import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE, getSiteUrl } from "@/lib/site";
import "./globals.css";

const poppins = localFont({
  src: [
    { path: "../fonts/Poppins-Thin.ttf", weight: "100", style: "normal" },
    { path: "../fonts/Poppins-ThinItalic.ttf", weight: "100", style: "italic" },
    { path: "../fonts/Poppins-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "../fonts/Poppins-ExtraLightItalic.ttf", weight: "200", style: "italic" },
    { path: "../fonts/Poppins-Light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/Poppins-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "../fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Poppins-Italic.ttf", weight: "400", style: "italic" },
    { path: "../fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Poppins-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/Poppins-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "../fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/Poppins-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "../fonts/Poppins-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../fonts/Poppins-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
    { path: "../fonts/Poppins-Black.ttf", weight: "900", style: "normal" },
    { path: "../fonts/Poppins-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "nilescart | Official Online Store",
    template: "%s | nilescart",
  },
  description:
    "Shop the latest luxury contemporary trends at NILESCART. Unisex, menswear, and womenswear collections, knitwear, tailoring, and essentials with easy returns and fast delivery.",
  applicationName: "NILESCART",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/pwa-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "nilescart",
    title: "nilescart | Official Online Store",
    description:
      "Shop the latest luxury contemporary trends at NILESCART. Unisex, menswear, and womenswear collections, knitwear, tailoring, and essentials with easy returns and fast delivery.",
    url: getSiteUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: "nilescart | Official Online Store",
    description:
      "Shop the latest luxury contemporary trends at NILESCART. Unisex, menswear, and womenswear collections, knitwear, tailoring, and essentials with easy returns and fast delivery.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable} data-scroll-behavior="smooth">
      <body className={`${poppins.className} font-sans bg-[#faf9f6] text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white`}>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
