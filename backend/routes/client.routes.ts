import { getInstanceRouter } from "xpresser";
const router = getInstanceRouter();

router
  .path("/client/", () => {
    router.get("@ping");
    router.get("deals", "Deals@all");
    router
      .path("", () => {
        router.post("@register");
        router.post("@login");
        router.get("@logout");
      })
      .controller("User");
  })
  .controller("App")
  .middlewares(["UserAuth.requireBasic", "UserAuth.getCurrentUser"]);
