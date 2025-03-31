import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../../config/database";
import { v4 as uuidv4 } from "uuid";
import Exercise from "../exercises/exercises.admin.model";
import { PlaylistAttributes } from "../../../@types/admin/playlists";

interface PlaylistCreationAttributes
  extends Optional<PlaylistAttributes, "id"> {}

class Playlist
  extends Model<PlaylistAttributes, PlaylistCreationAttributes>
  implements PlaylistAttributes
{
  public id!: string;
  public name!: string;
  public coverImage!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Playlist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Playlist",
    tableName: "playlists",
    timestamps: true,
  }
);

export default Playlist;
