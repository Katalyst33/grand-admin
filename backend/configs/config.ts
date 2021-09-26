import path = require("path");
const env = require("./env");
const isDev = env.NODE_ENV === "development";
const base = path.resolve(`${__dirname}/../../`);

/**
 * Your Config File.
 * See https://xpresserjs.com/configuration/
 */
export = {
  // name of app
  name: env.appName,

  // app environment
  env: env.NODE_ENV,

  /**
   * By default xpresser sets this for you.
   */
  server: {
    domain: env.appDomain,

    // Server Port
    port: env.appPort,
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
  },

  /**
   * Path settings.
   */
  // Connection Config
  mongodb: {
    url: env.MongoServer,
    database: env.dbName,
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
    public: path.resolve(env.publicPath),
    storage: "storage",

    /**
     * Point routes file to routes.ts
     */
    routesFile: "backend://routes.ts",
  },
  session: {
    startOnBoot: false,
    secret: env.sessionSecret,
    cookie: {
      path: "/",
      domain: env.appName,
      maxAge: 5000 * 60 * 24,
    },
    resave: true,
    saveUninitialized: true,
  },
};
