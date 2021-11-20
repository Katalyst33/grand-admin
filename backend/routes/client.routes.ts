import { getInstanceRouter } from "xpresser";

const router = getInstanceRouter();

router
  .path("/client/", () => {
    router.post("@register");
    router.post("@login");
    router.get("@logout");
    router.get("destinations", "Deals@all");
    router.get("deals/:dealId", "Deals@deal");
  })
  .controller("Auth");

router
  .path("/client/", () => {
    router.get("@ping");
  })
  .controller("App")
  .middlewares(["UserAuth.requireAuth", "UserAuth.getCurrentUser"]);
