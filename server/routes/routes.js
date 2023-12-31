import express from "express";
import * as Controllers from "../controllers/controller.js";

const router = express.Router();

router.route("/").get(Controllers.home);
router.route("/signup").post(Controllers.signup);
router.route("/signin").post(Controllers.signin);
router.route("/user/profile/update").post(Controllers.updateProfile);
router.route("/user/details/:userid").get(Controllers.userDetails);
router.route("/user/highlight/:userid").get(Controllers.userHighlights);
router.route("/user/userPrimaryInfo/:userid").get(Controllers.userPrimaryInfo);
router.route("/friend/request/send").post(Controllers.sendFriendRequest);
router.route("/friend/request/cancel").post(Controllers.cancelFriendRequest);
router.route("/friend/request/accept").post(Controllers.addFriend);
router.route("/friend/remove").post(Controllers.removeFriend);
router.route("/post/create").post(Controllers.addPost);
router.route("/post/delete").post(Controllers.deletePost);
router.route("/post/like").post(Controllers.likePost);
router.route("/post/dislike").post(Controllers.dislikePost);
router.route("/post/comment/add").post(Controllers.commentOnPost);
router
  .route("/post/comment/details/:postid")
  .get(Controllers.getCommentDetails);
router.route("/user/search/:username").get(Controllers.searchUser);
router.route("/feed/get/:userid").get(Controllers.getFeed);
router.route("/post/popular").get(Controllers.popularTopics);
router.route("/post/category/:category").get(Controllers.postByCategory);

export default router;
