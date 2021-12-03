import { getInstanceRouter } from "xpresser";
const router = getInstanceRouter();

router
  .path("/manager", () => {
    // all users

    router
      .path("/users", () => {
        router.get("=all");
      })
      .controller("Manager/User");
    //deals routes
    router
      .path("/destination", () => {
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
        router.post("use-images", "useImages");
        router.post("deselect-images", "deselectImages");
      })
      .controller("Manager/Deals");

    /**End of Route**/

    //tool box

    router
      .path("/seed-data", () => {
        router.get("=seed");
      })
      .controller("Manager/Seeder");
    // gallery routes
    router.post("/destination-image", "Manager/upload@destinationImage");
    router.get("/gallery", "Manager/upload@gallery");
    router.post("delete-images", "Manager/upload@deleteImages");
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
