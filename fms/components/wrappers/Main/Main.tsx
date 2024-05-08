import Button from "@components/atoms/Button/Button";
import { Dropdown as AntDropdown } from "antd";
import Head from "next/head";
import { JSXElementConstructor, ReactElement, ReactNode } from "react";

type ButtonVisible = {
  children: ReactNode;
  headTitle: string;
  pageTitle: string;
  button?: true;
  onButtonClick: any;
  buttonTitle: string;
  buttonType?: "primary" | "outline" | "icon-outline";
  buttonState?: "active" | "disabled" | "loading";
  icon?: ReactNode;
  isButtonDropdown?: boolean;
  dropdownContent?:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | any;
};

type ButtonInvisible = {
  children: ReactNode;
  headTitle: string;
  pageTitle: string;
  button?: false;
  onButtonClick?: any;
  buttonTitle?: string;
  buttonType?: "primary" | "outline" | "icon-outline";
  buttonState?: "active" | "disabled" | "loading";
  icon?: ReactNode;
  isButtonDropdown?: boolean;
  dropdownContent?:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | any;
};

type WrapperType = ButtonVisible | ButtonInvisible;

const MainWrapper = ({
  children,
  headTitle,
  pageTitle,
  button = false,
  onButtonClick,
  buttonTitle,
  buttonType = "primary",
  buttonState = "active",
  icon,
  isButtonDropdown = false,
  dropdownContent,
}: WrapperType) => {
  return (
    <>
      <Head>
        <title>{headTitle} | FMS Pitik</title>
      </Head>
      <main className="pb-8">
        <div className="bg-white m-8 p-8 rounded border border-gray-100 max-w-7xl mx-auto">
          <div className="flex flex-row items-center justify-between">
            <p className="text-xl font-medium">{pageTitle}</p>
            {isButtonDropdown
              ? button && (
                  <div>
                    <AntDropdown
                      overlay={dropdownContent}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      {button && (
                        <Button
                          isAnchor={false}
                          size="xs"
                          onClick={onButtonClick}
                          title={buttonTitle as string}
                          icon={icon}
                          type={buttonType}
                          state={buttonState}
                        />
                      )}
                    </AntDropdown>
                  </div>
                )
              : button && (
                  <Button
                    isAnchor={false}
                    size="xs"
                    onClick={onButtonClick}
                    title={buttonTitle as string}
                    icon={icon}
                    type={buttonType}
                    state={buttonState}
                  />
                )}
          </div>
          {children}
        </div>
      </main>
    </>
  );
};

export default MainWrapper;
