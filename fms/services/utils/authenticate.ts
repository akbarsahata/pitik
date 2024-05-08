import * as cookie from "cookie";
import { GetServerSidePropsContext } from "next";
import isEmpty from "validator/lib/isEmpty";
import isJWT from "validator/lib/isJWT";
import isUUID from "validator/lib/isUUID";
import { whitelist } from "./acl";
import { decryptString } from "./encryption";

const matchRuleShort = (str: string, rule: string) => {
  var escapeRegex = (str: string) =>
    str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(
    "^" + rule.split("*").map(escapeRegex).join(".*") + "$"
  ).test(str);
};

export const isAuthenticate = async (context: GetServerSidePropsContext) => {
  let headerCookie = context.req.headers.cookie;
  if (typeof headerCookie !== "string") {
    headerCookie = "";
  }

  if (headerCookie === undefined || isEmpty(headerCookie)) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?continue=" + context.resolvedUrl,
      },
      props: {},
    };
  }

  const myCookies = cookie.parse(headerCookie);
  if (!myCookies["id"]) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?continue=" + context.resolvedUrl,
      },
      props: {},
    };
  }

  if (!myCookies["tk"]) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?continue=" + context.resolvedUrl,
      },
      props: {},
    };
  }

  if (!myCookies["rf"]) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?continue=" + context.resolvedUrl,
      },
      props: {},
    };
  }

  const idTrue = decryptString({
    value: myCookies.id as string,
    secret: process.env.ENCRYPTION_KEY as string,
  });
  if (!isUUID(idTrue)) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?continue=" + context.resolvedUrl,
      },
      props: {},
    };
  }

  const tkTrue = decryptString({
    value: myCookies.tk as string,
    secret: process.env.ENCRYPTION_KEY as string,
  });
  if (!isJWT(tkTrue)) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?continue=" + context.resolvedUrl,
      },
      props: {},
    };
  }

  const rfTrue = decryptString({
    value: myCookies.rf as string,
    secret: process.env.ENCRYPTION_KEY as string,
  });
  if (isEmpty(rfTrue)) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?continue=" + context.resolvedUrl,
      },
      props: {},
    };
  }

  const role = decryptString({
    value: myCookies.role as string,
    secret: process.env.ENCRYPTION_KEY as string,
  });

  if (!role) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?continue=" + context.resolvedUrl,
      },
      props: {},
    };
  }

  const index = whitelist[role].findIndex((resource) => {
    if (matchRuleShort(context.resolvedUrl, resource)) {
      return true;
    }
  });

  if (index === -1) {
    context.res.statusCode = 403;
    return {
      redirect: {
        destination: "/403",
        permanent: false,
      },
      props: {},
    };
  }

  if (
    context.resolvedUrl.includes(
      "/master/contract-library/contract/create/own-farm"
    ) ||
    context.resolvedUrl.includes(
      "/master/contract-library/contract/detail/own-farm"
    )
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
