import { Env } from "@xpresser/env";



export const env = Env(".env", {
  NODE_ENV: Env.is.string(),
  appName: Env.is.string(),
  appDomain: Env.is.string(),
  appPort: Env.is.string(),
  MongoServer: Env.is.string(),
  dbName: Env.is.string(),
  jwtSecret: Env.is.string(),
  sessionSecret: Env.is.string(),
  pdfPublicKey: Env.is.string(),
  pdfSecretKey: Env.is.string(),
  publicPath: Env.is.string(),
  emailUsername: Env.is.string(),
  emailPassword: Env.is.string(),
  emailHost: Env.is.string(),
  fromEmail: Env.is.string(),
  emailPort: Env.is.string(),
  appUrl: Env.is.string(),
  appPhoneNumber: Env.is.string(),
});

export const isDev = env.NODE_ENV === "development";
