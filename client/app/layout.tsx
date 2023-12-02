import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ChatBox from "@/components/ChatBox";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Doccy",
  description: "Chat With Your Documents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-full">
          <div className="h-full">
            <Sidebar />
          </div>

          <div className="overflow-hidden w-full">
            <div className="w-full top-0 p-4 sticky bg-background-secondary">
              <Navbar />
            </div>
            <main className="bg-background-secondary overflow-y-auto h-full">
              {children}
            </main>
            {/*<Toaster />*/}

            <div className="w-full bottom-0 p-4 sticky">
              <div className="flex h-[66px]">
                <ChatBox />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
