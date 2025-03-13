import { Toaster } from "@/components/ui/sonner";
import { base, heading } from "@/constants/fonts";
import { cn } from "@/lib";
import { ApiProvider } from "@/providers/api.provider";
import { AuthContextProvider } from "@/providers/AuthContext";
import "@/styles/globals.css";
import { generateMetadata } from "@/utils";
export const metadata = generateMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-[#101010] text-foreground font-base antialiased overflow-x-hidden dark",
          base.variable,
          heading.variable
        )}
      >
        <AuthContextProvider>
          <ApiProvider>
            <Toaster richColors theme="dark" position="bottom-center" />
            {children}
          </ApiProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
