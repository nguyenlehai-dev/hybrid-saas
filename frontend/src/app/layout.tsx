import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VPS Panel AI - Nền tảng AI xử lý ảnh thông minh",
  description:
    "Tạo ảnh AI chuyên nghiệp cho sản phẩm, review, landing page. Tích hợp Stable Diffusion, ControlNet, Real-ESRGAN. Quản lý server thông minh.",
  keywords: "AI image generation, product photography, skin enhancer, upscale, landing page",
  openGraph: {
    title: "VPS Panel AI",
    description: "Nền tảng AI xử lý ảnh và quản lý server thông minh",
    url: "https://vpspanel.io.vn",
    siteName: "VPS Panel AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
      </head>
      <body suppressHydrationWarning>
        <div className="bg-mesh" />
        {children}
      </body>
    </html>
  );
}
