import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ग्रामीण उद्यम साथी | Gramin Udyam Sathi • Government Schemes for Rural Maharashtra",
  description: "Maharashtra ke Gramin Udyamiyon ke liye Sarkari Yojanaon ki Sahi Jankari, Sahi Bhasha mein. Multilingual scheme recommendations for rural businesses.",
  keywords: ["CMEGP", "Maharashtra Schemes", "Gramin Udyam", "Pradhan Mantri Mudra Loan", "Food Processing Subsidy", "Agribusiness", "Pune DIC"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mr" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
