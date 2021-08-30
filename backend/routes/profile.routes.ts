import { getInstanceRouter } from "xpresser";

const router = getInstanceRouter();

router
  .path("/profile/profile", () => {
    router.post("=create");
  })
  .controller("profile/Profile");
