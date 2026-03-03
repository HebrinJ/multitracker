import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { Toaster } from "@/components/ui/toaster";
import { getCurrentUser } from "@/lib/auth";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Мультитрекер - Отслеживайте книги и фильмы", template: "%s | Мультитрекер" },
  description: "Ведите персональный учёт прочитанных книг и просмотренных фильмов.",
  keywords: ["трекер", "книги", "фильмы", "рецензии", "оценки"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header user={user} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}