import { TDropdownItem } from "./DropdownItem.type";

const DropdownMenuItem = ({
  title = "Some Text",
  href,
  leadIcon,
  tailIcon,
  onClick,
  className,
}: TDropdownItem) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`flex flex-1 flex-row items-center justify-between py-1.5 ${className}`}
    >
      <div className="flex flex-1 flex-row items-center justify-start">
        {leadIcon && <div className="mr-4">{leadIcon}</div>}
        <p>{title}</p>
      </div>
      {tailIcon && (
        <div className="flex justify-center items-center">{tailIcon}</div>
      )}
    </a>
  );
};

export default DropdownMenuItem;
