import express from "express";
import * as Controllers from "../controllers/controller.js";

const router = express.Router();

router.route("/").get(Controllers.home);
router.route("/signup").post(Controllers.signup);

export default router;
