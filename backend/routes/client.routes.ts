import { getInstanceRouter } from "xpresser";
const router = getInstanceRouter();

router.get("deals", "Deals@all");
router.get("deals/:dealId", "Deals@deal");

router
  .path("/client/", () => {
    router.post("@register");
    router.post("@login");
    router.get("@logout");
  })
  .controller("Auth");
router
  .path("/client/", () => {
    router.get("@ping");
  })
  .controller("App")
  .middlewares(["UserAuth.requireBasic", "UserAuth.getCurrentUser"]);
