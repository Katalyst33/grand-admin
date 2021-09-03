import { getInstanceRouter } from "xpresser";

const router = getInstanceRouter();

router.path("/profile", () => {
  router
    .path("/data/:profileId", () => {
      router.get("=profile");
    })
    .controller("Profile/Profile");
});

router.path("/profile", () => {
  router
    .path("/upload/:profileId", () => {
      router.patch("=update");
      router.post("/image", "uploadDoc");
      router.patch("/images", "uploadDocs");
    })
    .controller("Profile/Profile");
});
