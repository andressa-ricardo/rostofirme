import app from "./App";
import http from "http";
import routes from "./routes";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

app.use(routes);

const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Api-Key",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  },
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export { io };
