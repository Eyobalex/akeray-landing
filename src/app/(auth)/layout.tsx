import { Button } from "@/components/ui/button";
import { AuthContextProvider } from "@/providers/AuthContext";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContextProvider>
      <div className="container relative min-h-screen flex items-center justify-center w-full bg-[#101010]">
        <div className="lg:p-8 mx-auto w-full max-w-sm">
          <Link href="/" className="absolute top-4 left-4">
            <Button size="sm" variant="outline">
              <ArrowLeftIcon className="size-4 mr-1" />
              Home
            </Button>
          </Link>
          {children}
        </div>
      </div>
    </AuthContextProvider>
  );
}
