import { Collection } from "@/models/collection.model";
import { ApiClient, QueryParams } from "./apiClient";
import { TenantRequest } from "@/models/request.model";

const basePath = "/requests";

const get_request = async (
  id: string,
  instance: ApiClient,
  params?: QueryParams
) => {
  const response = await instance.get<Collection<TenantRequest>>(
    `${basePath}/get-request/${id}`,
    params
  );
  return response;
};

const get_requests = async (instance: ApiClient, params?: QueryParams) => {
  const response = await instance.get<Collection<TenantRequest>>(
    `${basePath}/get-requests`,
    params
  );
  return response;
};

export default function tenantRequest(instance: ApiClient) {
  return {
    get_request: (id: string, params?: QueryParams) =>
      get_request(id, instance, params),
    get_requests: (params?: QueryParams) => get_requests(instance, params),
  };
}
