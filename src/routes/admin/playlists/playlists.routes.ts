// @ts-nocheck

import { Router } from "express";
import {
  createPlaylist,
  listPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
} from "../../../controllers/admin/playlists/playlists.controller";

const router = Router();

router.post("/send", createPlaylist);

router.get("/", listPlaylists);

router.get("/:id", getPlaylistById);

router.put("/edit/:id", updatePlaylist);

router.delete("/delete/:id", deletePlaylist);

export default router;
