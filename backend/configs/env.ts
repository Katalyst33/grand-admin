import envLoader = require("@xpresser/env");
import path = require("path");
import session from "express-session";

const pathToEnv = path.resolve(
  __filename.includes(".js")
    ? `${__dirname}/../../../.env`
    : `${__dirname}/../../.env`
);

export = envLoader(pathToEnv, {
  castBoolean: true,
  required: [
    "NODE_ENV",
    "appName",
    "appPort",
    "MongoServer",
    "dbName",
    "jwtSecret",
    "sessionSecret",
    "pdfPublicKey",
    "pdfSecretKey",
    "publicPath",
  ],
}) as {
  NODE_ENV: string;
  appName: string;
  appDomain: string;
  appPort: string;
  MongoServer: string;
  dbName: string;
  jwtSecret: string;
  sessionSecret: string;
  pdfPublicKey: string;
  pdfSecretKey: string;
  publicPath: string;
  emailUsername: string;
  emailPassword: string;
  emailHost: string;
  fromEmail: string;
  emailPort: string;
  appUrl: string;
  appPhoneNumber: string;
};
