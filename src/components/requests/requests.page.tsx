"use client";

import { HoverCard, LoadingOverlay, Text } from "@mantine/core";
import { useEffect, useState } from "react";
// import { useLocation, useParams } from "react-router-dom"
import { CollectionQuery, Filter, Order } from "@/models/collection.model";
import { EntityConfig, entityViewMode } from "@/models/entity-config.model";

import EntityList from "@/components/global/entity-list.component";
import { TenantRequest } from "@/models/request.model";
import { useDisclosure } from "@mantine/hooks";
import { motion } from "framer-motion";
import { LucideWrench, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
// import ExportModalComponent from "../../../shared/component/export-modal/component/export-modal.component"
import StatCard from "@/components/global/stat-card.component";
import { useCurrentUser } from "@/hooks/current-user.hook";
import { dateFormat } from "@/hooks/date-format.hook";
// import { exportOwners } from "../api/owner.api";
import {
  useLazyCountRequestsQuery,
  useLazyGetRequestsQuery,
} from "../store/request.query";

export default function RequestPage() {
  const params = useParams();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [viewMode, setViewMode] = useState<entityViewMode>("list");
  const [collection, setCollection] = useState<CollectionQuery>({
    skip: 0,
    top: 10,
    orderBy: [{ field: "createdAt", direction: "desc" }],
    includes: ["tenant", "unit", "unit.property"],
  });

  const [getRequests, requests] = useLazyGetRequestsQuery();
  const [openedExport, { open: openExport, close: closeExport }] =
    useDisclosure();
  const [countRequests, requestCount] = useLazyCountRequestsQuery();
  const [countActiveRequests, activeRequestCount] = useLazyCountRequestsQuery();
  const [countInactiveRequests, inactiveRequestCount] =
    useLazyCountRequestsQuery();
  const [userInfo, userId, ownerInfo] = useCurrentUser();
  const generateFilterOption = (value: boolean): Filter[][] => {
    if (userInfo.role.key == "super_admin") {
      return [[{ field: "enabled", value: value, operator: "=" }]];
    }
    if (userInfo.role.key == "sales") {
      return [
        [{ field: "enabled", value: value, operator: "=" }],
        [{ field: "createdBy", value: userId, operator: "=" }],
      ];
    }
    if (userInfo.role.key == "owner") {
      return [
        [{ field: "enabled", value: value, operator: "=" }],
        [
          {
            field: "unit.property.owner_id",
            value: ownerInfo?.parentOwnerId,
            operator: "=",
          },
        ],
      ];
    }

    return [
      [
        { field: "enabled", value: value, operator: "=" },
        { field: "unit.property.owner_id", value: userId, operator: "=" },
      ],
    ];
  };
  // const generateFilterOptionForAll = (value: boolean): Filter[][] => {

  //   if (userInfo.role.key == "super_admin") {
  //     return [[{ field: "enabled", value: value, operator: "=" }]]
  //   }
  //   if (userInfo.role.key == "sales") {
  //     return [
  //       [{ field: "enabled", value: value, operator: "=" }],
  //       [{ field: "createdBy", value: userId, operator: "=" }],
  //     ]
  //   }
  //   if (userInfo.role.key == "owner") {
  //     return [
  //       [{ field: "enabled", value: value, operator: "=" }],
  //       [{ field: "parentOwnerId", value: ownerInfo?.parentOwnerId, operator: "=" }],
  //     ]
  //   }

  //   return [
  //     [
  //       { field: "enabled", value: value, operator: "=" },
  //       { field: "ownerId", value: userId, operator: "=" },
  //     ],
  //   ]
  // }
  useEffect(() => {
    getRequests({
      ...collection,
      filter: generateFilterOption(true),
    });
  }, [collection]);

  useEffect(() => {
    if (params?.id !== undefined) {
      setViewMode("detail");
    } else {
      setViewMode("list");
    }
    if (location.pathname === "/owner/archived") {
      setViewMode("detail");
    }
  }, [setViewMode, params?.id, location]);

  useEffect(() => {
    if (userInfo.role.key == "super_admin") {
      countRequests({
        count: true,
        filter: generateFilterOption(true),
      });
    } else {
      countRequests({
        count: true,
        filter: [[{ value: userId, operator: "=", field: "ownerId" }]],
      });
    }

    countInactiveRequests({
      count: true,
      filter: generateFilterOption(false),
    });
    countActiveRequests({
      count: true,
      filter: generateFilterOption(true),
    });
  }, []);

  const data: TenantRequest[] | undefined = requests.data?.data;
  const config: EntityConfig<TenantRequest> = {
    primaryColumn: { key: "name", name: t("name") },
    detailUrl: "detail",
    rootUrl: "/request",
    identity: "id",
    name: "name",
    visibleColumn: [
      {
        key: "name",
        name: t("name"),
        render: (request) => {
          return (
            <Text size="sm" className={request?.deletedAt ? "text-danger" : ""}>
              {request?.tenant?.name}
            </Text>
          );
        },
      },

      {
        key: "archiveReason",
        name: t("archiveReason"),
        hideSort: true,
        render: (request: TenantRequest) => {
          if (request?.archiveReason) {
            return (
              <HoverCard width={280} shadow="md">
                <HoverCard.Target>
                  <Text size="sm" className={"cursor-pointer"}>
                    {request?.archiveReason &&
                    request?.archiveReason?.length > 25
                      ? request?.archiveReason?.substring(0, 22) + "..."
                      : request?.archiveReason}
                  </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown
                  className={
                    "text-justify break-all wrap max-h-60 overflow-auto"
                  }
                >
                  <Text size="sm">{request?.archiveReason}</Text>
                </HoverCard.Dropdown>
              </HoverCard>
            );
          } else {
            return t("notArchived");
          }
        },
      },
      {
        key: "createdBy",
        name: t("registeredBy"),
        render(request) {
          return request?.createdBy;
        },
      },
      {
        key: "createdAt",
        name: t("registeredAt"),
        render(request) {
          return dateFormat(request?.createdAt);
        },
      },
      {
        key: "enabled",
        name: t("status"),
        render(request) {
          return request?.enabled ? t("active") : t("inactive");
        },
      },
    ],
  };
  return (
    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      <LoadingOverlay visible={requests?.isFetching} />
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <StatCard
          name={t("totalRequests")}
          icon={Wrench}
          value={requestCount?.data?.count}
          color="#6366F1"
        />
        <StatCard
          name={t("activeRequests")}
          icon={Wrench}
          value={activeRequestCount?.data?.count}
          color="#8B5CF6"
        />
        <StatCard
          name={t("inactiveRequests")}
          icon={LucideWrench}
          value={inactiveRequestCount?.data?.count}
          color="#EC4899"
        />
        {/* <StatCard name='Total Revenue' icon={DollarSign} value='12.5%' color='#10B981' /> */}
      </motion.div>
      <EntityList
        viewMode={viewMode}
        title={t("request", { count: 2 })}
        total={requests?.data?.count}
        itemsLoading={requests.isFetching}
        config={config}
        showExport={false}
        items={data}
        initialPage={1}
        defaultPageSize={10}
        pageSize={[10, 15, 20]}
        collectionQuery={collection}
        onArchivedChecked={(e) =>
          setCollection({
            ...collection,
            withArchived: e,
          })
        }
        onPaginationChange={(skip: number, top: number) => {
          if (collection.skip !== skip || collection.top !== top) {
            setCollection({ ...collection, skip: skip, top: top });
          }
        }}
        onSearch={(data: any) => {
          setCollection({
            ...collection,
            search: data,
            searchFrom: ["name", "email", "phoneNumber"],
          });
        }}
        onFilterChange={(data: any) => {
          if (collection?.filter || data.length > 0) {
            setCollection({ ...collection, filter: data });
          }
        }}
        onOrder={(data: Order) =>
          setCollection({ ...collection, orderBy: [data] })
        }
      />

      <ExportModalComponent
        open={openExport}
        opened={openedExport}
        close={closeExport}
        filename={"owners.xlsx"}
        filteringVariables={[
          [
            {
              field: "enabled",
              value: true,
              name: t("active"),
              operator: "=",
            },
            {
              field: "enabled",
              value: false,
              name: t("inactive"),
              operator: "=",
            },
          ],
          [
            {
              field: "gender",
              value: "male",
              name: t("male"),
              operator: "=",
            },
            {
              field: "gender",
              value: "female",
              name: t("female"),
              operator: "=",
            },
          ],
        ]}
        exportFunction={exportOwners}
      />

      {/* <ProductTable
      
      viewMode={viewMode}
        title={"Owners"}
        total={owners?.data?.count}
        // total={200}
        itemsLoading={owners.isFetching}
        config={config}
        showExport={false}
        header={<>
          <div className="h-14 dark:border-gray-500 dark:bg-gray-500 flex items-center justify-between p-2 border-0 border-b">
            <div className="h-full flex items-center space-x-4 font-semibold dark:text-white">
              {"Owners"}
            </div>
            {
              <div className="h-full  space-x-4 flex items-center">



                {viewMode == 'list' && (

                  <>
                    <Checkbox
                      size="sm"
                      onChange={(e) =>
                        setCollection({ ...collection, withArchived: e.currentTarget.checked ? true : false })

                      }
                      label={
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Show Archived
                        </span>
                      }
                    />

                    <Button
                      classNames={{ label: "flex space-x-2 text-white" }}
                      className="bg-primary dark:bg-dark_primary"
                      size="xs"
                      type="button"
                      onClick={(e) => openExport()}
                      variant="filled"
                    >
                      <span className="text-white">
                        <IconFileExport />
                      </span>
                      <span>Export</span>
                    </Button>

                  </>

                )}
                <Link
                  to={`/owner/new`}
                  state={{ id: location?.state?.id }}
                >
                  <Button
                    classNames={{ label: "flex space-x-2 text-white" }}
                    className="bg-primary dark:bg-dark_primary"
                    size="xs"
                    variant="filled"
                  >
                    <span className="text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current h-4 text-white"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11 2L11 11L2 11L2 13L11 13L11 22L13 22L13 13L22 13L22 11L13 11L13 2Z"
                        />
                      </svg>
                    </span>
                    <span>New</span>
                  </Button>
                </Link>

              </div>
            }
          </div>

        </>}
        items={data}
        initialPage={1}
        defaultPageSize={10}
        pageSize={[10, 15, 20]}
        collectionQuery={collection}
        onArchivedChecked={(e) =>
          setCollection({
            ...collection,
            withArchived: e,
          })
        }
        onPaginationChange={(skip: number, top: number) => {
          if (collection.skip !== skip || collection.top !== top) {
            setCollection({ ...collection, skip: skip, top: top });
          }
        }}
        onSearch={(data: any) => {
          setCollection({
            ...collection,
            search: data,
            searchFrom: ["name", "email", "phoneNumber"],
          });
        }}
        onFilterChange={(data: any) => {
          if (collection?.filter || data.length > 0) {
            setCollection({ ...collection, filter: data });
          }
        }}
        onOrder={(data: Order) =>
          setCollection({ ...collection, orderBy: [data] })
        }
      /> */}
    </main>
  );
}
