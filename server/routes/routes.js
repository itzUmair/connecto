import express from "express";
import * as Controllers from "../controllers/controller.js";

const router = express.Router();

router.route("/").get(Controllers.home);
router.route("/signup").post(Controllers.signup);
router.route("/signin").post(Controllers.signin);

export default router;
