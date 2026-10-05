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
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/nilescart_mark.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
      { url: "/brand/nilescart_mark.png", type: "image/png", sizes: "512x512" },
    ],
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: getSiteUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport = {
  themeColor: "#E6A800",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={poppins.variable}
      data-scroll-behavior="smooth"
    >
      <body className={`${poppins.className} font-sans`}>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
