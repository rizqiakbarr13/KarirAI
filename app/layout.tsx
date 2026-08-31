import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "KarirAI — CV & Karier dengan AI",
    template: "%s | KarirAI",
  },
  description:
    "KarirAI membantu kamu membuat CV yang lolos ATS, surat lamaran, dan simulasi interview dengan bantuan AI. Dibuat khusus untuk pencari kerja Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <SupabaseProvider>
          <ToastProvider>{children}</ToastProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
