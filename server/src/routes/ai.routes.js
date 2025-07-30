import { Router } from "express";
import { answerQuery } from "../controllers/ai.controller.js";

const router = Router();

router.post("/query", answerQuery);

export default router;