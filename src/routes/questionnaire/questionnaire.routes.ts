// @ts-nocheck

import { Router } from "express";
import {
  createResponse,
  getAllResponses,
  getResponsesByUser,
  updateResponse,
  deleteResponse,
  getQuestionnaires,
  createQuestionnaire,
  deleteQuestionnaire,
  updateQuestionnaire,
  getUserResponses,
} from "../../controllers/questionnaire/questionnaire.controller";
import { uploadQuestionnaireImage } from "../../helpers/uploadHelper";

const router = Router();

router.post("/send", createQuestionnaire);
router.get("/", getQuestionnaires);
router.put("/edit/:id", updateQuestionnaire);
router.delete("/delete/:id", deleteQuestionnaire);

router.post("/answer/send", uploadQuestionnaireImage, createResponse);
router.get("/answer", getAllResponses);
router.get("/answer/:userId", getResponsesByUser);
router.put("/answer/edit/:id", updateResponse);
router.delete("/answer/delete/:id", deleteResponse);

router.get("/user-answer/:userId", getUserResponses);

export default router;
