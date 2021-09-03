import { getInstanceRouter } from "xpresser";

const router = getInstanceRouter();

router.path("/profile", () => {
  router
    .path("/data/:referenceId", () => {
      router.get("=profile");
    })
    .controller("Profile/Profile");
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
