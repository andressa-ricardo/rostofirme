// @ts-nocheck

import { Router } from "express";
import {
  loginUser,
  logoutUser,
  checkAuth,
} from "../../controllers/auth/auth.controller";

const router = Router();

router.post("/login", loginUser);

router.post("/check", checkAuth);

router.post("/logout", logoutUser);

export default router;
