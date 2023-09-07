import express from "express";
import cors from "cors";
import connectDB from "./database/database.js";

const app = express();

app.use(
  cors({
    methods: "*",
    origins: "*",
    credentials: true,
  })
);

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
