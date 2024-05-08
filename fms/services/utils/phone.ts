import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

export function getRawFormatPhone(number: string) {
  const phoneNumber = parsePhoneNumber(number, "ID");
  return phoneNumber ? "0" + phoneNumber.nationalNumber : "";
}

export function isValidPhone(number: string) {
  return isValidPhoneNumber(number, "ID") ? true : false;
}

export function getDisplayFormatPhone(number: string) {
  const phoneNumber = parsePhoneNumber(number, "ID");
  if (!phoneNumber) {
    return "";
  }

  // const formatted = phoneNumber?.formatInternational(); // international format (e.g: +62 812 3456 7890)
  const formatted = phoneNumber?.formatNational();
  return formatted; // return phone for display in national format (e.g: 0812-3456-7890)
}
