import { getInstanceRouter } from "xpresser";
const router = getInstanceRouter();

router
  .path("/manager", () => {
    //deals routes
    router
      .path("/deals", () => {
        router.post("=create");
        router.get("=all");
      })
      .controller("Manager/Deals");

    // Single Deal
    router
      .path("/deals/:dealId", () => {
        router.get("=deal");
        router.patch("=update");
        router.delete("=delete");
        router.post("image", "updateImage");
      })
      .controller("Manager/Deals");

    /**End of Route**/
  })
  .middlewares([
    "UserAuth.requireAuth",
    "UserAuth.getCurrentUser",
    "IsManagerRequest.staff",
  ]);
router
  .path("/manager", () => {
    router.post("@create");
  })
  .controller("App")
  .middlewares(["IsManagerRequest.admin"]);
