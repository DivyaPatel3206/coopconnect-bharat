import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CoopConnect Bharat",
  description: "Learn. Certify. Connect. Grow. A digital ecosystem for cooperative training in India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-black/10 py-8 text-center text-sm text-coop-slate">
            CoopConnect Bharat — a digital ecosystem for the National Council for Cooperative Training.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
