import { Sequelize } from "sequelize";
import "./envLoader";

const env = process.env.NODE_ENV || "development";

let dbConfig: any = {};

if (env === "development") {
  dbConfig = {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  };
} else if (env === "production") {
  dbConfig = {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  };
}

const sequelize = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USER || "",
  process.env.DB_PASSWORD || "",
  dbConfig
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão estabelecida com sucesso. 🚀🚀🚀");

    await sequelize.sync({ alter: true });
    console.log("✅ Banco de dados sincronizado com sucesso!");
  } catch (error) {
    console.error("😭 Não foi possível conectar ao banco de dados: ", error);
  }
})();

export default sequelize;
