import { Env } from "@xpresser/env";

export const env = Env(".env", {
  NODE_ENV: Env.is.string(),
  APP_PORT: Env.is.number(),
  MONGO_SERVER: Env.is.string(),
  DB_NAME: Env.is.string(),
  JWT_SECRET: Env.is.string(),
  SESSION_SECRET: Env.is.string(),
  PDF_PUBLIC_KEY: Env.is.string(),
  PDF_SECRET_KEY: Env.is.string(),
  PUBLIC_PATH: Env.is.string(""),
  EMAIL_USERNAME: Env.is.string(),
  EMAIL_PASSWORD: Env.is.string(),
  EMAIL_HOST: Env.is.string(),
  FROM_EMAIL: Env.is.string(),
  EMAIL_PORT: Env.is.string(),
  SSL: Env.is.boolean(),
  SSL_CERT: Env.optional.string(),
  SSL_KEY: Env.optional.string(),
});

export const isDev = env.NODE_ENV === "development";
