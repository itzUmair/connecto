import express from "express";
import * as Controllers from "../controllers/controller.js";

const router = express.Router();

router.route("/").get(Controllers.home);
router.route("/signup").post(Controllers.signup);
router.route("/signin").post(Controllers.signin);
router.route("/user/details/:userid").get(Controllers.userDetails);
router.route("/friend/request/send").post(Controllers.sendFriendRequest);
router.route("/friend/request/cancel").post(Controllers.cancelFriendRequest);
router.route("/friend/request/accept").post(Controllers.addFriend);
router.route("/friend/remove").post(Controllers.removeFriend);
router.route("/post/create").post(Controllers.addPost);
router.route("/post/delete").post(Controllers.deletePost);

router.route("/feed/get/:userid").get(Controllers.getFeed);
export default router;
