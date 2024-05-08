import Select, { CSSObjectWithLabel } from "react-select";
import { TDropdown } from "./Dropdown.type";

const Dropdown = ({
  label,
  options,
  onChange,
  value,
  state = "active",
  errorMessage = "This is an error message",
  isSearchable = false,
  isMulti = false,
  isDisabled = false,
  filterOption,
  isLoading,
  isOptionDisabled,
  isClearable = false,
}: TDropdown) => {
  const bgPrimary100 = "#F47B20";
  const bgPrimary20 = "#FEEFD2";
  return (
    <div>
      {label && <p className="text-md mb-1 ml-1 text-gray-500">{label}</p>}
      <Select
        components={{
          IndicatorSeparator: () => null,
        }}
        menuPortalTarget={
          typeof window !== "undefined" ? document.body : undefined
        }
        isOptionDisabled={isOptionDisabled}
        isClearable={isClearable}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (
            styles: CSSObjectWithLabel,
            // FIXME: add types for dropdownState
            dropdownState: any
          ) => ({
            ...styles,
            paddingTop: 4,
            paddingBottom: 4,
            borderRadius: 8,
            backgroundColor: dropdownState.isDisabled ? "#F9FAFB" : "white",
            borderColor: state === "error" ? "#EF4444" : "#D1D5DB",
            ":hover": {
              borderColor: bgPrimary100,
            },
            boxShadow: "none",
            cursor: dropdownState.isDisabled && "not-allowed",
          }),
          option: (styles: CSSObjectWithLabel, state: any) => ({
            ...styles,
            cursor: "pointer",
            backgroundColor: state.isSelected
              ? bgPrimary100
              : state.isFocused
              ? bgPrimary20
              : "white",
            ":active": {
              backgroundColor: !state.isSelected ? bgPrimary20 : "white",
            },
            ":hover": {
              backgroundColor: !state.isSelected ? bgPrimary20 : bgPrimary100,
            },
          }),
        }}
        isLoading={isLoading}
        filterOption={filterOption}
        isDisabled={isDisabled}
        isMulti={isMulti}
        isSearchable={isSearchable}
        value={value}
        onChange={onChange}
        options={options}
      />
      {state === "error" ? (
        <p className="text-md mb-1 ml-1 text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
};

export default Dropdown;
