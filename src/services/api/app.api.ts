"use client";

import { axiosBaseQuery } from "@/lib/axios-base-query";
import { createApi } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Owner",
    "Owners",
    "Count Owners",
    "Property",
    "Properties",
    "Count Properties",
    "Unit of Properties",
    "Count Unit of Properties",
    "Count Dashboard Properties",
    "Count Dashboard Owners",
    "Count Dashboard Units",
    "Count Dashboard Tenants",
    "Tenant",
    "Tenants",
    "Count Tenants",
    "Archived Tenant",
    "Archived Tenants",
    "Leases",
    "Lease",
    "Count Leases",
    "Archived Leases",
    "Archived Lease",
    "Units Of Lease",
    "Rent Increases",
    "Rent Increase",
    "Notification Properties",
  ],
  endpoints: () => ({}),
});
