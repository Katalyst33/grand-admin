import { getInstanceRouter } from "xpresser";
import Profile from "../models/Profile";

const router = getInstanceRouter();

router
  .path("/profile", () => {
    router.get("/every-profile", "Profile/Profile@everyProfile");

    router
      .path("", () => {
        router.post("@addToCart");
        router.post("@getCart");
        router.post("@removeFromCart");
      })
      .controller("Profile/Cart");

    router
      .path("/:referenceId", () => {
        router.get("=profile");
        router.post("=update");
        router.delete("=delete");
      })
      .controller("Profile/Profile");
    router
      .path("/all-profiles/:userId", () => {
        router.get("=allProfiles");
      })
      .controller("Profile/Profile");
    router.post("/make-profile/:userId", "Profile/Profile@makeProfile");

    router
      .path("/upload/:referenceId", () => {
        router.patch("=update");
        router.patch("/document", "uploadDoc");
        router.patch("/document", "uploadDoc");
        router.delete("/document", "deleteDoc");
        // router.patch("/images", "uploadDocs");
      })
      .controller("Profile/Profile");
  })
  .middlewares([
    "UserAuth.requireAuth",
    "UserAuth.getCurrentUser",
    // "UserAuth.isCurrentUser",
  ]);
