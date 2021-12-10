import { getInstance } from "xpresser";

export const $ = getInstance();

const jwt = require("jsonwebtoken");

export const maxAge = 3 * 24 * 60 * 60;

export const folderPath: Record<any, string> = {
  default: $.path.storage("uploads/destination"),
  100: $.path.storage("uploads/destination/100"),
  500: $.path.storage("uploads/destination/500"),
};

for (const folder of Object.values(folderPath)) {
  $.file.makeDirIfNotExist(folder);
}

export function randomStr() {
  return `${$.helpers.randomStr(3).toUpperCase()}0${$.helpers.randomInteger(
    100000,
    1000000
  )}`;
}
export const createToken = (id: any) => {
  return jwt.sign({ id }, "actionfilm", {
    expiresIn: maxAge,
  });
};
