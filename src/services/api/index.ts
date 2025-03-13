import { ApiClient, Headers } from "./apiClient";
import tenantRequest from "./request.service";

export const api = (headers: Headers = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  console.log("🚀 ~ api ~ baseUrl:", baseUrl);
  if (!baseUrl) throw Error("baseUrl not found");
  const apiClient = new ApiClient(baseUrl, headers);

  return {
    tenantRequests: tenantRequest(apiClient),
  };
};

export type apiType = ReturnType<typeof api>;
