
// @ts-nocheck

import { Router } from "express";
import {
  createMapping,
  listMappings,
  getMappingById,
  updateMapping,
  deleteMapping,
} from "../../../controllers/admin/mapping/mapping.controller";

const router = Router();

router.post("/send", createMapping);

router.get("/", listMappings);

router.get("/:id", getMappingById);

router.put("/edit/:id", updateMapping);

router.delete("/delete/:id", deleteMapping);

export default router;
