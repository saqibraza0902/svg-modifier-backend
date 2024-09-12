import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";
import admin from "firebase-admin";
// @ts-ignore
import { serviceAccountJson } from "./credentials";

require("dotenv").config();
const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, your api is working perfectly");
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountJson),
});

export const db = admin.firestore();
app.use("/icons", routes);

export default app;
