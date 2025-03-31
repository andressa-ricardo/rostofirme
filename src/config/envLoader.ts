import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: path.resolve(__dirname, "../../.env.production") });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: path.resolve(__dirname, "../../.env.development") });
} else {
  console.error(
    "NODE_ENV não definido ou valor inválido. Certifique-se de que o .env está configurado corretamente."
  );
}

console.log(`Ambiente carregado: ${process.env.NODE_ENV}`);
