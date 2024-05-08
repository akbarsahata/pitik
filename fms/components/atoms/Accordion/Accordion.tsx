import ChevronDownIcon from "@icons/ChevronDownIcon.svg";
import { PropsWithChildren, ReactNode, useState } from "react";

const Accordion = (
  props: PropsWithChildren<{
    backgroundColor?: string;
    borderColor?: string;
    chevronColor?: string;
    defaultOpen?: boolean;
    title: ReactNode;
  }>
) => {
  const [accordionOpen, setAccordionOpen] = useState(
    props.defaultOpen || false
  );

  return (
    <div className="w-full mt-4">
      <div
        onClick={() => setAccordionOpen(!accordionOpen)}
        className={`${!accordionOpen && "rounded-b-lg"} border ${
          props.backgroundColor || "bg-white"
        } ${
          props.borderColor || "border-primary-100"
        } flex flex-1 flex-row space-between items-center  rounded-t-lg px-4 py-3 cursor-pointer`}
      >
        <div className="flex-1">{props.title}</div>

        <ChevronDownIcon
          className={`${accordionOpen && "rotate-180"} ${
            props.chevronColor || "text-primary-100"
          }`}
        />
      </div>
      <div
        className={`${!accordionOpen && "hidden"} rounded-b-lg border ${
          props.backgroundColor || "bg-white"
        } ${props.borderColor || "border-primary-100"} border-t-0 px-4 py-6`}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Accordion;
