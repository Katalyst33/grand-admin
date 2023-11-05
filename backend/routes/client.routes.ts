import { getInstanceRouter } from "xpresser";

const router = getInstanceRouter();


router
  .path("/client/", () => {
    router.post("@register");
    router.post("@login");
    router.get("@logout");
    router.post("@forgotPassword");
    router.post("@resetPassword");
    router.get("destinations", "Destination@all");
    router.get("deals/:dealId", "Destination@deal");
  })
  .controller("Auth");

router
  .path("/client/", () => {
    router.get("@ping");
    router.post("@contactForm");

    router.path("flights", () => {
        router.post("@search");
    }).controller("Flights");
  })
  .controller("App")
  .middlewares(["UserAuth.requireAuth", "UserAuth.getCurrentUser"]);
