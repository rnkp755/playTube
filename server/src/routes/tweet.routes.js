import { Router } from "express";
import {
      postTweet,
      getUserTweets,
      updateTweet,
      deleteTweet
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:username/tweets").get(getUserTweets)

// Secured Route : Authentication Required
router.route("/post-tweet").post(verifyJWT, postTweet)
router.route("/update-tweet").patch(verifyJWT, updateTweet)
router.route("/delete-tweet").delete(verifyJWT, deleteTweet)

export default router;