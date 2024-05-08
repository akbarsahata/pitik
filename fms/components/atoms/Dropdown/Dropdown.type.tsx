import { Options } from "react-select";
import { FilterOptionOption } from "react-select/dist/declarations/src/filters";

export type TDropdown = {
  label?: string | undefined;
  options: any;
  onChange: any;
  value: any;
  state?: "active" | "error";
  errorMessage?: string | undefined;
  isSearchable?: boolean;
  className?: string | undefined;
  isMulti?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  filterOption?:
    | ((option: FilterOptionOption<any>, inputValue: string) => boolean)
    | null
    | undefined;
  isLoading?: boolean;
  isOptionDisabled?:
    | ((option: any, selectValue: Options<any>) => boolean)
    | undefined;
};
