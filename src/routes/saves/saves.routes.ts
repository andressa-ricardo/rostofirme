// @ts-nocheck

import { Router } from "express";
import { saveVideo, removeSavedVideo, getSavedVideos } from "../../controllers/saves/saves.controller";

const router = Router();

router.post("/save", saveVideo);
router.delete("/delete", removeSavedVideo);
router.get("/:userId", getSavedVideos);

export default router;
