// @ts-nocheck

import { Router } from "express";
import {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
} from "../../controllers/profile/profile.controller";

const router = Router();

router.post("/send", createProfile);
router.get("/", getProfiles);
router.get("/:id", getProfileById);
router.put("/edit/:id", updateProfile);
router.delete("/delete/:id", deleteProfile);

export default router;
