import express from "express";
import dotenv from "dotenv";
import https from "https";
import expressWs from "express-ws";
import cors from "cors";
import expressSession from "express-session";
import { oggi } from "./configuration/time.config";

dotenv.config();

const port = process.env.PORT;

const app = express();
const appws = expressWs(app);

const server = https.createServer(appws.app);

app.use(express.json());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET!,
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

server.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port} alle ${oggi}`);
});
