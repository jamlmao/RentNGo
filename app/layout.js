

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "RentNGo",
  description: "RentNGo is a platform for renting and selling cars",
  icons: {
    icon: '/64px.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} antialiased bg-[#E8E0CF]`}
        >
          <Header />
          <main className="min-h-screen bg-[#E8E0CF]">
            {children}
          </main>
          <Toaster richColors/>
          <footer className="bg-[#E8E0CF] py-4">
            <div className="container mx-auto">
              <p className="text-center text-[#171716]">
                &copy; {new Date().getFullYear()} RentNGo. All rights reserved.
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
