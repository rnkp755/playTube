import { Router } from "express";
import {
      postAVideo,
      deleteAVideo,
      fetchAllVideos,
      updateVideoDetails,
      togglePublishStatus
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:username").get(fetchAllVideos)

// Secured Route : Authentication Required
router.route("/").post(
      verifyJWT,
      upload.fields([
            {
                  name: "video",
                  maxCount: 1
            },
            {
                  name: "thumbnail",
                  maxCount: 1
            }
      ]),
      postAVideo
)

router.route("/delete/:videoId").delete(verifyJWT, deleteAVideo)
router.route("/update/:videoId").patch(verifyJWT, upload.single("thumbnail"), updateVideoDetails)
router.route("/publish/:videoId").patch(verifyJWT, togglePublishStatus)

export default router;