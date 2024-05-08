import CloseIcon from "@icons/CloseIcon.svg";
import HamburgerIcon from "@icons/HamburgerIcon.svg";
import { LogoText } from "@logo/LogoText";
import Link from "next/link";
import { NextRouter } from "next/router";
import { useState } from "react";
import { DesktopMainMenu, MobileMainMenu } from "./MainMenu";
import { ProfileMenu } from "./ProfileMenu";

//   Browser
//  ┌───────────────────────────────────────────────────────────────────────────┐
//  │     Logo                        Main Menu                 Profile Menu    │
//  ├─Navigation Bar────────────────────────────────────────────────────────────┤
//  │                                                                           │
//  │                                                                           │
//  │                                                                           │
//  │                                  Content                                  │
//  │                                                                           │
//  │                                                                           │
//  │                                                                           │
//  │                                                                           │
//  └───────────────────────────────────────────────────────────────────────────┘

const NavigationBar = ({ router }: { router: NextRouter }) => {
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  return (
    <nav className="bg-white drop-shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-row py-4 px-6 sm:px-8 lg:px-10">
        {/* Hamburger on Mobile */}
        <div className="flex-1 flex lg:hidden items-center justify-start">
          <div
            onClick={() => setIsMobileMenuVisible(!isMobileMenuVisible)}
            className="cursor-pointer p-1"
          >
            {isMobileMenuVisible ? (
              <CloseIcon className="text-2xl" />
            ) : (
              <HamburgerIcon className="text-2xl" />
            )}
          </div>
        </div>

        {/* Logo */}
        <Link className="flex-1 flex items-center" href="/">
          <LogoText title="Pitik FMS" />
        </Link>

        {/* Main Menu */}
        <div className="flex-1 hidden lg:flex justify-center">
          <DesktopMainMenu />
        </div>

        {/* Account Menu */}
        <div className="flex flex-1 lg:flex-none justify-end items-center">
          <ProfileMenu router={router} />
        </div>
      </div>

      {/* Mobile Main Menu */}
      <div
        className={`${
          isMobileMenuVisible ? "flex lg:hidden" : "hidden"
        } flex-1 border-t-gray-100 border-t`}
      >
        <MobileMainMenu />
      </div>
    </nav>
  );
};

export default NavigationBar;
