import Button from "@components/atoms/Button/Button";
import Input from "@components/atoms/Input/Input";
import Loading from "@components/wrappers/Loading/Loading";
import GoogleIcon from "@icons/GoogleIcon.svg";
import WarningIcon from "@icons/WarningIcon.svg";
import { Logo } from "@logo/index";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { postAuthUser, postAuthUserWithGoogle } from "@services/api";
import { isEmptyString } from "@services/utils/string";
import { AxiosError } from "axios";
import * as cookie from "cookie";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { MouseEventHandler, useEffect, useState } from "react";
import { useMutation } from "react-query";
import isEmpty from "validator/lib/isEmpty";

const Login: NextPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isError, setIsError] = useState<
    "username" | "password" | "general" | ""
  >("");

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (isEmptyString(username)) {
          setIsError("username");
          return;
        }

        if (isEmptyString(password)) {
          setIsError("password");
          return;
        }
        authenticate.mutate();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, password, isError]);

  const authenticate = useMutation(
    ["authenticate"],
    async () => await postAuthUser({ username, password }),
    {
      onError: (error: AxiosError<{ data: { status: number } }>) => {
        console.log(error);
        setIsError("general");
        const statusCode = error.response?.data?.data.status || 500;
        setErrorText(
          `${statusCode}: ${
            statusCode === 404
              ? "User's not found"
              : statusCode === 400
              ? "Invalid credentials"
              : statusCode === 403
              ? "Forbidden, too many invalid attempts. Please try again in 1 hour"
              : error.response?.statusText
          }!`
        );
      },
      onSuccess: () => {
        if (router.query.continue) {
          router.push(
            { pathname: (router.query.continue as string) || "/" },
            undefined,
            { shallow: true }
          );
          return;
        }

        router.push({ pathname: "/" }, undefined, { shallow: true });
      },
    }
  );

  const authenticateWithGoogle = useMutation(
    ["authenticateWithGoogle"],
    async (credentials: string) => await postAuthUserWithGoogle(credentials),
    {
      onError: (error: AxiosError<{ data: { status: number } }>) => {
        console.log(error);
        setIsError("general");
        const statusCode = error.response?.data?.data.status || 500;
        setErrorText(
          `${statusCode}: ${
            statusCode === 404
              ? "User's not found"
              : statusCode === 400
              ? "Invalid credentials"
              : statusCode === 403
              ? "Forbidden, too many invalid attempts. Please try again in 1 hour"
              : error.response?.statusText
          }!`
        );
      },
      onSuccess: () => {
        if (router.query.continue) {
          router.push(
            { pathname: (router.query.continue as string) || "/" },
            undefined,
            { shallow: true }
          );
          return;
        }

        router.push({ pathname: "/" }, undefined, { shallow: true });
      },
    }
  );
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse: TokenResponse) => {
      authenticateWithGoogle.mutate(tokenResponse.access_token);
    },
    onError: (e) => {
      console.log("Login Failed", e);
    },
  });

  if (
    authenticateWithGoogle.isLoading ||
    authenticateWithGoogle.isSuccess ||
    authenticate.isLoading ||
    authenticate.isSuccess
  )
    return <Loading />;

  return (
    <>
      <Head>
        <title>Login | Farm Management System Pitik</title>
      </Head>

      <main className="bg-white">
        <div className="h-screen w-full flex items-center justify-center">
          <div className="flex-1 max-w-md space-y-4 shadow-xl rounded border border-gray-100 pt-6 pb-12 px-12">
            <div className="flex justify-center items-center">
              <Logo />
            </div>
            <div
              className={`${
                isError === "general" ? "flex" : "hidden"
              } bg-red-100 px-4 py-4 flex-row items-center justify-start rounded`}
            >
              <div className="mr-2 text-red-500 text-xl">
                <WarningIcon />
              </div>
              <p className="text-red-500">
                {errorText || "Authentication failed!"}
              </p>
            </div>
            <Input
              label="Username"
              className="w-full"
              state={`${isError === "username" ? "error" : "active"}`}
              errorMessage="Please input a username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setIsError("");
              }}
            />
            <Input
              label="Password"
              className="w-full"
              state={`${isError === "password" ? "error" : "active"}`}
              errorMessage="Please input a valid password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsError("");
              }}
            />
            <div className="pt-4 space-y-6">
              <Button
                state={`${authenticate.isLoading ? "loading" : "active"}`}
                className="w-full"
                title="Login"
                size="sm"
                onClick={() => {
                  if (isEmptyString(username)) {
                    setIsError("username");
                    return;
                  }

                  if (isEmptyString(password)) {
                    setIsError("password");
                    return;
                  }
                  authenticate.mutate();
                }}
              />
              <hr />
              <LoginWithGoogleButton onClick={() => loginWithGoogle()} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

const LoginWithGoogleButton = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      onClick={onClick}
      className="mx-auto flex flex-row items-center justify-center rounded-lg border-gray-300 border-2 py-2 w-full hover:bg-gray-50"
    >
      <GoogleIcon className="text-lg" />
      <p className="ml-2">Login with Google</p>
    </button>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let headerCookie = ctx.req?.headers.cookie;
  if (typeof headerCookie !== "string") {
    headerCookie = "";
  }

  if (headerCookie === undefined || isEmpty(headerCookie)) {
    return {
      props: {},
    };
  }

  const myCookies = cookie.parse(headerCookie);
  if (!myCookies.session) {
    return {
      props: {},
    };
  }

  if (myCookies.session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default Login;
