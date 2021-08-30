import { getInstanceRouter } from "xpresser";

const router = getInstanceRouter();

router
  .path("/profile/", () => {
    router.post("@profile");
    router.get("@profile");
    router.get("profile", "Profile@all");
    router.get("profile/:profileId", "Profiles@profile");
    router.post("@upload");
  })
  .controller("Profile");
