import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ChatBox from "@/components/ChatBoxUser";
import Navbar from "@/components/Navbar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvier from "@/providers/ToasterProvider";
import { ToastContainer, toast } from "react-toastify";
import ChatBoxHost from "@/components/ChatBoxHost";

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
      <body className={`${inter.className}`}>
        <ToasterProvier />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />

            <div className="flex h-screen">
              <div className="h-full">
                <Sidebar />
              </div>

              <div className="overflow-hidden w-full flex flex-col">
                <div className="w-full top-0 p-4 sticky bg-background-secondary">
                  <Navbar />
                </div>
                <main className="bg-background-secondary overflow-y-auto h-full">
                  {children}
                </main>
                {/*<Toaster />*/}
                <ToastContainer />

                <div className="w-full bottom-0 p-4 pt-[1px] sticky bg-background-secondary">
                  <div className="flex h-[66px]">
                    <ChatBoxHost />
                  </div>
                </div>
              </div>
            </div>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
