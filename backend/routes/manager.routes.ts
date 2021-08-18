import { getInstanceRouter } from "xpresser";
const router = getInstanceRouter();

// deals  routes

//create app /company infor mation
router
  .path("/manager", () => {
    router.post("create", "App@create");

    //deals routes

    router
      .path("/deals", () => {
        router.post("=create");
        router.get("=all");
      })
      .controller("Manager/Deals");
    /**End of Route**/

    // Single Deal
    router
      .path("deals/:dealId", () => {
        router.get("=deal");
        router.patch("=update");
        router.delete("=delete");
        router.post("image", "updateImage");
      })
      .controller("Manager/Deals");
    /**End of Route**/
  })
  .middlewares([
    "UserAuth.requireBasic",
    "UserAuth.getCurrentUser",
    "IsManagerRequest.staff",
  ]);

/*
long method
// router.post("/deals", "Deals@create");*/
