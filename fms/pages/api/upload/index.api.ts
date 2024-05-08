import { getNewToken } from "@services/api/token";
import { decryptString } from "@services/utils/encryption";
import axios from "axios";
import * as cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import isEmpty from "validator/lib/isEmpty";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  if (req.method == "POST") {
    let uploadPhotoAddress =
      process.env.BASE_URL_V2 + "/upload?folder=" + req.query.folder;
    await axios
      .post(uploadPhotoAddress, req, {
        data: req.body,
        headers: {
          "Content-Type": req.headers["content-type"] as string, // which is multipart/form-data with boundary included
          Authorization: token,
          "X-ID": id,
        },
      })
      .then(async (response) => {
        if (response.status === 200 || response.status === 201) {
          return res.status(201).json({
            location: response.data.data.url,
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
      .catch((err) => {
        return res.status(err.response.data.code).json({
          code: err.response.data.code,
          success: false,
          message: "Oops, something went wrong!!",
          data: err.response.data,
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

export default handler;
