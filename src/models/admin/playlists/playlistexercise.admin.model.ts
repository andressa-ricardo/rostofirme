import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/database";
import Playlist from "./playlists.admin.model";
import Exercise from "../exercises/exercises.admin.model";

class PlaylistExercise extends Model {}

PlaylistExercise.init(
  {
    playlistId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Playlist, key: "id" },
      primaryKey: true,
    },
    exerciseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Exercise, key: "id" },
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: "playlists_exercises",
    timestamps: false,
  }
);


export default PlaylistExercise;
