import { Router } from "express";
import {
    postAVideo,
    deleteAVideo,
    fetchAllVideos,
    updateVideoDetails,
    togglePublishStatus,
    getVideoById,
    getVideoSuggestions,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:username?").get(fetchAllVideos);
router.route("/id/:videoId").get(getVideoById);
router.route("/suggestions/:videoId").get(getVideoSuggestions);

// Secured Route : Authentication Required
router.route("/post").post(
    verifyAccessToken,
    upload.fields([
        {
            name: "video",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    postAVideo
);
router.route("/delete/:videoId").delete(verifyAccessToken, deleteAVideo);
router
    .route("/update/:videoId")
    .patch(verifyAccessToken, upload.single("thumbnail"), updateVideoDetails);
router
    .route("/toggle-publish-status/:videoId")
    .patch(verifyAccessToken, togglePublishStatus);

export default router;
