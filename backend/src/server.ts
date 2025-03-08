import express from "express";
import dotenv from "dotenv";
import https from "https";
import expressWs from "express-ws";
import cors from "cors";
import expressSession from "express-session";
import { oggi } from "./configuration/time.config";
import addRoutes from "./routers";
import { WebSocketManager } from "./socket-io";
import fs from "fs"

dotenv.config();

const port = process.env.PORT;

if (process.env.SESSION_SECRET === undefined) {
  throw new Error("Define SESSION_SECRET");
}

const app = express();
const appws = expressWs(app);

const server = https.createServer({
  key: fs.readFileSync('../certificati/domain.key'),
  cert: fs.readFileSync('../certificati/domain.crt'),
  passphrase: "pippo"
}, appws.app)


app.use(express.json());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 86400000,
      sameSite: "strict",
      secure: true,
    },
  })
);

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

new WebSocketManager(server)

addRoutes(app)

server.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port} , ${oggi}`);
});
