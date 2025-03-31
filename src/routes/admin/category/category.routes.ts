// @ts-nocheck

import express from "express";
import {
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  listCategories
} from "../../../controllers/admin/category/category.controller";

const router = express.Router();

router.post("/send", createCategory);
router.get("/:id", getCategoryById);
router.get("/", listCategories);
router.put("/edit/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
