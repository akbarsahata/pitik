import { forwardRef } from "react";

export const LogoText = forwardRef((prop: { title: string }, ref) => {
  return (
    <a href="/">
      <p className="text-primary-100 hover:text-primary-80 font-montserrat font-bold text-2xl cursor-pointer select-none">
        {prop.title}
      </p>
    </a>
  );
});

LogoText.displayName = "LogoText";
