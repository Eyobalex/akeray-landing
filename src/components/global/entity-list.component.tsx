"use client";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Divider,
  LoadingOverlay,
  Menu,
  Tooltip,
} from "@mantine/core";
import { IconSelect, IconSelector } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { Plus, Search, Sliders } from "lucide-react";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { CollectionQuery } from "@/models/collection.model";
import { EntityConfig, entityViewMode } from "@/models/entity-config.model";
import useScreenWidth from "@/hooks/screen-width.hook";
import EmptyIcon from ".//empty-icon.component";
// import { notification } from "./notification/utility/notification";
import { Pagination } from "./pagination.component";
import { toast } from "sonner";

interface Props<T> {
  config?: EntityConfig<T>;
  check?: boolean;
  showNewButton?: boolean;
  showExport?: boolean;
  showSelector?: boolean;
  viewMode: entityViewMode;
  collectionQuery?: CollectionQuery;
  items?: any[];
  selectedItem?: any;
  itemsLoading?: boolean;
  pageSize?: number[];
  defaultPageSize?: number;
  initialPage?: number;
  total: any;
  loading?: boolean;
  title: string | ReactElement<any>;
  header?: string | ReactElement<any>;
  showArchivedCheckBox?: boolean;
  parentStyle?: string;
  firstChildStyle?: string;
  detailWidth?: any;
  //Action emitters
  currentHeaderHelper?: any;
  onPaginationChange: any;
  onSearch?: any;
  onFilterChange?: any;
  onOrder?: any;
  group?: any;
  printModalChange?: any;
  onArchivedChecked?: (e: any) => void;
  exportExcelChange?: any;
}

