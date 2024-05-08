import Button from "@components/atoms/Button/Button";
import ArrowLeftIcon from "@icons/ArrowLeftIcon.svg";
import ArrowRightIcon from "@icons/ArrowRightIcon.svg";
import { Table as AntTable } from "antd";
import {
  TablePaginationConfig,
  TableRowSelection,
} from "antd/lib/table/interface";
import { MouseEventHandler } from "react";

const Table = ({
  tableData,
  columns,
  tablePage,
  isLastPage,
  onClickNext,
  onClickPrevious,
  isPagination = true,
  pagination = false,
  scrollX = 1700,
  scrollY,
  rowSelection,
}: {
  tableData: readonly any[] | undefined;
  columns: any;
  tablePage?: number;
  isLastPage?: boolean;
  onClickNext: MouseEventHandler<HTMLButtonElement> | undefined;
  onClickPrevious: MouseEventHandler<HTMLButtonElement> | undefined;
  isPagination?: boolean;
  pagination?: TablePaginationConfig | false | undefined;
  scrollX?: number;
  scrollY?: number;
  rowSelection?: TableRowSelection<any> | undefined;
}) => {
  return (
    <div className="mt-6 overflow-x-auto">
      <AntTable
        scroll={{
          x: scrollX,
          y: scrollY,
        }}
        pagination={pagination}
        rowKey={"id"}
        dataSource={tableData}
        columns={columns}
        rowSelection={rowSelection}
      />
      {isPagination && (
        <div className="flex flex-row items-center justify-end mt-4 space-x-2">
          <Button
            type="outline"
            state={tablePage === 1 ? "disabled" : "active"}
            size="xs"
            onClick={onClickPrevious}
            title="Prev"
            leadIcon={<ArrowLeftIcon />}
          />
          <div className="px-3 py-1.5 border rounded-md">
            <p className="text-md">{tablePage}</p>
          </div>
          <Button
            type="outline"
            state={
              isLastPage
                ? "disabled"
                : !tableData
                ? "disabled"
                : onClickNext === undefined
                ? "disabled"
                : onClickPrevious === undefined
                ? "disabled"
                : "active"
            }
            size="xs"
            onClick={onClickNext}
            title="Next"
            tailIcon={<ArrowRightIcon />}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
