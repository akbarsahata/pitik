import BlankCircleIcon from "@icons/BlankCircleIcon.svg";
import { TDropdownSubItem } from "./DropdownSubItem.type";

const DropdownSubItem = ({
  text = "Sub-Menu",
  href,
  onClick,
}: TDropdownSubItem) => {
  return (
    <a href={href as string} onClick={onClick}>
      <div className="flex flex-row items-center justify-start hover:text-primary-80 cursor-pointer ml-2 my-1">
        <BlankCircleIcon className="h-2 w-2" />
        <p className="ml-2">{text}</p>
      </div>
    </a>
  );
};

export default DropdownSubItem;
