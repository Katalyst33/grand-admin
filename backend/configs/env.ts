import {Env} from "@xpresser/env";
import path from "path";

const pathToEnv = path.resolve(
  __filename.includes(".js")
    ? `${__dirname}/../../../.env`
    : `${__dirname}/../../.env`
);


export default Env(pathToEnv, {
    NODE_ENV: Env.is.enum(["development", "production"], "development"),
    appName: Env.is.string(),
    appDomain: Env.is.string(),
    appPort: Env.is.number(),
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

    SSL: Env.is.boolean(),
    SSL_CERT: Env.optional.string(),
    SSL_KEY: Env.optional.string(),
})