/**
 * Your Config File.
 * See https://xpresserjs.com/configuration/
 */
export = {
  // name of app
  name: "Xpresser-Simple-Typescript-App",

  // app environment
  env: "development",

  /**
   * By default xpresser sets this for you.
   */
  server: {
    domain: "localhost",
    // Server Port
    port: 5300,
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
    url: "mongodb://127.0.0.1:27017",
    database: "grandDb",
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
    base: __dirname,
    public: "../grand-front/dist",

    /**
     * Point routes file to routes.ts
     */
    routesFile: "backend://routes.ts",
  },
};
