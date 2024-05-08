import { SENSOR_TYPES } from "@constants/index";
import { randomBytes } from "crypto";
import ReactHtmlParser from "react-html-parser";
import isEmpty from "validator/lib/isEmpty";
import isMACAddress from "validator/lib/isMACAddress";

export const isEmptyString = (value: string) => {
  return isEmpty(value || "", { ignore_whitespace: false });
};

export const randomHexString = (length?: number) => {
  return randomBytes(length || 16).toString("hex");
};

export const convertStringToHtml = (value: string) => {
  return ReactHtmlParser(value);
};

export const validateStringTime = (time: string) => {
  // References: https://stackoverflow.com/a/8318367
  const timeRegex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
  return timeRegex.test(time);
};

export const isValidMacAddress = (value: string) => {
  return isMACAddress(value || "");
};

export const isFutureDate = (
  date: string,
  minDate?: string,
  includeMinDate?: boolean
) => {
  if (isEmptyString(date)) return false;
  let comparisonDate = new Date().setHours(0, 0, 0, 0);
  if (minDate) {
    comparisonDate = new Date(minDate).setHours(0, 0, 0, 0);
  }

  var inputDate = new Date(date).setHours(0, 0, 0, 0);
  if (includeMinDate === true) {
    if (inputDate <= comparisonDate) return false;
  }

  if (inputDate < comparisonDate) return false;
  return true;
};

export const isValidSensorCode = (
  sensor: string,
  deviceType: typeof SENSOR_TYPES[number]
) => {
  const sensorRegex =
    deviceType === "XIAOMI_SENSOR"
      ? /ATC_\w{6}/
      : deviceType === "CAMERA"
      ? /BRD_\w{6}/
      : /.*/;
  return sensorRegex.test(sensor);
};
