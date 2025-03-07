import express from "express";
import dotenv from "dotenv";
import https from "https";
import expressWs from "express-ws";

dotenv.config();

const port = process.env.PORT;

const app = express();
const appws = expressWs(app);

const server = https.createServer();

app.use(express.json());

server.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`)
})