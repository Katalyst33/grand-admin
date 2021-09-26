import { getInstanceRouter } from "xpresser";
/**
 * See https://xpresserjs.com/router/
 */
import env from "./configs/env";
import path from "path";

const router = getInstanceRouter();
router.path("/api", () => {
  require("./routes/client.routes");
  require("./routes/manager.routes");
  require("./routes/profile.routes");
});

// Api Routes

router.routesAfterPlugins = () => {
  router.any("/api/*", "AppController@api404");

  router.sendFile("/*", path.resolve(`${env.publicPath}/index.html`));
};

// console.log(path.resolve(`${env.publicPath}/index.html`), "resolve");
