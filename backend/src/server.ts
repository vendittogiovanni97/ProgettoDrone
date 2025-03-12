import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import expressSession from "express-session";
import addRoutes from "./routers";
import connectDB from "./db/dbConfig";
import MQTTService from "./mttqsConn";
import { oggi } from "./configuration/time.config";

dotenv.config();

const port = process.env.PORT;

if (process.env.SESSION_SECRET === undefined) {
  throw new Error("Define SESSION_SECRET");
}

const app = express();

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

MQTTService.getInstance();

addRoutes(app);

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}, ${oggi}`);
  });
};

startServer();
