// @ts-nocheck

import express from "express";
import {
  createExercise,
  getExerciseById,
  listExercises,
  deleteExercise,
  updateExercise,
  uploadMiddleware,
} from "../../../controllers/admin/exercises/exercises.controller";

const router = express.Router();

router.post("/send", uploadMiddleware, createExercise);
router.get("/:id", getExerciseById);
router.get("/", listExercises);
router.put("/edit/:id", updateExercise);
router.delete("/delete/:id", deleteExercise);

export default router;
