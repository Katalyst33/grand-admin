import { getInstanceRouter } from "xpresser";
/**
 * See https://xpresserjs.com/router/
 */

const router = getInstanceRouter();
router.path("/api", () => {
  require("./routes/client.routes");
  require("./routes/admin.routes");
});

// Api Routes

router.routesAfterPlugins = () => {
  router.any("/api/*", "AppController@api404");

  router.sendFile("/*", "dist/index.html");
};
