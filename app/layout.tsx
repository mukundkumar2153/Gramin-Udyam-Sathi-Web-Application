import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { ThemeProvider } from "@/components/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import KeepAlive from "@/components/KeepAlive";

export const metadata: Metadata = {
  title: "ग्रामीण उद्यम साथी | Gramin Udyam Sathi • Government Schemes for Rural Maharashtra",
  description: "Maharashtra ke Gramin Udyamiyon ke liye Sarkari Yojanaon ki Sahi Jankari, Sahi Bhasha mein. Multilingual scheme recommendations for rural businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mr" data-theme="gramin" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <LoginModal />
            <KeepAlive />
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
