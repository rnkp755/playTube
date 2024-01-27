import { Router } from "express";
import {
      registerUser,
      loginUser,
      logoutUser,
      refreshAccessToken,
      changeUserPassword,
      getCurrentUser,
      updateUserDetails,
      updateUserAvatar,
      updateUserCoverImage,
      getChannelDetails
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
      upload.fields([
            {
                  name: "avatar",
                  maxCount: 1
            },
            {
                  name: "coverImage",
                  maxCount: 1
            }
      ]),
      registerUser
)
router.route("/login").post(loginUser)

// Secured Route : Authentication Required
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-access-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeUserPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateUserDetails)
router.route("/update-avatar")
      .patch(
            verifyJWT,
            upload.single("avatar"),
            updateUserAvatar
      )

router.route("/update-cover-image")
      .patch(
            verifyJWT,
            upload.single("coverImage"),
            updateUserCoverImage
      )

router.route("/:username").get(verifyJWT, getChannelDetails)

export default router;