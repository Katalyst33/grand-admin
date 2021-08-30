import { getInstanceRouter } from "xpresser";
/**
 * See https://xpresserjs.com/router/
 */

const router = getInstanceRouter();
router.path("/api", () => {
  require("./routes/client.routes");
  require("./routes/manager.routes");
  require("./routes/profile.routes");
});

// Api Routes

router.routesAfterPlugins = () => {
  router.any("/api/*", "AppController@api404");

  router.sendFile("/*", "../grand-front/dist/index.html");
};
