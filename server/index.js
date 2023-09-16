import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./database/database.js";
import router from "./routes/routes.js";
import {
  loggerMiddleware,
  // authenticationMiddleware,
} from "./middlewares/middleware.js";

const app = express();

app.use(
  cors({
    origin: "https://connecto-sm.vercel.app",
    methods: "*",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(authenticationMiddleware);
app.use(loggerMiddleware);
app.use("/api/v1", router);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(8080, () => console.log("Server started..."));
  } catch (error) {
    console.log("server did not start...");
    console.log(error);
  }
};

startServer();
