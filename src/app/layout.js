import { Roboto } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata = {
  title: {
    default: "NileCart",
    template: "%s | NileCart",
  },
  description:
    "Shop fashion at NileCart — dresses, tops, accessories and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className={roboto.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
