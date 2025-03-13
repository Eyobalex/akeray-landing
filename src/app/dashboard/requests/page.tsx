"use client";

import SignOut from "@/components/signout";
import { Button } from "@/components/ui/button";
import { useGenericContext } from "@/hooks/useGenericContext";
import AuthContext from "@/providers/AuthContext";
import { useLazyGetLeasesQuery } from "@/services/api/request/request.query";
import Link from "next/link";
import { useEffect } from "react";

const RequestsPage = () => {
  const { user } = useGenericContext(AuthContext);

  const [getRequests, requests] = useLazyGetLeasesQuery();

  useEffect(() => {
    getRequests({ top: 10, skip: 0 });
    // const response = getTenants();
    console.log("🚀 ~ useEffect ~ response:", requests, requests?.data);
  }, [getRequests]);

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
