"use client";

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu, Pagination as MPagination, Text } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type PaginationProps = {
  total: number;
  pageSize?: number[];
  onPaginationChange: any;
  defaultPageSize?: number;
  initialPage?: number;
  sizeChanger?: boolean;
};

export function Pagination(props: PaginationProps) {
  const { sizeChanger } = props;
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(
    props.defaultPageSize ? props.defaultPageSize : 10
  );
  const [pageSizeArray] = useState<number[]>(
    props.pageSize ? props.pageSize : [10, 20, 30, 40, 50, 100]
  );
  const [pageSizeTitle, setPageSizeTitle] = useState(
    props.defaultPageSize
      ? `${props.defaultPageSize} / ${t("page")}`
      : `10 / ${t("page")}`
  );
  const [items, setItems] = useState(Math.ceil(props.total / pageSize));
  const [currentPage, setCurrentPage] = useState(
    props.initialPage ? props.initialPage : 1
  );

  useEffect(() => {
    setItems(Math.ceil(props.total / pageSize));
    if (currentPage > items) {
      setCurrentPage(props.initialPage ? props.initialPage : 1);
    } else {
      props.onPaginationChange(
        pageSize * (currentPage - 1),
        pageSize,
        currentPage
      );
    }
  }, [pageSize, props.total, currentPage, items, props.initialPage]);

  useEffect(() => {
    if (props.initialPage !== undefined && props.initialPage !== currentPage) {
      props.onPaginationChange(
        pageSize * (props.initialPage - 1),
        pageSize,
        props.initialPage
      );
      setCurrentPage(props.initialPage);
    }
  }, [props.initialPage]);
  return (
    <div className={`flex space-x-5 text-sm`}>
      <MPagination
        value={currentPage}
        size={"sm"}
        total={items}
        onChange={(page) => {
          setCurrentPage(page);
        }}
      />
      {sizeChanger !== false && (
        <Menu shadow="md" position="left">
          <Menu.Target>
            <div className="cursor-pointer flex  wrap max-h-fit items-center  bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl border border-gray-700 p-2">
              <Text className="text-xs  font-medium">{pageSizeTitle}</Text>
              <IconChevronDown strokeWidth={"1"} size={16} />
            </div>
          </Menu.Target>
          <Menu.Dropdown>
            {pageSizeArray.map((item) => {
              return (
                <Menu.Item
                  key={item}
                  className="bg-grey-700 text-sm"
                  onClick={() => {
                    setPageSize(item);
                    setPageSizeTitle(`${item} / ${t("page")}`);
                  }}
                >
                  {`${item} / ${t("page")} `}
                </Menu.Item>
              );
            })}
          </Menu.Dropdown>
        </Menu>
      )}
    </div>
  );
}
