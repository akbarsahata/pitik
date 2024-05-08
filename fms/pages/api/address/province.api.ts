import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const TIMEOUT = 30000;
const DEFAULT_HEADER = { "Content-Type": "application/json" };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;
  if (req.method === "GET") {
    await axios({
      method: "GET",
      headers: DEFAULT_HEADER,
      timeout: TIMEOUT,
      url: process.env.BASE_URL_V2 + "/provinces",
      params: {
        name,
      },
    })
      .then((response) => {
        return res
          .status(200)
          .setHeader("Content-Type", "application/json")
          .json({
            code: response.data.code,
            success: true,
            message: "Successfully perform request!",
            data: response.data,
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
