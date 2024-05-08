import { getNewToken } from "@services/api/token";
import { decryptString } from "@services/utils/encryption";
import axios from "axios";
import * as cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import isEmpty from "validator/lib/isEmpty";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let headerCookies = req.headers.cookie;
  if (typeof headerCookies !== "string") {
    headerCookies = "";
  }

  if (headerCookies === undefined || isEmpty(headerCookies)) {
    return res.status(401).json({
      code: 401,
      success: false,
      message: "Unauthorized request!",
      data: null,
    });
  }

  const myCookies = cookie.parse(headerCookies);

  if (!myCookies.tk || !myCookies.id || !myCookies.rf) {
    return res.status(401).json({
      code: 401,
      success: false,
      message: "Unauthorized request!",
      data: null,
    });
  }

  const token = decryptString({
    value: myCookies.tk,
    secret: process.env.ENCRYPTION_KEY as string,
  });

  const id = decryptString({
    value: myCookies.id,
    secret: process.env.ENCRYPTION_KEY as string,
  });

  const rf = decryptString({
    value: myCookies.rf,
    secret: process.env.ENCRYPTION_KEY as string,
  });

  // NOTE: Get/search existing users
  if (req.method === "GET") {
    if (!req.query) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Request query required!",
        data: null,
      });
    }
    const {
      page,
      limit,
      userType,
      userTypes,
      name,
      userCode,
      email,
      phoneNumber,
      waNumber,
      ownerId,
      status,
      parentId,
      roleId,
    } = req.query;

    await axios({
      method: "GET",
      url: `${process.env.BASE_URL_V2}/fms-users`,
      params: {
        $page: page,
        $limit: limit,
        userType,
        userTypes,
        name,
        userCode,
        email,
        phoneNumber,
        waNumber,
        ownerId,
        status,
        parentId,
        roleId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "X-ID": id,
      },
    })
      .then(async (response) => {
        if (response.status === 200 || response.status === 201) {
          return res.status(response.status).json(response.data);
        } else if (response.status === 401) {
          await getNewToken({ id: id, refreshToken: rf }, res);
          // NOTE: Call this request again (recursive function)
          await handler(req, res);
        } else {
          return res.status(response.data.code).json(response.data);
        }
      })
      .catch((error) => {
        return res.status(error.response.data.code).json(error.response.data);
      });
    // NOTE: Create new user
  } else if (req.method === "POST") {
    const body = req.body;
    if (!body) {
      return res.status(401).json({
        code: 401,
        success: false,
        message: "Invalid input, body is required!",
        data: null,
      });
    }

    if (
      !body.userCode ||
      !body.fullName ||
      !body.phoneNumber ||
      !body.waNumber ||
      !body.password ||
      body.status === undefined
    ) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Invalid input from the body. Required parameter is missing!",
        data: null,
      });
    }
    await axios({
      method: "POST",
      url: process.env.BASE_URL_V2 + "/fms-users",
      data: {
        userType: body.userType,
        userCode: body.userCode,
        fullName: body.fullName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        waNumber: body.waNumber,
        password: body.password,
        status: body.status,
        ownerId: body.ownerId,
        parentId: body.parentId,
        roleId: body.roleId,
        roleIds: body.roleIds,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "X-ID": id,
      },
    })
      .then(async (response) => {
        if (response.status === 200 || response.status === 201) {
          return res.status(response.status).json({
            code: response.data.code,
            success: true,
            message: "New user created successfully!",
            data: response.data,
          });
        } else if (response.status === 401) {
          await getNewToken({ id: id, refreshToken: rf }, res);
          // NOTE: Call this request again (recursive function)
          await handler(req, res);
        } else {
          return res.status(response.data.code).json({
            code: response.data.code,
            success: false,
            message: "Oops, something went wrong!!",
            data: response.data,
          });
        }
      })
      .catch((error) => {
        return res.status(error.response.data.code).json({
          code: error.response.data.code,
          success: false,
          message: "Oops, something went wrong!!",
          data: error.response.data,
        });
      });
  } else {
    return res.status(404).json({
      code: 404,
      success: false,
      message: "Request method not found!",
      data: null,
    });
  }
}
