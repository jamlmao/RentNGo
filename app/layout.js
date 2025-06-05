

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "RentNGo",
  description: "RentNGo is a platform for renting and selling cars",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} antialiased`}
        >
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-gray-100 py-4">
            <div className="container mx-auto">
              <p className="text-center text-gray-500">
                &copy; {new Date().getFullYear()} RentNGo. All rights reserved.
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
