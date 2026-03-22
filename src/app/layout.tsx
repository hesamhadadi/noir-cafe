import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOIR CAFÉ — Every Sip Has a Story",
  description:
    "Specialty coffee. Select a product and watch it come to life through a scroll-driven 3D brewing journey.",
  openGraph: {
    title: "NOIR CAFÉ",
    description: "Specialty coffee. Every sip has a story.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#06040a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
