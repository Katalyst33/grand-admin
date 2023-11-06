import { Env } from "@xpresser/env";
import path from "path";

const pathToEnv = path.resolve(
  __filename.includes(".js")
    ? `${__dirname}/../../../.env`
    : `${__dirname}/../../.env`,
);

export default Env(pathToEnv, {
  NODE_ENV: Env.is.enum(["development", "production"], "development"),

  APP_NAME: Env.is.string(),
  APP_DOMAIN: Env.is.string(),
  APP_URL: Env.is.string(),
  APP_PHONE_NUMBER: Env.is.string(),

  APP_PORT: Env.is.number(),
  MONGO_SERVER: Env.is.string(),
  DB_NAME: Env.is.string(),
  JWT_SECRET: Env.is.string(),
  SESSION_SECRET: Env.is.string(),
  PDF_PUBLIC_KEY: Env.is.string(),
  PDF_SECRET_KEY: Env.is.string(),
  PUBLIC_PATH: Env.is.string(),
  EMAIL_USERNAME: Env.is.string(),
  EMAIL_PASSWORD: Env.is.string(),
  EMAIL_HOST: Env.is.string(),
  FROM_EMAIL: Env.is.string(),
  EMAIL_PORT: Env.is.string(),

  SSL: Env.is.boolean(),
  SSL_CERT: Env.optional.string(),
  SSL_KEY: Env.optional.string(),

  AMADEUS_MODE: Env.is.enum(["test", "production"], "test"),
  AMADEUS_TEST_CLIENT_ID: Env.is.string(),
  AMADEUS_TEST_CLIENT_SECRET: Env.is.string(),
  AMADEUS_LIVE_CLIENT_ID: Env.is.string(),
  AMADEUS_LIVE_CLIENT_SECRET: Env.is.string(),
});
