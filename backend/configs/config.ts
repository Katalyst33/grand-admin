import path = require("path");
import env from "./env";

const base = path.resolve(`${__dirname}/../../`);

/**
 * Your Config File.
 * See https://xpresserjs.com/configuration/
 */
export = {
  // name of app
  name: env.APP_NAME,
  url: env.APP_URL,
  phoneNumber: env.APP_PHONE_NUMBER,

  // app environment
  env: env.NODE_ENV,

  /**
   * By default xpresser sets this for you.
   */
  server: {
    domain: env.APP_DOMAIN,

    // Server Port
    port: env.APP_PORT,
    ssl: {
      enabled: env["SSL"],
      files: {
        cert: env["SSL_CERT"],
        key: env["SSL_KEY"],
      },
    },

    use: {
      cors: true,
      session: false,
      flash: true,
      ngrok: true,
      helmet: false,
    },
    router: {
      pathCase: "kebab",
    },
  },
  mailer: {
    provider: "smtp", // SMTP
    configs: {
      smtp: {
        host: env.EMAIL_HOST,
        FROM_EMAIL: env.FROM_EMAIL,
        port: env.EMAIL_PORT,
        auth: {
          user: env.EMAIL_USERNAME,
          pass: env.EMAIL_PASSWORD,
        },
      },
    },
  },
  /**
   * Path settings.
   */
  // Connection Config
  mongodb: {
    url: env.MONGO_SERVER,
    database: env.DB_NAME,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  paths: {
    /**
     * Base Folder
     * Where this app is called from.
     *
     * Best value for this is: __dirname
     */
    base,
    public: path.resolve(env.PUBLIC_PATH),
    storage: "storage",

    /**
     * Point routes file to routes.ts
     */
    routesFile: "backend://routes.ts",
  },
  session: {
    startOnBoot: false,
    secret: env.SESSION_SECRET,
    cookie: {
      path: "/",
      domain: env.APP_NAME,
      maxAge: 5000 * 60 * 24,
    },
    resave: true,
    saveUninitialized: true,
  },
};
