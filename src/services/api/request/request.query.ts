"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { collectionQueryBuilder } from "@/lib/collection-query-builder";
import { Collection, CollectionQuery } from "../../../models/collection.model";
import { Lease, LeaseStatus } from "../../../models/lease.model";
import { Owner } from "../../../models/owner.model";
import { Property } from "../../../models/property.model";
import { RentIncrease } from "../../../models/rent-increase.model";
import { Tenant } from "../../../models/tenant.model";
import { Unit } from "../../../models/unit.model";
import { appApi } from "../app.api";
import { LEASE_ENDPOINT } from "./lease.endpoint";

const leaseQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLease: builder.query<Lease, string>({
      query: (id: string) => ({
        url: `${LEASE_ENDPOINT.detail}/${id}?includes[0]=property&includes[1]=tenant`,
        method: "get",
      }),
      providesTags: ["Lease"],
    }),

    getLeases: builder.query<Collection<Lease>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${LEASE_ENDPOINT.list}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Leases"],

      // async onQueryStarted(param, { queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled
      //     if (data) {
      //       leaseCollection = param
      //     }
      //   } catch (error: any) {
      //     notification(
      //       "error",
      //       error?.error?.data?.message
      //         ? error?.error?.data?.message
      //         : "Error try again",
      //     )
      //   }
      // },
    }),
    countLeases: builder.query<any, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${LEASE_ENDPOINT.list}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Count Leases"],

      // async onQueryStarted(param, { queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled
      //     if (data) {
      //       leaseCountCollection = param
      //     }
      //   } catch (error: any) {
      //     notification(
      //       "error",
      //       error?.error?.data?.message
      //         ? error?.error?.data?.message
      //         : "Error try again",
      //     )
      //   }
      // },
    }),

    getUnitsOfLease: builder.query<Collection<Unit>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${LEASE_ENDPOINT.getUnitsForLease}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Units Of Lease"],

      // async onQueryStarted(param, { queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled
      //     if (data) {
      //       unitsOfLeaseCollection = param
      //     }
      //   } catch (error: any) {
      //     notification(
      //       "error",
      //       error?.error?.data?.message
      //         ? error?.error?.data?.message
      //         : "Error try again",
      //     )
      //   }
      // },
    }),
    getOwnersOfLease: builder.query<Collection<Owner>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${LEASE_ENDPOINT.getOwnersOfLease}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // ownersOfLeaseCollection = param;
          }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : "Error try again"
          // );
        }
      },
    }),
    getPropertiesOfLease: builder.query<Collection<Property>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${LEASE_ENDPOINT.getPropertiesForLease}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // propertiesOfLeaseCollection = param;
          }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : "Error try again"
          // );
        }
      },
    }),
    getTenantsOfLease: builder.query<Collection<Tenant>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${LEASE_ENDPOINT.getTenantsForLease}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // tenantsOfLeaseCollection = param;
          }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : "Error try again"
          // );
        }
      },
    }),

    getArchivedLease: builder.query<Lease, string>({
      query: (id: string) => ({
        url: `${LEASE_ENDPOINT.archivedLease}/${id}`,
        method: "get",
      }),
      providesTags: ["Archived Lease"],
    }),

    getArchivedLeases: builder.query<Collection<Lease>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${LEASE_ENDPOINT.archivedLeases}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Archived Leases"],

      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // if (data) {
          //   archivedLeaseCollection = param
          // }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : "Error try again"
          // );
        }
      },
    }),

    createLease: builder.mutation<Lease, any>({
      query: (newData: any) => ({
        url: `${LEASE_ENDPOINT.create}`,
        method: "post",
        data: newData,
        permissions: "manage-leases",
      }),
      invalidatesTags: ["Leases", "Count Leases"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // notification("success", "Successfully created");
            // dispatch(
            //   leaseQuery.util.updateQueryData(
            //     "getLeases",
            //     leaseCollection,
            //     (draft) => {
            //       if (data) {
            //         draft.data.unshift(data)
            //         draft.count += 1
            //       }
            //     },
            //   ),
            // )
          }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : "Error try again"
          // );
        }
      },
    }),

    updateLease: builder.mutation<Lease, any>({
      query: (newData: any) => ({
        url: `${LEASE_ENDPOINT.update}`,
        method: "put",
        data: newData,
        permission: "manage-leases",
      }),
      invalidatesTags: ["Lease", "Leases", "Count Leases"],

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // notification("success", "Successfully updated");
            // dispatch(
            //   leaseQuery.util.updateQueryData(
            //     "getLeases",
            //     leaseCollection,
            //     (draft) => {
            //       if (data) {
            //         draft.data = draft?.data?.map((lease) => {
            //           if (lease.id === data.id) return data
            //           else {
            //             return lease
            //           }
            //         })
            //       }
            //     },
            //   ),
            // )
          }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : "Error try again"
          // );
        }
      },
    }),

    toggleLeaseStatus: builder.mutation<
      Lease,
      { id: string; status: LeaseStatus }
    >({
      query: (data: { id: string; status: LeaseStatus }) => ({
        url: `${LEASE_ENDPOINT.toggleStatus}`,
        method: "post",
        permission: "manage-leases",
        data: data,
      }),
      invalidatesTags: ["Lease", "Leases", "Count Leases"],

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // notification("success", "Successfully updated status");
            // dispatch(
            //   leaseQuery.util.updateQueryData(
            //     "getLeases",
            //     leaseCollection,
            //     (draft) => {
            //       if (data) {
            //         draft.data = draft?.data?.map((lease: Lease) => {
            //           if (lease.id === data.id) return data
            //           else {
            //             return lease
            //           }
            //         })
            //       }
            //     },
            //   ),
            // )
            // dispatch(
            //   leaseQuery.util.updateQueryData("getLease", param.id, (draft) => {
            //     // draft.enabled = data.enabled
            //     Object.assign(draft, data);
            //   }),
            // )
          }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message ?? "Error try again"
          // );
        }
      },
    }),

    archiveLease: builder.mutation<Lease, { id: string; reason: string }>({
      query: (data) => ({
        url: `${LEASE_ENDPOINT.archive}`,
        method: "delete",
        data: data,
        permission: "manage-leases",
      }),
      invalidatesTags: ["Lease", "Leases", "Count Leases"],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // dispatch(
            //   leaseQuery.util.updateQueryData(
            //     "getLeases",
            //     leaseCollection,
            //     (draft) => {
            //       draft.data = draft?.data?.map((lease) => {
            //         if (lease.id === arg.id) {
            //           return data
            //         } else {
            //           return lease
            //         }
            //       })
            //     },
            //   ),
            // )
            // dispatch(
            //   leaseQuery.util.updateQueryData("getLease", arg?.id, (draft) => {
            //     draft.deletedAt = data?.deletedAt
            //   }),
            // )
            // dispatch(
            //   leaseQuery.util.updateQueryData(
            //     "getArchivedLease",
            //     arg?.id,
            //     (draft) => {
            //       draft.deletedAt = data?.deletedAt
            //     },
            //   ),
            // )
            // notification("success", "Successfully archived");
          }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message ?? "Error try again"
          // );
        }
      },
    }),

    deleteLease: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${LEASE_ENDPOINT.delete}/${id}`,
        method: "delete",
        permission: "manage-leases",
      }),
      invalidatesTags: ["Lease", "Leases", "Count Leases"],

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // notification("success", "Successfully deleted");
            //   dispatch(
            //     leaseQuery.util.updateQueryData(
            //       "getArchivedLeases",
            //       archivedLeaseCollection,
            //       (draft) => {
            //         if (data) {
            //           draft.data = draft.data.filter((lease) => lease.id !== id)
            //           draft.count -= 1
            //         }
            //       },
            //     ),
            //   )
          }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message ?? "Error try again"
          // );
        }
      },
    }),

    restoreLease: builder.mutation<Lease, string>({
      query: (id: string) => ({
        url: `${LEASE_ENDPOINT.restore}/${id}`,
        method: "post",
        permission: "manage-leases",
      }),
      invalidatesTags: ["Lease", "Leases", "Count Leases"],

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // dispatch(
            //   leaseQuery.util.updateQueryData(
            //     "getLeases",
            //     leaseCollection,
            //     (draft) => {
            //       draft.data = draft?.data?.map((provider) => {
            //         if (provider.id === id) {
            //           return data
            //         } else {
            //           return provider
            //         }
            //       })
            //     },
            //   ),
            // )
            // dispatch(
            //   leaseQuery.util.updateQueryData("getLease", id, (draft) => {
            //     draft.deletedAt = data?.deletedAt
            //   }),
            // )
            // dispatch(
            //   leaseQuery.util.updateQueryData(
            //     "getArchivedLease",
            //     id,
            //     (draft) => {
            //       draft.deletedAt = data?.deletedAt
            //     },
            //   ),
            // )
            // notification("success", "Successfully restored");
          }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message ?? "Error try again"
          // );
        }
      },
    }),
    payForLeaseManually: builder.mutation<Lease, string>({
      query: (id: string) => ({
        url: `${LEASE_ENDPOINT.payForLeaseManually}`,
        method: "post",
        data: { leaseId: id },
        permission: "manage-leases",
      }),
      invalidatesTags: ["Lease", "Leases"],

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // dispatch(
            //   leaseQuery.util.updateQueryData(
            //     "getLeases",
            //     leaseCollection,
            //     (draft) => {
            //       draft.data = draft?.data?.map((provider) => {
            //         if (provider.id === id) {
            //           return data
            //         } else {
            //           return provider
            //         }
            //       })
            //     },
            //   ),
            // )
            // dispatch(
            //   leaseQuery.util.updateQueryData("getLease", id, (draft) => {
            //     draft.deletedAt = data?.deletedAt
            //   }),
            // )
            // notification("success", "Successfully Paid");
          }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message ?? "Error try again"
          // );
        }
      },
    }),

    getRentIncrease: builder.query<RentIncrease, string>({
      query: (id: string) => ({
        url: `${LEASE_ENDPOINT.deleteRentIncrease}/${id}`,
        method: "get",
      }),
      providesTags: ["Rent Increase"],
    }),

    getRentIncreases: builder.query<Collection<RentIncrease>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${LEASE_ENDPOINT.listRentIncrease}`,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Rent Increases"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // if (data) {
          //   rentIncreaseCollection = param
          // }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : "Error try again"
          // );
        }
      },
    }),

    createRentIncrease: builder.mutation<RentIncrease, RentIncrease>({
      query: (newData: any) => ({
        url: `${LEASE_ENDPOINT.createRentIncrease}`,
        method: "post",
        data: newData,
        permissions: "manage-leases",
      }),
      invalidatesTags: ["Rent Increases"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // notification("success", "Successfully created");
            // dispatch(
            //   leaseQuery.util.updateQueryData(
            //     "getRentIncreases",
            //     rentIncreaseCollection,
            //     (draft) => {
            //       if (data) {
            //         draft.data.unshift(data)
            //         draft.count += 1
            //       }
            //     },
            //   ),
            // )
          }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : "Error try again"
          // );
        }
      },
    }),

    updateRentIncrease: builder.mutation<RentIncrease, RentIncrease>({
      query: (newData: any) => ({
        url: `${LEASE_ENDPOINT.updateRentIncrease}`,
        method: "put",
        data: newData,
        permission: "manage-leases",
      }),
      invalidatesTags: ["Rent Increases", "Rent Increase"],

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // notification("success", "Successfully updated");
            // dispatch(
            //   leaseQuery.util.updateQueryData(
            //     "getRentIncreases",
            //     rentIncreaseCollection,
            //     (draft) => {
            //       if (data) {
            //         draft.data = draft?.data?.map((lease) => {
            //           if (lease.id === data.id) return data
            //           else {
            //             return lease
            //           }
            //         })
            //       }
            //     },
            //   ),
            // )
          }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : "Error try again"
          // );
        }
      },
    }),
    changeRentIncreaseStatus: builder.mutation<
      RentIncrease,
      { id: string; status: string }
    >({
      query: (newData: { id: string; status: string }) => ({
        url: `${LEASE_ENDPOINT.updateRentIncrease}`,
        method: "post",
        data: newData,
        permission: "manage-leases",
      }),
      invalidatesTags: ["Rent Increases"],

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // notification("success", "Successfully updated");
            // dispatch(
            //   leaseQuery.util.updateQueryData(
            //     "getRentIncreases",
            //     rentIncreaseCollection,
            //     (draft) => {
            //       if (data) {
            //         draft.data = draft?.data?.map((lease) => {
            //           if (lease.id === data.id) return data
            //           else {
            //             return lease
            //           }
            //         })
            //       }
            //     },
            //   ),
            // )
          }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message
          //     ? error?.error?.data?.message
          //     : "Error try again"
          // );
        }
      },
    }),

    deleteRentIncrease: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${LEASE_ENDPOINT.deleteRentIncrease}/${id}`,
        method: "delete",
        permission: "manage-leases",
      }),
      invalidatesTags: ["Rent Increases"],

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            // notification("success", "Successfully deleted");
            // dispatch(
            //   leaseQuery.util.updateQueryData(
            //     "getRentIncreases",
            //     rentIncreaseCollection,
            //     (draft) => {
            //       if (data) {
            //         draft.data = draft.data.filter(
            //           (rentIncrease) => rentIncrease.id !== id,
            //         )
            //         draft.count -= 1
            //       }
            //     },
            //   ),
            // )
          }
        } catch (error: any) {
          // notification(
          //   "error",
          //   error?.error?.data?.message ?? "Error try again"
          // );
        }
      },
    }),
  }),
  overrideExisting: true,
});
export const {
  useLazyGetArchivedLeaseQuery,
  useLazyGetArchivedLeasesQuery,
  useLazyGetUnitsOfLeaseQuery,
  useLazyGetLeaseQuery,
  useLazyGetLeasesQuery,
  useLazyCountLeasesQuery,
  useLazyGetOwnersOfLeaseQuery,
  useLazyGetPropertiesOfLeaseQuery,
  useLazyGetTenantsOfLeaseQuery,
  useUpdateLeaseMutation,
  useCreateLeaseMutation,
  useDeleteLeaseMutation,
  useArchiveLeaseMutation,
  useRestoreLeaseMutation,
  useToggleLeaseStatusMutation,
  usePayForLeaseManuallyMutation,

  useLazyGetRentIncreaseQuery,
  useLazyGetRentIncreasesQuery,
  useUpdateRentIncreaseMutation,
  useCreateRentIncreaseMutation,
  useDeleteRentIncreaseMutation,
  useChangeRentIncreaseStatusMutation,
} = leaseQuery;
