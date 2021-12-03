import { getInstanceRouter } from "xpresser";

const router = getInstanceRouter();

router.path("/profile", () => {
  router
    .path("/:referenceId", () => {
      router.get("=profile");
      router.post("=update");
    })
    .controller("Profile/Profile");
  router.post("/make-profile/:userId", "Profile/profile@makeProfile");
  router.get("/all-profiles/:userId", "Profile/profile@allProfiles");
});

router.path("/profile", () => {
  router
    .path("/upload/:referenceId", () => {
      router.patch("=update");
      router.patch("/image", "uploadDoc");
      router.patch("/images", "uploadDocs");
    })
    .controller("Profile/Profile");
});
