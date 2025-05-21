import { Router } from "express";
import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getAllLikedVideos,
} from "../controllers/like.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Secured Route : Authentication Required
router.route("/like-video/:videoId").post(verifyAccessToken, toggleVideoLike);
router
    .route("/like-comment/:commentId")
    .post(verifyAccessToken, toggleCommentLike);
router.route("/like-tweet/:tweetId").post(verifyAccessToken, toggleTweetLike);
router.route("/liked-videos").get(verifyAccessToken, getAllLikedVideos);

export default router;
