import { Router } from "express";
import {
    postTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
} from "../controllers/tweet.controller.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:username").get(getUserTweets);

// Secured Route : Authentication Required
router.route("/post-tweet").post(verifyAccessToken, postTweet);
router.route("/update-tweet").patch(verifyAccessToken, updateTweet);
router.route("/delete-tweet").delete(verifyAccessToken, deleteTweet);

export default router;
