import { getInstanceRouter } from "xpresser";

const router = getInstanceRouter();

router.path("/profile", () => {
  router
    .path("/profile/:profileId", () => {
      router.patch("=update");
      router.post("/image", "uploadDoc");
      router.patch("/images", "uploadDocs");
    })
    .controller("profile/Profile");
});
