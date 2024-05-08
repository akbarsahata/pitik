import Button from "@components/atoms/Button/Button";
import ChevronDownIcon from "@icons/ChevronDownIcon.svg";
import FilterIcon from "@icons/FilterIcon.svg";
import { Dropdown as AntDropdown } from "antd";
import {
  JSXElementConstructor,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from "react";

type NewButtonVisible = {
  onAdvanceSearch: MouseEventHandler<Element> | undefined;
  onClickAddNew: MouseEventHandler<Element> | undefined;
  addNewButtonTitle: string | false;
  onClickResetSearch: MouseEventHandler<Element> | undefined;
  isResetAllButtonVisible: boolean;
  newButtonVisible?: true;
  addNewButtonLeadIcon?: ReactNode;
  addNewButtonState?: "active" | "disabled" | "loading" | undefined;
  onClickSecondary?: MouseEventHandler<Element> | undefined;
  secondaryButtonTitle?: string;
  secondaryButtonLeadIcon?: ReactNode;
  secondaryButtonState?: "active" | "disabled" | "loading" | undefined;
  isButtonDropdown?: boolean;
  onClickExport?: MouseEventHandler<Element> | undefined;
  exportButtonLeadIcon?: ReactNode;
  exportButtonState?: "active" | "disabled" | "loading" | undefined;
  dropdownContent?:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | any;
};

type NewButtonInvisible = {
  onAdvanceSearch: MouseEventHandler<Element> | undefined;
  onClickAddNew?: MouseEventHandler<Element> | undefined;
  addNewButtonTitle?: string | false;
  onClickResetSearch: MouseEventHandler<Element> | undefined;
  isResetAllButtonVisible: boolean;
  newButtonVisible?: false;
  addNewButtonLeadIcon?: ReactNode;
  addNewButtonState?: "active" | "disabled" | "loading" | undefined;
  onClickSecondary?: MouseEventHandler<Element> | undefined;
  secondaryButtonTitle?: string;
  secondaryButtonLeadIcon?: ReactNode;
  secondaryButtonState?: "active" | "disabled" | "loading" | undefined;
  isButtonDropdown?: boolean;
  onClickExport?: MouseEventHandler<Element> | undefined;
  exportButtonLeadIcon?: ReactNode;
  exportButtonState?: "active" | "disabled" | "loading" | undefined;
  dropdownContent?:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | any;
};

type TableBarType = NewButtonVisible | NewButtonInvisible;

const TableBar = ({
  onAdvanceSearch,
  onClickAddNew,
  addNewButtonTitle,
  onClickResetSearch,
  isResetAllButtonVisible,
  newButtonVisible = true,
  addNewButtonLeadIcon,
  onClickSecondary,
  secondaryButtonTitle,
  secondaryButtonLeadIcon,
  addNewButtonState = "active",
  secondaryButtonState = "active",
  isButtonDropdown = false,
  dropdownContent,
  onClickExport,
  exportButtonLeadIcon,
  exportButtonState = "active",
}: TableBarType) => {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between mt-6">
      <div className="w-full items-start flex flex-col sm:flex-row">
        <div className="w-full flex flex-row">
          <Button
            leadIcon={<FilterIcon />}
            className="w-full sm:w-fit"
            type="outline"
            size="xs"
            title="Advance Search"
            onClick={onAdvanceSearch}
          />
          <div
            className={`${
              isResetAllButtonVisible ? "" : "hidden"
            } cursor-pointer text-gray-500 hover:text-primary-100 flex items-center justify-center px-4 w-full sm:w-fit`}
            onClick={onClickResetSearch}
          >
            Reset All
          </div>
        </div>
      </div>
      <div
        className={`${
          newButtonVisible ? "flex" : "hidden"
        } w-full flex items-center justify-end mt-4 sm:mt-0 space-x-2`}
      >
        {isButtonDropdown ? (
          <AntDropdown
            overlay={dropdownContent}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              className="w-full sm:w-fit"
              size="xs"
              state={addNewButtonState}
              leadIcon={addNewButtonLeadIcon}
              title={addNewButtonTitle as string}
              onClick={onClickAddNew}
              tailIcon={<ChevronDownIcon className="text-md" />}
            />
          </AntDropdown>
        ) : (
          !onClickExport && (
            <Button
              className="w-full sm:w-fit"
              size="xs"
              state={addNewButtonState}
              leadIcon={addNewButtonLeadIcon}
              title={addNewButtonTitle as string}
              onClick={onClickAddNew}
            />
          )
        )}
        {onClickSecondary && (
          <Button
            className="w-full sm:w-fit"
            type="outline"
            size="xs"
            state={secondaryButtonState}
            leadIcon={secondaryButtonLeadIcon}
            title={secondaryButtonTitle as string}
            onClick={onClickSecondary}
          />
        )}
        {onClickExport && (
          <Button
            className="export-button"
            type="outline"
            size="xs"
            state={exportButtonState}
            leadIcon={exportButtonLeadIcon}
            title=""
            onClick={onClickExport}
          />
        )}
      </div>
    </div>
  );
};

export default TableBar;
