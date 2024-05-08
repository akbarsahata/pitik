import { USER_TYPE } from "@constants/index";
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

  // NOTE: Get/search existing coops
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
      ownerId,
      farmName,
      farmId,
      coopName,
      coopCode,
      contractTypeId,
      branchId,
      coopTypeId,
      status,
      farmingCycleStatus,
    } = req.query;

    await axios({
      method: "GET",
      url: `${process.env.BASE_URL_V2}/coops`,
      params: {
        $page: page,
        $limit: limit,
        ownerId,
        farmName,
        farmId,
        coopCode,
        contractTypeId,
        branchId,
        coopName,
        coopTypeId,
        status,
        farmingCycleStatus,
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
      !body.owner ||
      !body.farmId ||
      !body.coopCode ||
      !body.coopName ||
      !body.coopTypeId ||
      !body.contractTypeId
    ) {
      return res.status(400).json({
        code: 400,
        success: false,
        message: "Invalid input from the body. Required parameter is missing!",
        data: null,
      });
    }
    if (
      (body.userType === USER_TYPE.KK.full ||
        body.userType === USER_TYPE.AK.full) &&
      body.ownerId === undefined
    ) {
      return res.status(400).json({
        code: 400,
        success: false,
        message:
          "Invalid input, parameter 'ownerId' and 'userType' are required!",
        data: null,
      });
    }

    await axios({
      method: "POST",
      url: process.env.BASE_URL_V2 + "/coops",
      data: {
        owner: body.owner,
        farmId: body.farmId,
        coopCode: body.coopCode,
        coopName: body.coopName,
        coopTypeId: body.coopTypeId,
        contractTypeId: body.contractTypeId,
        leaderId: body.leaderId,
        workerIds: body.workerIds,
        chickTypeId: body.chickTypeId,
        numFan: body.numFan,
        capacityFan: body.capacityFan,
        height: body.height,
        length: body.lengthData,
        width: body.width,
        maxCapacity: body.maxCapacity,
        chickInDate: req.body.chickInDate ? req.body.chickInDate : undefined,
        remarks: body.remarks,
        status: body.status,
        otherControllerType: body.otherControllerType,
        otherInletType: body.otherInletType,
        otherHeaterType: body.otherHeaterType,
        images: body.images,
        userSupervisorId: body.userSupervisorId,
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
            message: "New coop created successfully!",
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
