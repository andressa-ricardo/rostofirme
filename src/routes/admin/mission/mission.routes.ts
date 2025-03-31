// @ts-nocheck

import { Router } from "express";
import {
  createMission,
  listMissions,
  getMissionById,
  updateMission,
  deleteMission,
} from "../../../controllers/admin/missions/missions.controller";

const router = Router();

router.post("/send", createMission);

router.get("/", listMissions);

router.get("/:id", getMissionById);

router.put("/edit/:id", updateMission);

router.delete("/delete/:id", deleteMission);

export default router;
