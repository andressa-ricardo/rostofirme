// @ts-nocheck


import { Router } from "express";
import {
  createPrivacyPolicy,
  listPrivacyPolicies,
  getPrivacyPolicyById,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
} from "../../../controllers/admin/privacy/privacy.controller";

const router = Router();

router.post("/send", createPrivacyPolicy);
router.get("/", listPrivacyPolicies);
router.get("/:id", getPrivacyPolicyById);
router.put("/edit/:id", updatePrivacyPolicy);
router.delete("/delete/:id", deletePrivacyPolicy);

export default router;
