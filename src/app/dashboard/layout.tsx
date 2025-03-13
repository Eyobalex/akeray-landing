"use client";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useGenericContext } from "@/hooks/useGenericContext";
import AuthContext from "@/providers/AuthContext";
import "@/styles/globals.css";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { authenticated } = useGenericContext(AuthContext);

  // const router = useRouter();
  // if (!authenticated) {
  //   router.push("/signin");
  // }
  return (
    <>
      <Toaster richColors theme="dark" position="bottom-center" />
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        <div className="fixed inset-0 z-o">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        <Sidebar />
        <div className="flex-1 overflow-auto relative z-10">
        <Header title={"BE TECH"} />
        { children }
      </div>
      </div>
    </>
  );
}
