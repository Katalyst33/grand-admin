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

    router
      .path("/user/:userId", () => {
        router.get("/get-user", "user");
        router.put("@updateRole");
        router.get("xxx", "xxx");
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
    router.post("/destination-image", "Manager/Upload@destinationImage");
    router.get("/gallery", "Manager/Upload@gallery");
    router.post("delete-images", "Manager/Upload@deleteImages");
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
