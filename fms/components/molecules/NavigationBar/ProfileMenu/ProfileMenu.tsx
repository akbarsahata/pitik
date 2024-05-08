import { Avatar } from "@avatar/index";
import DropdownItem from "@components/atoms/DropdownItem/DropdownItem";
import ChevronDownIcon from "@icons/ChevronDownIcon.svg";
import LogOutIcon from "@icons/LogOutIcon.svg";
import { deleteAuthSession } from "@services/api";
import { Dropdown } from "antd";
import { getCookie } from "cookies-next";
import { NextRouter } from "next/router";

const onLogOut = async (router: NextRouter) => {
  await deleteAuthSession()
    .then((response) => {
      if (response.data.code === 200) {
        router.push("/login");
        return;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const AccountMenu = ({ router }: { router: NextRouter }) => (
  <div className="mt-3 max-w-xs bg-white border border-gray-200 px-6 py-4 rounded-md drop-shadow-lg flex flex-col justify-start">
    <div className="self-center">
      <Avatar size="xl" />
    </div>
    <p className="text-center mt-2 font-bold text-base">{getCookie("name")}</p>
    <p className="text-center text-gray-500 text-xs">{getCookie("email")}</p>
    <div className="mt-4">
      <DropdownItem
        leadIcon={<LogOutIcon />}
        title="Log Out"
        onClick={() => onLogOut(router)}
      />
    </div>
  </div>
);

export const ProfileMenu = ({ router }: { router: NextRouter }) => {
  return (
    <Dropdown
      overlay={() => <AccountMenu router={router} />}
      trigger={["click"]}
      placement="bottomRight"
    >
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="flex flex-row items-center"
      >
        <Avatar size="xs" />
        <ChevronDownIcon className="text-primary-100 ml-1" />
      </a>
    </Dropdown>
  );
};
