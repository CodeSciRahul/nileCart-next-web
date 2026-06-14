import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata = {
  title: {
    default: "LightCollection",
    template: "%s | LightCollection",
  },
  description:
    "Shop fashion at LightCollection — dresses, tops, accessories and more.",
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
