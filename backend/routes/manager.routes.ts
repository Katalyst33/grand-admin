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

        router.get("@gallery");
      })
      .controller("Manager/Deals");
    router.post("delete-images", "Manager/Deals@deleteImages");
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

    //tool box

    router
      .path("/seed-data", () => {
        router.get("=seed");
      })
      .controller("Manager/Seeder");

    router.post("/destination-image", "upload@destinationImage");
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
