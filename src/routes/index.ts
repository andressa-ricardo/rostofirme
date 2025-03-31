// @ts-nocheck

import { Router, Request, Response } from "express";

const router = Router();

import userRouter from "./user/user.routes";
import chattMessageRouter from "./chat/chat.routes";
import questionnaireRouter from "./questionnaire/questionnaire.routes";
import categoryRouter from "./admin/category/category.routes";
import mappingRouter from "./admin/mapping/mapping.routes";
import missionRouter from "./admin/mission/mission.routes";
import playlistRouter from "../routes/admin/playlists/playlists.routes";
import privacityRouter from "../routes/admin/privacity/privacity.routes";
import activityRouter from "./activity/activity.routes";
import exerciseRouter from "./admin/exercises/exercises.routes";
import profileRouter from "./profile/profile.routes";
import videosRouter from "./saves/saves.routes";
import authRouter from "./auth/auth.routes";

import Exercise from "../models/admin/exercises/exercises.admin.model";
import Video from "../models/admin/exercises/videos/video.admin.model";
import VideoAnalysis from "../models/admin/exercises/videos/analysis.admin.model";
import Playlist from "../models/admin/playlists/playlists.admin.model";
import PlaylistExercise from "../models/admin/playlists/playlistexercise.admin.model";
import Mission from "../models/admin/missions/missions.admin.model";
import Category from "../models/admin/category/category.admin.model";
import { MissionExercise } from "../models/admin/missions/missionexercice.model";
import { MissionCategory } from "../models/admin/missions/missioncategory.model";
import { User } from "../models";
import QuestionnaireResponse from "../models/questionnaire/questionnaire.model";
import Questionnaire from "../models/admin/questionnaire/questionnaire.admin.model";
import MySaves from "../models/saves/mysaves.model";
import ExerciseCategory from "../models/admin/exercises/exercisecategory.model";

router.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});
Exercise.hasMany(Video, { foreignKey: "exercise_id", as: "video" });
Video.belongsTo(Exercise, { foreignKey: "exercise_id", as: "exercise" });

Playlist.belongsToMany(Exercise, {
  through: PlaylistExercise,
  foreignKey: "playlistId",
  as: "exercises",
});
Exercise.belongsToMany(Playlist, {
  through: PlaylistExercise,
  foreignKey: "exerciseId",
  as: "playlists",
});
Mission.belongsToMany(Exercise, {
  through: MissionExercise,
  foreignKey: "missionId",
  as: "exercises",
});

Exercise.belongsToMany(Mission, {
  through: MissionExercise,
  foreignKey: "exerciseId",
  as: "missions",
});

Mission.belongsToMany(Category, {
  through: MissionCategory,
  foreignKey: "missionId",
  as: "categories",
});

Category.belongsToMany(Mission, {
  through: MissionCategory,
  foreignKey: "categoryId",
  as: "missions",
});

User.hasMany(QuestionnaireResponse, {
  foreignKey: "userId",
  as: "responses",
});

Questionnaire.hasMany(QuestionnaireResponse, {
  foreignKey: "questionId",
  as: "responses",
});

QuestionnaireResponse.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

QuestionnaireResponse.belongsTo(Questionnaire, {
  foreignKey: "questionId",
  as: "question",
});

MySaves.belongsTo(Video, { foreignKey: "videoId", as: "videoDetails" });

Exercise.belongsToMany(Category, {
  through: "exercisecategories",
  foreignKey: "exerciseId",
  as: "categories",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",

});

Category.belongsToMany(Exercise, {
  through: "exercisecategories",
  foreignKey: "categoryId",
  as: "exercises",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});




router.use("/users", userRouter);
router.use("/questionnaire", questionnaireRouter);
router.use("/category", categoryRouter);
router.use("/mapping", mappingRouter);
router.use("/mission", missionRouter);
router.use("/playlist", playlistRouter);
router.use("/privacity", privacityRouter);
router.use("/activity", activityRouter);
router.use("/exercise", exerciseRouter);
router.use("/profile", profileRouter);
router.use("/videos", videosRouter);
router.use("/chat", chattMessageRouter);
router.use("/auth", authRouter);


export default router;
