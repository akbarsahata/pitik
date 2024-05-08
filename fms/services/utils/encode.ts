export const encodeString = (val: string) => {
  return Buffer.from(val, "utf8").toString("base64");
};

export const decodeString = (val: string) => {
  return Buffer.from(val, "base64").toString("utf8");
};
