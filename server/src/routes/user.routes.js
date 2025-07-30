import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    getCurrentUser,
    checkAuthStatus,
    updateUserDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getChannelDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
);
router.route("/login").post(loginUser);

// Public routes - no authentication required
router.route("/auth-status").get(checkAuthStatus);

// Secured Route : Authentication Required
router.route("/logout").post(verifyAccessToken, logoutUser);
router.route("/refresh-access-token").post(refreshAccessToken);
router.route("/change-password").post(verifyAccessToken, changeUserPassword);
router.route("/current-user").get(verifyAccessToken, getCurrentUser);
router.route("/update-account").patch(verifyAccessToken, updateUserDetails);
router
    .route("/update-avatar")
    .patch(verifyAccessToken, upload.single("avatar"), updateUserAvatar);

router
    .route("/update-cover-image")
    .patch(
        verifyAccessToken,
        upload.single("coverImage"),
        updateUserCoverImage
    );

router.route("/:username").get(verifyAccessToken, getChannelDetails);

export default router;
