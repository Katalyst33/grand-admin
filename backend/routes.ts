import { getInstanceRouter } from "xpresser";
/**
 * See https://xpresserjs.com/router/
 */
import path from "path";
import { env } from "./configs/env";

const router = getInstanceRouter();
router.path("/api", () => {
  require("./routes/client.routes");
  require("./routes/manager.routes");
  require("./routes/profile.routes");
});

// Api Route

router.routesAfterPlugins = () => {
  router.any("/api/*", "AppController@api404");
  // console.log(path.resolve(`${env.publicPath}/index.html`));

  router.sendFile("/*", path.resolve(`${env.publicPath}/index.html`));
};

// console.log(path.resolve(`${env.publicPath}/index.html`), "resolve");
