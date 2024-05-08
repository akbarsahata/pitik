import CryptoJS from "crypto-js";

export const encryptString = ({
  value,
  secret,
}: {
  value: string;
  secret: string;
}) => {
  return CryptoJS.AES.encrypt(value, secret).toString();
};

export const decryptString = ({
  value,
  secret,
}: {
  value: string;
  secret: string;
}) => {
  var bytes = CryptoJS.AES.decrypt(value, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};
