import { Router } from "express";
import {
      toggleVideoLike,
      toggleCommentLike,
      toggleTweetLike,
      getAllLikedVideos
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secured Route : Authentication Required
router.route("/like-video/:videoId").post(verifyJWT, toggleVideoLike)
router.route("/like-comment/:commentId").post(verifyJWT, toggleCommentLike)
router.route("/like-tweet/:tweetId").post(verifyJWT, toggleTweetLike)
router.route("/liked-videos").get(verifyJWT, getAllLikedVideos)

export default router;