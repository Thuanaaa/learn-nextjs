import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopHub - Nền tảng mua sắm trực tuyến",
  description: "Website bán hàng hiện đại với trải nghiệm mua sắm tuyệt vời",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
