/**
 * Your Config File.
 * See https://xpresserjs.com/configuration/
 */
export = {
    // name of app
    name: 'Xpresser-Simple-Typescript-App',

    // app environment
    env: 'development',

    /**
     * By default xpresser sets this for you.
     */
    server: {
        domain: 'localhost',
        // Server Port
        port: 5300,
    },

    /**
     * Path settings.
     */
    paths: {
        /**
         * Base Folder
         * Where this app is called from.
         *
         * Best value for this is: __dirname
         */
        base: __dirname,

        /**
         * Point routes file to routes.ts
         */
        routesFile: "backend://routes.ts"
    },
    // Connection Config
    mongodb: {
        url: 'mongodb://127.0.0.1:27017',
        database: 'grandDb',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
};
