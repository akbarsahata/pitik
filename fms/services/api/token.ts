import { encryptString } from "@services/utils/encryption";
import axios from "axios";
import * as cookie from "cookie";
import { NextApiResponse } from "next";

const TIMEOUT = 30000;
const DEFAULT_HEADER = { "Content-Type": "application/json" };

const date = new Date();
const cookiesRemoved = [
  cookie.serialize("name", "", {
    path: "/",
    maxAge: 60 * 60 * 24,
    expires: new Date(date.setDate(date.getDate() - 1)),
  }),
  cookie.serialize("email", "", {
    path: "/",
    maxAge: 60 * 60 * 24,
    expires: new Date(date.setDate(date.getDate() - 1)),
  }),
  cookie.serialize("id", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(date.setDate(date.getDate() - 1)),
  }),
  cookie.serialize("tk", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(date.setDate(date.getDate() - 1)),
  }),
  cookie.serialize("rf", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(date.setDate(date.getDate() - 1)),
  }),
  cookie.serialize("role", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(date.setDate(date.getDate() - 1)),
  }),
];

export const getNewToken = async (
  payload: { id: string; refreshToken: string },
  res: NextApiResponse
) => {
  await axios({
    method: "POST",
    headers: DEFAULT_HEADER,
    timeout: TIMEOUT,
    url: process.env.BASE_URL_V2 + "/auth/refresh_token",
    data: {
      id: payload.id,
      token: payload.refreshToken,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
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
                  httpOnly: true,
                  maxAge: 60 * 60 * 24,
                }),
                cookie.serialize("email", resp.data.data.email, {
                  path: "/",
                  httpOnly: true,
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
            return res
              .status(401)
              .setHeader("Set-Cookie", cookiesRemoved)
              .json({
                code: 401,
                success: false,
                message: "Oops, something went wrong!",
                data: error,
              });
          });
      } else {
        return res.status(401).setHeader("Set-Cookie", cookiesRemoved).json({
          code: 401,
          success: false,
          message: "Oops, something went wrong!",
          data: null,
        });
      }
    })
    .catch((error) => {
      return res.status(401).setHeader("Set-Cookie", cookiesRemoved).json({
        code: 401,
        success: false,
        message: "Oops, something went wrong!",
        data: error,
      });
    });
};
