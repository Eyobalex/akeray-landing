"use client";

import SignOut from "@/components/signout";
import { Button } from "@/components/ui/button";
import { useGenericContext } from "@/hooks/useGenericContext";
import { APIContext } from "@/providers/api.provider";
import AuthContext from "@/providers/AuthContext";
import Link from "next/link";
import { useEffect } from "react";

const RequestsPage = () => {
  const { user } = useGenericContext(AuthContext);

  const { tenantRequests } = useGenericContext(APIContext);

  useEffect(() => {
    async function getTenants() {
      const request = await tenantRequests.get_requests();

      return request;
    }
    const response = getTenants();
    console.log("🚀 ~ useEffect ~ response:", response);
  }, [tenantRequests]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="text-lg font-medium text-center">
          Welcome to the requests page, {user?.name}
        </h1>
        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
          <SignOut />
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
