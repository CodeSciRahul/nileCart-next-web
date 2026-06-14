import { Providers } from "@/components/providers";
import "./globals.css";

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
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
