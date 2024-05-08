import { encryptString } from "@services/utils/encryption";
import axios from "axios";
import * as cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

const TIMEOUT = 30000;
const DEFAULT_HEADER = { "Content-Type": "application/json" };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // NOTE: If no body is passed
    if (!req.body) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Invalid input, body is required!",
        data: null,
      });
    }

    // NOTE: If email parameter is passed
    if (!req.body.credentials) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Invalid input, parameter 'credentials' is required!",
        data: null,
      });
    }
    await axios({
      method: "POST",
      headers: DEFAULT_HEADER,
      timeout: TIMEOUT,
      url: process.env.BASE_URL_V2 + "/auth/google/login",
      data: {
        credentials: req.body.credentials,
      },
    })
      .then(async (response) => {
        await axios({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${response.data.data.token}`,
            "X-ID": response.data.data.id,
          },
          timeout: TIMEOUT,
          url: process.env.BASE_URL_V2 + "/fms-users/me",
        })
          .then((resp) => {
            const role = encryptString({
              value: resp.data.data.userType,
              secret: process.env.ENCRYPTION_KEY as string,
            });
            const id = encryptString({
              value: response.data.data.id,
              secret: process.env.ENCRYPTION_KEY as string,
            });
            const tk = encryptString({
              value: response.data.data.token,
              secret: process.env.ENCRYPTION_KEY as string,
            });
            const rf = encryptString({
              value: response.data.data.refreshToken,
              secret: process.env.ENCRYPTION_KEY as string,
            });
            return res
              .status(response.data.code)
              .setHeader("Content-Type", "application/json")
              .setHeader("Set-Cookie", [
                cookie.serialize("name", resp.data.data.fullName, {
                  path: "/",
                  maxAge: 60 * 60 * 24,
                }),
                cookie.serialize("email", resp.data.data.email, {
                  path: "/",
                  maxAge: 60 * 60 * 24,
                }),
                cookie.serialize("id", id, {
                  path: "/",
                  httpOnly: true,
                  maxAge: 60 * 60 * 24,
                }),
                cookie.serialize("tk", tk, {
                  path: "/",
                  httpOnly: true,
                  maxAge: 60 * 60 * 24,
                }),
                cookie.serialize("rf", rf, {
                  path: "/",
                  httpOnly: true,
                  maxAge: 60 * 60 * 24,
                }),
                cookie.serialize("role", role, {
                  path: "/",
                  httpOnly: true,
                  maxAge: 60 * 60 * 24,
                }),
              ])
              .json({
                code: response.data.code,
                success: true,
                message: "Successfully perform request!",
                data: {
                  message: "Redacted for privacy!",
                },
              });
          })
          .catch((error) => {
            return res.status(500).json({
              code: 500,
              success: false,
              message: "Oops, something went wrong!",
              data: error,
            });
          });
      })
      .catch((error) => {
        return res.status(500).json({
          code: 500,
          success: false,
          message: "Oops, something went wrong!",
          data: error,
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