function EntityList<T>(props: Props<T>) {
  const params = useParams();
  const pdfRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, setOpened] = useState(false);
  const [printItems, setPrintItems] = useState<any[]>([]);
  const [checkedItems, setCheckedItems] = useState<any[]>([]);
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);
  const [showDetailOption, setShowDetailOption] = useState<string | null>(null);
  const { t } = useTranslation();
  const screenWidth = useScreenWidth();

  useEffect(() => {
    if (screenWidth < 1150) {
      setFullScreen(true);
    } else {
      setFullScreen(false);
    }
  }, [screenWidth]);

  const CheckboxIcon: CheckboxProps["icon"] = ({ indeterminate, className }) =>
    indeterminate ? (
      <IconSelect className={className} />
    ) : (
      <IconSelector className={className} />
    );

  const [defaultValue] = useState<EntityConfig<T>>({
    rootUrl: "",
    detailUrl: "detail",
    identity: "id",
    name: "",
    visibleColumn: [],
    primaryColumn: { name: t("name"), key: "name" },
    showFullScreen: true,
    showClose: true,
    hasActions: false,
    showDetail: true,
  });

  const [setting, setSetting] = useState<EntityConfig<T>>();
  const {
    detailWidth = { list: "md:w-3/12", content: "md:w-9/12" },
    viewMode,
    items,
    config,
    title,
    showArchivedCheckBox = true,
    itemsLoading,
    total,
    pageSize,
    defaultPageSize,
    onPaginationChange,
    onArchivedChecked,
    onSearch,
    onFilterChange,
    onOrder,
    showNewButton,
    header,
    parentStyle,
    firstChildStyle = "border",
    showExport,
    showSelector = true,
  } = props;
  useEffect(() => {
    setSetting({
      ...defaultValue,
      ...config,
    });
  }, [config, defaultValue]);

  const [filterValue, setFilterValue] = useState<string[]>([]);
  const [order, setOrder] = useState<{ field: string; direction: string }>({
    field: "",
    direction: "",
  });

  useEffect(() => {
    onFilterChange(filterQuery(filterValue));
  }, [filterValue]);

  useEffect(() => {
    if (allChecked) {
      setCheckedItems(items ? items : []);
    } else {
      setCheckedItems([]);
    }
  }, [allChecked]);

  useEffect(() => {
    if (check && opened && checkedItems.length === 0) {
      // notification("warning", "Please select items to export");
      toast.warning("Please select items to export");
    } else if (check) {
      setPrintItems(checkedItems);
    } else {
      setPrintItems(items ? items : []);
    }
  }, [opened]);

  const filterQuery = (data: string[]) => {
    let filterQueryValue: any[] = [];
    const filterMap: { [key: string]: any[] } = {};
    data.forEach((item) => {
      filterMap[JSON.parse(item)?.field] = data.filter(
        (query) => JSON.parse(query)?.field === JSON.parse(item).field
      );
    });
    // constructs the filter query into array form the grouped object
    Object.keys(filterMap).forEach((key) => {
      filterQueryValue = [
        ...filterQueryValue,
        filterMap[key].map((item) => JSON.parse(item)),
      ];
    });
    return filterQueryValue;
  };

  const exportToExcel = async () => {
    // const fileType =
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8;";
    // const fileExtension = ".xlsx";
    // if (check && checkedItems.length === 0) {
    //   notification("warning", "Please Check items to export");
    //   return null;
    // }
    // const exportItems = check ? checkedItems : items;
    // const exportData: any = exportItems?.map((item, index) => {
    //   let data: any = {};
    //   setting?.visibleColumn.map((col, idx) => {
    //     if (col?.print !== false && col?.hide !== true) {
    //       if (!Array.isArray(col.key)) {
    //         if (col?.isDate) {
    //           return (data[`${col.key}`] = dateFormat(
    //             item[`${col.key}`],
    //             "mmmm dS, yyyy hh:mm TT"
    //           ));
    //         } else {
    //           return (data[`${col.key}`] = item[`${col.key}`]);
    //         }
    //       } else {
    //         if (col?.isDate) {
    //           return (data[`${col.key}`] = dateFormat(
    //             childeView(item, col.key),
    //             "mmmm dS, yyyy hh:mm TT"
    //           ));
    //         } else {
    //           return (data[`${col.key}`] = childeView(item, col.key));
    //         }
    //       }
    //     }
    //   });
    //   return data;
    // });
    // const ws = XLSX.utils.json_to_sheet(exportData);
    // const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    // const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    // const data = new Blob([excelBuffer], { type: fileType });
    // FileSaver.saveAs(data, title + fileExtension);
  };

  const childeView = (item: any, keys: string[]) => {
    if (keys.length && item) {
      keys.forEach((key: any) => {
        if (item[key] !== null && item[key] !== undefined) {
          item = item[key];
        } else {
          item = "";
        }
      });
    }

    return item;
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-0 md:p-6 border-none md:border md:border-gray-700 m-0 md:mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {props?.viewMode == "list" ? (
        <>
          <div className="flex  justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-100">{title}</h2>

            <div className="gap-2 hidden md:flex">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("searchHere")}
                  className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyUp={debounce(
                    (event: any) => onSearch(event.target.value),
                    1000
                  )}
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>

              <div className="flex gap-2">
                {setting?.filter && (
                  <Menu
                    withArrow
                    position="left-start"
                    closeOnItemClick={false}
                    classNames={{ itemLabel: "gap-2" }}
                  >
                    <Menu.Target>
                      <Button
                        className={` dark:bg-dark_primary dark:border-none dark:text-white`}
                        classNames={{ label: "flex space-x-2  text-gray-700" }}
                        size="xs"
                        variant="default"
                      >
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-current h-4 dark:text-white"
                            viewBox="0 0 26 26"
                          >
                            <path d="M2 0C0.894531 0 0 0.894531 0 2L9 12L9 21.40625C9 22.511719 9.894531 23.777344 11 24.21875L15 25.8125C15.261719 25.917969 15.519531 25.96875 15.75 25.96875C16.488281 25.96875 17 25.464844 17 24.625L17 12L26 2C26 0.894531 25.105469 0 24 0 Z M 2.6875 2L23.3125 2L16.125 10L9.90625 10 Z M 11 12L15 12L15 23.65625L11.75 22.34375C11.367188 22.191406 11 21.648438 11 21.40625Z" />
                          </svg>
                        </span>
                        <span
                          className={`${
                            viewMode === "detail" && "hidden"
                          } dark:text-white`}
                        >
                          {t("filter")}
                        </span>
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>{t("filterBy")}</Menu.Label>
                      <Menu.Item>
                        <Checkbox.Group
                          size="xs"
                          withAsterisk
                          defaultValue={filterValue}
                          value={filterValue}
                          onChange={(data: any) => {
                            setFilterValue(data);
                          }}
                        >
                          {setting?.filter?.map((item, idx) => (
                            <>
                              <div className="flex-col space-y-2">
                                {item.map((filter, index) => (
                                  <Checkbox
                                    key={index}
                                    value={JSON.stringify(filter)}
                                    label={filter.name}
                                  />
                                ))}
                                {setting !== undefined ? (
                                  setting?.filter?.length !== idx + 1 && (
                                    <Divider
                                      label={t("and")}
                                      labelPosition="center"
                                      my={"sm"}
                                    />
                                  )
                                ) : (
                                  <></>
                                )}
                              </div>
                            </>
                          ))}
                        </Checkbox.Group>
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
                {showSelector && (
                  <Tooltip label={t("selector")}>
                    <Checkbox
                      size="lg"
                      className=" rounded-l"
                      icon={CheckboxIcon}
                      onClick={() => setCheck(!check)}
                      indeterminate
                    />
                  </Tooltip>
                )}
                {showArchivedCheckBox && viewMode !== "detail" && (
                  <div className="flex justify-center items-center">
                    <Checkbox
                      size="sm"
                      onChange={(e) =>
                        onArchivedChecked?.(
                          e.currentTarget.checked ? true : false
                        )
                      }
                      label={
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {t("showArchived")}
                        </span>
                      }
                    />
                  </div>
                )}
                {showNewButton !== false && (
                  <Link
                    to={`${setting?.rootUrl}/new`}
                    state={{ id: location?.state?.id }}
                  >
                    <Button
                      classNames={{ label: "flex space-x-2 text-white" }}
                      className="bg-primary dark:bg-dark_primary"
                      size="xs"
                      variant="filled"
                    >
                      <span className="text-white">
                        <Plus />
                      </span>
                      <span>{t("new")}</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 md:hidden">
              {/* <div className="relative"> */}
              <input
                type="text"
                placeholder={t("searchHere")}
                className="bg-gray-700 w-[50%] h-7 text-white placeholder-gray-400 rounded-lg pl-2 md:pl-10 pr-1 md:pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyUp={debounce(
                  (event: any) => onSearch(event.target.value),
                  1000
                )}
              />
              {/* <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                </div> */}

              <Menu trigger="click" openDelay={100} closeDelay={400}>
                <Menu.Target>
                  <Sliders />
                </Menu.Target>

                <Menu.Dropdown>
                  {/* <Menu.Label>
                      {showSelector && (
                        <Tooltip label="Selector">
                          <Checkbox
                            size="lg"
                            className=" rounded-l"
                            icon={CheckboxIcon}
                            onClick={() => setCheck(!check)}
                            indeterminate
                          />
                        </Tooltip>
                      )}
                    </Menu.Label> */}
                  <Menu.Item>
                    {showArchivedCheckBox && viewMode !== "detail" && (
                      <div className="flex justify-center items-center">
                        <Checkbox
                          size="sm"
                          onChange={(e) =>
                            onArchivedChecked?.(
                              e.currentTarget.checked ? true : false
                            )
                          }
                          label={
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t("showArchived")}
                            </span>
                          }
                        />
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {showNewButton !== false && (
                      <Link
                        to={`${setting?.rootUrl}/new`}
                        state={{ id: location?.state?.id }}
                      >
                        <Button
                          classNames={{ label: "flex space-x-2 text-white" }}
                          className="bg-primary dark:bg-dark_primary"
                          size="xs"
                          variant="filled"
                        >
                          <span className="text-white">
                            <Plus />
                          </span>
                          <span>{t("new")}</span>
                        </Button>
                      </Link>
                    )}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>

          <div className="overflow-x-auto ">
            {total > 0 && (
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="">
                  <tr>
                    {check &&
                      (viewMode === "list" ? (
                        <th scope="col" className="py-3 px-2">
                          <Checkbox
                            size="xs"
                            onChange={() => setAllChecked(!allChecked)}
                          />
                        </th>
                      ) : (
                        <th
                          scope="col"
                          className="py-2 px-2 bg-primary text-white"
                        >
                          <Checkbox
                            size="xs"
                            onChange={() => setAllChecked(!allChecked)}
                          />
                        </th>
                      ))}

                    {config?.visibleColumn?.map((config, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        {config.name}
                      </th>
                    ))}
                    {/* {config?.showDetail  && (<th></th>)} */}
                  </tr>
                </thead>

                <tbody>
                  {items?.map((item) => (
                    <motion.tr
                      key={item?.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onHoverStart={(event) => {
                        setShowDetailOption(item?.id as string);
                      }}
                      onHoverEnd={(event) => {
                        setShowDetailOption(null);
                      }}
                      transition={{ duration: 0.3 }}
                      className="hover:opacity-70 hover:bg-gray-800 cursor-pointer"
                      onDoubleClick={() => {
                        if (setting?.showDetail) {
                          navigate(
                            `${setting?.detailUrl}/${
                              item?.deletedAt ? "archived" : "active"
                            }/${
                              !Array.isArray(setting?.identity)
                                ? item[`${setting?.identity}`]
                                : setting?.identity &&
                                  childeView(item, setting?.identity)
                            }`
                          );
                        }
                      }}
                    >
                      {check && (
                        <td
                          className={`${
                            viewMode === "detail" &&
                            "group-hover:bg-primary group-hover:text-white font-medium  whitespace-nowrap"
                          } py-2 px-2`}
                        >
                          <Checkbox
                            value={
                              JSON.stringify(item)
                              // ""
                            }
                            checked={
                              ((allChecked &&
                                checkedItems.some((checkedItem: any) =>
                                  !Array.isArray(setting?.identity)
                                    ? checkedItem?.[`${setting?.identity}`]
                                    : setting?.identity &&
                                      childeView(
                                        checkedItem,
                                        setting?.identity
                                      ) === !Array.isArray(setting?.identity)
                                    ? item?.[`${setting?.identity}`]
                                    : setting?.identity &&
                                      childeView(item, setting?.identity)
                                )) ||
                                checkedItems.some(
                                  (checkedItem: any) =>
                                    (!Array.isArray(setting?.identity)
                                      ? checkedItem[`${setting?.identity}`]
                                      : setting?.identity &&
                                        childeView(
                                          checkedItem,
                                          setting?.identity
                                        )) ===
                                    (!Array.isArray(setting?.identity)
                                      ? item?.[`${setting?.identity}`]
                                      : setting?.identity &&
                                        childeView(item, setting?.identity))
                                )) &&
                              true
                              // true
                            }
                            size="xs"
                            onChange={(event) => {
                              checkedItems.some(
                                (checkedItem) =>
                                  (!Array.isArray(setting?.identity)
                                    ? checkedItem[`${setting?.identity}`]
                                    : setting?.identity &&
                                      childeView(
                                        checkedItem,
                                        setting?.identity
                                      )) ===
                                  (!Array.isArray(setting?.identity)
                                    ? JSON.parse(event.target.value)?.[
                                        `${setting?.identity}`
                                      ]
                                    : setting?.identity &&
                                      childeView(
                                        JSON.parse(event.target.value),
                                        setting?.identity
                                      ))
                              )
                                ? setCheckedItems([
                                    ...checkedItems.filter(
                                      (checkedItem) =>
                                        (!Array.isArray(setting?.identity)
                                          ? checkedItem[`${setting?.identity}`]
                                          : setting?.identity &&
                                            childeView(
                                              checkedItem,
                                              setting?.identity
                                            )) !==
                                        (!Array.isArray(setting?.identity)
                                          ? JSON.parse(event.target.value)?.[
                                              `${setting?.identity}`
                                            ]
                                          : setting?.identity &&
                                            childeView(
                                              JSON.parse(event.target.value),
                                              setting?.identity
                                            ))
                                    ),
                                  ])
                                : setCheckedItems([
                                    ...checkedItems,
                                    JSON.parse(event.target.value),
                                  ]);
                            }}
                          />
                        </td>
                      )}

                      {config?.visibleColumn?.map((col) => (
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                          key={col?.key as string}
                        >
                          {col?.render
                            ? col.render(item)
                            : !Array.isArray(col?.key) && item[col?.key]}
                        </td>
                      ))}

                      {/* {config?.showDetail &&(
                                                  <td className={showDetailOption == item?.id ? "" : "hidden"}>{<ChevronRightIcon />}</td>
                                              )} */}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}

            {total > 0 && (
              <div className="flex w-full justify-end p-2">
                <Pagination
                  sizeChanger={viewMode === "detail" ? false : true}
                  defaultPageSize={defaultPageSize}
                  total={total}
                  pageSize={pageSize}
                  onPaginationChange={(skip: number, top: number) =>
                    onPaginationChange(skip, top)
                  }
                />
              </div>
            )}

            {total < 1 ? (
              <div className="w-full relative flex justify-center items-center h-56">
                {itemsLoading && (
                  <LoadingOverlay
                    visible={itemsLoading && !items?.length}
                    overlayBlur={2}
                  />
                )}
                <EmptyIcon />
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <div className="flex">
          <div className={`${fullScreen ? "hidden" : detailWidth.list} h-full`}>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-end w-full  gap-2">
                {setting?.filter && (
                  <Menu
                    withArrow
                    position="left-start"
                    closeOnItemClick={false}
                    classNames={{ itemLabel: "gap-2" }}
                  >
                    <Menu.Target>
                      <Button
                        className={` dark:bg-dark_primary dark:border-none dark:text-white`}
                        classNames={{ label: "flex space-x-2  text-gray-700" }}
                        size="xs"
                        variant="default"
                      >
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-current h-4 dark:text-white"
                            viewBox="0 0 26 26"
                          >
                            <path d="M2 0C0.894531 0 0 0.894531 0 2L9 12L9 21.40625C9 22.511719 9.894531 23.777344 11 24.21875L15 25.8125C15.261719 25.917969 15.519531 25.96875 15.75 25.96875C16.488281 25.96875 17 25.464844 17 24.625L17 12L26 2C26 0.894531 25.105469 0 24 0 Z M 2.6875 2L23.3125 2L16.125 10L9.90625 10 Z M 11 12L15 12L15 23.65625L11.75 22.34375C11.367188 22.191406 11 21.648438 11 21.40625Z" />
                          </svg>
                        </span>
                        <span
                          className={`${
                            viewMode === "detail" && "hidden"
                          } dark:text-white`}
                        >
                          {t("filter")}
                        </span>
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>{t("filterBy")}</Menu.Label>
                      <Menu.Item>
                        <Checkbox.Group
                          size="xs"
                          withAsterisk
                          defaultValue={filterValue}
                          value={filterValue}
                          onChange={(data: any) => {
                            setFilterValue(data);
                          }}
                        >
                          {setting?.filter?.map((item, idx) => (
                            <>
                              <div className="flex-col space-y-2">
                                {item.map((filter, index) => (
                                  <Checkbox
                                    key={index}
                                    value={JSON.stringify(filter)}
                                    label={filter.name}
                                  />
                                ))}
                                {setting !== undefined ? (
                                  setting?.filter?.length !== idx + 1 && (
                                    <Divider
                                      label={t("and")}
                                      labelPosition="center"
                                      my={"sm"}
                                    />
                                  )
                                ) : (
                                  <></>
                                )}
                              </div>
                            </>
                          ))}
                        </Checkbox.Group>
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
                {showSelector && (
                  <Tooltip label={t("selector")}>
                    <Checkbox
                      size="lg"
                      className=" rounded-l"
                      icon={CheckboxIcon}
                      onClick={() => setCheck(!check)}
                      indeterminate
                    />
                  </Tooltip>
                )}
                {showArchivedCheckBox && viewMode !== "detail" && (
                  <div className="flex justify-center items-center">
                    <Checkbox
                      size="sm"
                      onChange={(e) =>
                        onArchivedChecked?.(
                          e.currentTarget.checked ? true : false
                        )
                      }
                      label={
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {t("showArchived")}
                        </span>
                      }
                    />
                  </div>
                )}
                {showNewButton !== false && (
                  <Link
                    to={`${setting?.rootUrl}/new`}
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
                      <span>{t("new")}</span>
                    </Button>
                  </Link>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={t("searchHere")}
                  className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  onKeyUp={debounce(
                    (event: any) => onSearch(event.target.value),
                    1000
                  )}
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>
            {total > 0 && (
              <table className="min-w-full h-full divide-y divide-gray-700 border-primary">
                <thead className="">
                  <tr>
                    {check && (
                      <th scope="col" className="py-2 px-2 text-white">
                        <Checkbox
                          size="xs"
                          onChange={() => setAllChecked(!allChecked)}
                        />
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {config?.primaryColumn?.name}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items?.map((item) => (
                    <motion.tr
                      key={item?.id}
                      className="hover:opacity-60 cursor-pointer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {check && (
                        <td
                          className={`${
                            viewMode === "detail" &&
                            "group-hover:bg-primary group-hover:text-white font-medium  whitespace-nowrap"
                          } py-2 px-2`}
                        >
                          <Checkbox
                            value={
                              JSON.stringify(item)
                              // ""
                            }
                            checked={
                              ((allChecked &&
                                checkedItems.some((checkedItem: any) =>
                                  !Array.isArray(setting?.identity)
                                    ? checkedItem?.[`${setting?.identity}`]
                                    : setting?.identity &&
                                      childeView(
                                        checkedItem,
                                        setting?.identity
                                      ) === !Array.isArray(setting?.identity)
                                    ? item?.[`${setting?.identity}`]
                                    : setting?.identity &&
                                      childeView(item, setting?.identity)
                                )) ||
                                checkedItems.some(
                                  (checkedItem: any) =>
                                    (!Array.isArray(setting?.identity)
                                      ? checkedItem[`${setting?.identity}`]
                                      : setting?.identity &&
                                        childeView(
                                          checkedItem,
                                          setting?.identity
                                        )) ===
                                    (!Array.isArray(setting?.identity)
                                      ? item?.[`${setting?.identity}`]
                                      : setting?.identity &&
                                        childeView(item, setting?.identity))
                                )) &&
                              true
                              // true
                            }
                            size="xs"
                            onChange={(event) => {
                              checkedItems.some(
                                (checkedItem) =>
                                  (!Array.isArray(setting?.identity)
                                    ? checkedItem[`${setting?.identity}`]
                                    : setting?.identity &&
                                      childeView(
                                        checkedItem,
                                        setting?.identity
                                      )) ===
                                  (!Array.isArray(setting?.identity)
                                    ? JSON.parse(event.target.value)?.[
                                        `${setting?.identity}`
                                      ]
                                    : setting?.identity &&
                                      childeView(
                                        JSON.parse(event.target.value),
                                        setting?.identity
                                      ))
                              )
                                ? setCheckedItems([
                                    ...checkedItems.filter(
                                      (checkedItem) =>
                                        (!Array.isArray(setting?.identity)
                                          ? checkedItem[`${setting?.identity}`]
                                          : setting?.identity &&
                                            childeView(
                                              checkedItem,
                                              setting?.identity
                                            )) !==
                                        (!Array.isArray(setting?.identity)
                                          ? JSON.parse(event.target.value)?.[
                                              `${setting?.identity}`
                                            ]
                                          : setting?.identity &&
                                            childeView(
                                              JSON.parse(event.target.value),
                                              setting?.identity
                                            ))
                                    ),
                                  ])
                                : setCheckedItems([
                                    ...checkedItems,
                                    JSON.parse(event.target.value),
                                  ]);
                            }}
                          />
                        </td>
                      )}

                      {
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center"
                          onDoubleClick={() => {
                            if (setting?.showDetail) {
                              navigate(
                                `${setting?.detailUrl}/${
                                  item?.deletedAt ? "archived" : "active"
                                }/${
                                  !Array.isArray(setting?.identity)
                                    ? item[`${setting?.identity}`]
                                    : setting?.identity &&
                                      childeView(item, setting?.identity)
                                }`
                              );
                            }
                          }}
                        >
                          <img
                            src="https://staking.voi.network/happy.png"
                            alt="Product Image"
                            className="size-10 rounded-full"
                          />
                          {config?.primaryColumn?.render
                            ? config.primaryColumn.render(item)
                            : !Array?.isArray(config?.primaryColumn?.key) &&
                              config &&
                              item[config.primaryColumn.key as string]}
                        </td>
                      }
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}

            {total > 0 && (
              <div className="flex w-full justify-end p-2">
                <Pagination
                  sizeChanger={viewMode === "detail" ? false : true}
                  defaultPageSize={defaultPageSize}
                  total={total}
                  pageSize={pageSize}
                  onPaginationChange={(skip: number, top: number) =>
                    onPaginationChange(skip, top)
                  }
                />
              </div>
            )}

            {total < 1 ? (
              <div className="w-full relative flex justify-center items-center h-56">
                {itemsLoading && (
                  <LoadingOverlay
                    visible={itemsLoading && !items?.length}
                    overlayBlur={2}
                  />
                )}
                <EmptyIcon />
              </div>
            ) : (
              <></>
            )}
          </div>

          <div
            className={`${viewMode === "detail" ? "block" : "hidden"} ${
              fullScreen ? "w-full" : detailWidth.content
            } flex-col space-y-2 px-2 h-full`}
          >
            {/* <div className="h-14 p-2 border dark:border-gray-500 dark:bg-gray-500 flex justify-between items-center">
                              <div className="h-full dark:text-white items-center flex text-sm font-semibold">
                                  {title}
                              </div>
                              <div className="h-full items-center dark:text-white flex space-x-2">
                                  <span onClick={() => setFullScreen(!fullScreen)}>
                                      {fullScreen ? (
                                          <Tooltip label="Minimize">
                                              <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  className="fill-current h-5"
                                                  viewBox="0 0 32 32"
                                              >
                                                  <path d="M4.71875 3.28125L3.28125 4.71875L10.5625 12L5 12L5 14L14 14L14 5L12 5L12 10.5625 Z M 27.28125 3.28125L20 10.5625L20 5L18 5L18 14L27 14L27 12L21.4375 12L28.71875 4.71875 Z M 5 18L5 20L10.5625 20L3.28125 27.28125L4.71875 28.71875L12 21.4375L12 27L14 27L14 18 Z M 18 18L18 27L20 27L20 21.4375L27.28125 28.71875L28.71875 27.28125L21.4375 20L27 20L27 18Z" />
                                              </svg>
                                          </Tooltip>
                                      ) : (
                                          <Tooltip label="Maximize">
                                              <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  className="fill-current h-5"
                                                  width="48"
                                                  height="48"
                                                  viewBox="0 0 48 48"
                                              >
                                                  <path d="M7.484375 5.984375 A 1.50015 1.50015 0 0 0 6 7.6914062L6 15.5 A 1.50015 1.50015 0 1 0 9 15.5L9 11.121094L16.439453 18.560547 A 1.50015 1.50015 0 1 0 18.560547 16.439453L11.121094 9L15.5 9 A 1.50015 1.50015 0 1 0 15.5 6L7.6894531 6 A 1.50015 1.50015 0 0 0 7.484375 5.984375 z M 40.470703 5.9863281 A 1.50015 1.50015 0 0 0 40.308594 6L32.5 6 A 1.50015 1.50015 0 1 0 32.5 9L36.878906 9L29.439453 16.439453 A 1.50015 1.50015 0 1 0 31.560547 18.560547L39 11.121094L39 15.5 A 1.50015 1.50015 0 1 0 42 15.5L42 7.6894531 A 1.50015 1.50015 0 0 0 40.470703 5.9863281 z M 30.484375 28.984375 A 1.50015 1.50015 0 0 0 29.439453 31.560547L36.878906 39L32.5 39 A 1.50015 1.50015 0 1 0 32.5 42L40.310547 42 A 1.50015 1.50015 0 0 0 42 40.308594L42 32.5 A 1.50015 1.50015 0 1 0 39 32.5L39 36.878906L31.560547 29.439453 A 1.50015 1.50015 0 0 0 30.484375 28.984375 z M 17.470703 28.986328 A 1.50015 1.50015 0 0 0 16.439453 29.439453L9 36.878906L9 32.5 A 1.50015 1.50015 0 1 0 6 32.5L6 40.310547 A 1.50015 1.50015 0 0 0 7.6914062 42L15.5 42 A 1.50015 1.50015 0 1 0 15.5 39L11.121094 39L18.560547 31.560547 A 1.50015 1.50015 0 0 0 17.470703 28.986328 z" />
                                              </svg>
                                          </Tooltip>
                                      )}
                                  </span>
                                  <Tooltip label="Close">
                                      <span onClick={() => navigate(`${setting?.rootUrl}`)}>
                                          <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-5 fill-current"
                                              viewBox="0 0 16 16"
                                          >
                                              <path d="M3.5 2C2.675781 2 2 2.675781 2 3.5L2 12.5C2 13.324219 2.675781 14 3.5 14L12.5 14C13.324219 14 14 13.324219 14 12.5L14 3.5C14 2.675781 13.324219 2 12.5 2 Z M 3.5 3L12.5 3C12.78125 3 13 3.21875 13 3.5L13 12.5C13 12.78125 12.78125 13 12.5 13L3.5 13C3.21875 13 3 12.78125 3 12.5L3 3.5C3 3.21875 3.21875 3 3.5 3 Z M 5.726563 5.023438L5.023438 5.726563L7.292969 8L5.023438 10.269531L5.726563 10.980469L8 8.707031L10.269531 10.980469L10.980469 10.269531L8.707031 8L10.980469 5.726563L10.269531 5.023438L8 7.292969Z" />
                                          </svg>
                                      </span>
                                  </Tooltip>
                              </div>
                          </div> */}

            <motion.div
              className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between mb-4">
                <div className="h-full dark:text-white items-center flex text-sm font-semibold">
                  {title}
                </div>
                <div className="h-full items-center dark:text-white flex space-x-2">
                  <span onClick={() => setFullScreen(!fullScreen)}>
                    {fullScreen ? (
                      <Tooltip label={t("minimize")}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-current h-5"
                          viewBox="0 0 32 32"
                        >
                          <path d="M4.71875 3.28125L3.28125 4.71875L10.5625 12L5 12L5 14L14 14L14 5L12 5L12 10.5625 Z M 27.28125 3.28125L20 10.5625L20 5L18 5L18 14L27 14L27 12L21.4375 12L28.71875 4.71875 Z M 5 18L5 20L10.5625 20L3.28125 27.28125L4.71875 28.71875L12 21.4375L12 27L14 27L14 18 Z M 18 18L18 27L20 27L20 21.4375L27.28125 28.71875L28.71875 27.28125L21.4375 20L27 20L27 18Z" />
                        </svg>
                      </Tooltip>
                    ) : (
                      <Tooltip label={t("maximize")}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-current h-5"
                          width="48"
                          height="48"
                          viewBox="0 0 48 48"
                        >
                          <path d="M7.484375 5.984375 A 1.50015 1.50015 0 0 0 6 7.6914062L6 15.5 A 1.50015 1.50015 0 1 0 9 15.5L9 11.121094L16.439453 18.560547 A 1.50015 1.50015 0 1 0 18.560547 16.439453L11.121094 9L15.5 9 A 1.50015 1.50015 0 1 0 15.5 6L7.6894531 6 A 1.50015 1.50015 0 0 0 7.484375 5.984375 z M 40.470703 5.9863281 A 1.50015 1.50015 0 0 0 40.308594 6L32.5 6 A 1.50015 1.50015 0 1 0 32.5 9L36.878906 9L29.439453 16.439453 A 1.50015 1.50015 0 1 0 31.560547 18.560547L39 11.121094L39 15.5 A 1.50015 1.50015 0 1 0 42 15.5L42 7.6894531 A 1.50015 1.50015 0 0 0 40.470703 5.9863281 z M 30.484375 28.984375 A 1.50015 1.50015 0 0 0 29.439453 31.560547L36.878906 39L32.5 39 A 1.50015 1.50015 0 1 0 32.5 42L40.310547 42 A 1.50015 1.50015 0 0 0 42 40.308594L42 32.5 A 1.50015 1.50015 0 1 0 39 32.5L39 36.878906L31.560547 29.439453 A 1.50015 1.50015 0 0 0 30.484375 28.984375 z M 17.470703 28.986328 A 1.50015 1.50015 0 0 0 16.439453 29.439453L9 36.878906L9 32.5 A 1.50015 1.50015 0 1 0 6 32.5L6 40.310547 A 1.50015 1.50015 0 0 0 7.6914062 42L15.5 42 A 1.50015 1.50015 0 1 0 15.5 39L11.121094 39L18.560547 31.560547 A 1.50015 1.50015 0 0 0 17.470703 28.986328 z" />
                        </svg>
                      </Tooltip>
                    )}
                  </span>
                  <Tooltip label={t("close")}>
                    <span onClick={() => navigate(`${setting?.rootUrl}`)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 fill-current"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.5 2C2.675781 2 2 2.675781 2 3.5L2 12.5C2 13.324219 2.675781 14 3.5 14L12.5 14C13.324219 14 14 13.324219 14 12.5L14 3.5C14 2.675781 13.324219 2 12.5 2 Z M 3.5 3L12.5 3C12.78125 3 13 3.21875 13 3.5L13 12.5C13 12.78125 12.78125 13 12.5 13L3.5 13C3.21875 13 3 12.78125 3 12.5L3 3.5C3 3.21875 3.21875 3 3.5 3 Z M 5.726563 5.023438L5.023438 5.726563L7.292969 8L5.023438 10.269531L5.726563 10.980469L8 8.707031L10.269531 10.980469L10.980469 10.269531L8.707031 8L10.980469 5.726563L10.269531 5.023438L8 7.292969Z" />
                      </svg>
                    </span>
                  </Tooltip>
                </div>
              </div>

              <div className="h-full flex space-x-2">
                <Outlet />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default EntityList;
