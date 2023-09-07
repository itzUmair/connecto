import express from "express";
import cors from "cors";
import connectDB from "./database/database.js";
import router from "./routes/routes.js";

const app = express();

app.use(
  cors({
    methods: "*",
    origins: "*",
    credentials: true,
  })
);

app.use(express.json());

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
