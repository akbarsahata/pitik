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

  const buildingId = req.query.id;
  if (req.method === "GET") {
    await axios({
      method: "GET",
      url: `${process.env.BASE_URL_V2}/buildings/${buildingId}`,
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
  } else if (req.method === "PUT") {
    if (!req.body) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Invalid input, body is required!",
        data: null,
      });
    }

    if (
      !req.body.farmId ||
      !req.body.name ||
      !req.body.buildingTypeId ||
      req.body.status === undefined ||
      req.body.length === undefined ||
      req.body.width === undefined ||
      req.body.height === undefined
    ) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Invalid input, missing parameter!",
        data: null,
      });
    }

    await axios({
      method: "PUT",
      url: `${process.env.BASE_URL_V2}/buildings/${buildingId}`,
      data: {
        farmId: req.body.farmId,
        name: req.body.name,
        buildingTypeId: req.body.buildingTypeId,
        isActive: req.body.status,
        length: req.body.length,
        width: req.body.width,
        height: req.body.height,
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
  } else {
    return res.status(404).json({
      code: 404,
      success: false,
      message: "Request method not found!",
      data: null,
    });
  }
}
