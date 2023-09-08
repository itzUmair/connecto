import {
  userDetailsModel,
  userAuthModel,
  postsModel,
} from "../models/models.js";

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const home = async (req, res) => {
  res.status(200).send({ message: "Connecto API. Developed by Umair." });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await userAuthModel.findOne({ email });
    if (!userExists) {
      res.status(404).send({ error: "no account with this email was found." });
      return;
    }

    const validPassword = await bcrypt.compare(password, userExists.password);

    if (!validPassword) {
      res.status(400).send({ error: "incorrect password" });
      return;
    }

    const accessToken = jwt.sign(
      userExists.userid.toString(),
      process.env.JWT_SECRET
    );

    res.status(200).send({ token: accessToken });
  } catch (error) {
    res.status(500).send({ message: "something went wrong" });
  }
};

export const signup = async (req, res) => {
  const {
    fname,
    mname,
    lname,
    city,
    country,
    profilePicURL,
    profileBannerURL,
    dob,
    interests,
    email,
    password,
  } = req.body;

  try {
    const userExists = await userAuthModel.find({ email });

    if (userExists.length !== 0) {
      res.status(400).send({ error: "account with this email already exists" });
      return;
    }

    const user = await userDetailsModel.create({
      fname,
      mname,
      lname,
      location: {
        city,
        country,
      },
      profilePicURL,
      profileBannerURL,
      dob,
      interests,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    await userAuthModel.create({
      email,
      password: hashedPassword,
      userid: user._id,
    });

    res.status(201).send({ message: "account created successfully" });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: error._message });
      return;
    }

    res.status(500).send({ message: "something went wrong" });
  }
};

export const userDetails = async (req, res) => {
  const { userid } = req.params;

  const uid = new mongoose.Types.ObjectId(userid);

  try {
    const details = await userDetailsModel.findById(uid);
    res.status(200).send({ details });
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

export const sendFriendRequest = async (req, res) => {
  const { userid, friendid } = req.body;

  const uid = new mongoose.Types.ObjectId(userid);
  const fid = new mongoose.Types.ObjectId(friendid);

  try {
    const friend = await userDetailsModel.findById(fid);
    friend.friendRequestsReceived.push(uid);
    await friend.save();

    const user = await userDetailsModel.findById(uid);
    user.friendRequestsSent.push(fid);
    await user.save();

    res.status(200).send({ message: "friend request sent" });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ error: error._message });
      return;
    }
    res.status(500).send({ error: "something went wrong" });
  }
};

export const cancelFriendRequest = async (req, res) => {
  const { userid, friendid, state } = req.body;

  const uid = new mongoose.Types.ObjectId(userid);
  const fid = new mongoose.Types.ObjectId(friendid);

  try {
    const friend = await userDetailsModel.findById(fid);
    if (state === "sent") {
      const newFriendRequestRecievedForFriend =
        friend.friendRequestsReceived.filter(
          (friend) => friend.toString() !== userid
        );
      friend.friendRequestsReceived = newFriendRequestRecievedForFriend;
    } else {
      const newFriendRequestSentForFriend = friend.friendRequestsSent.filter(
        (friend) => friend.toString() !== userid
      );
      friend.friendRequestsSent = newFriendRequestSentForFriend;
    }
    await friend.save();

    const user = await userDetailsModel.findById(uid);
    if (state === "received") {
      const newFriendRequestRecievedForUser =
        user.friendRequestsReceived.filter(
          (friend) => friend.toString() !== friendid
        );
      user.friendRequestsReceived = newFriendRequestRecievedForUser;
    } else {
      const newFriendRequestSentForUser = user.friendRequestsSent.filter(
        (friend) => friend.toString() !== friendid
      );
      user.friendRequestsSent = newFriendRequestSentForUser;
    }
    await user.save();

    res.status(200).send({ message: "friend request cancelled" });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ error: error._message });
      return;
    }
    res.status(500).send({ error: "something went wrong" });
  }
};

export const addFriend = async (req, res) => {
  const { userid, friendid } = req.body;

  const uid = new mongoose.Types.ObjectId(userid);
  const fid = new mongoose.Types.ObjectId(friendid);

  try {
    const friend = await userDetailsModel.findById(fid);
    friend.friends.push(uid);
    const newFriendRequestSentForFriend = friend.friendRequestsSent.filter(
      (friend) => friend.toString() !== userid
    );
    friend.friendRequestsSent = newFriendRequestSentForFriend;
    await friend.save();

    const user = await userDetailsModel.findById(uid);
    const newFriendRequestReceivedForUser = user.friendRequestsReceived.filter(
      (friend) => friend.toString() !== friendid
    );
    user.friendRequestsReceived = newFriendRequestReceivedForUser;
    user.friends.push(fid);
    await user.save();

    res.status(200).send({
      message: `${friend.fname + " " + friend.lname} and you are now friends`,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ error: error._message });
      return;
    }
    res.status(500).send({ error: "something went wrong" });
  }
};

export const removeFriend = async (req, res) => {
  const { userid, friendid } = req.body;

  const uid = new mongoose.Types.ObjectId(userid);
  const fid = new mongoose.Types.ObjectId(friendid);

  try {
    const friend = await userDetailsModel.findById(fid);
    const newFriendListForFriend = friend.friends.filter(
      (friend) => friend.toString() !== userid
    );
    friend.friends = newFriendListForFriend;
    await friend.save();

    const user = await userDetailsModel.findById(uid);
    const newFriendListForUser = user.friends.filter(
      (friend) => friend.toString() !== friendid
    );
    user.friends = newFriendListForUser;
    await user.save();

    res.status(200).send({
      message: `${
        friend.fname + " " + friend.lname
      } and you are not friends anymore`,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ error: error._message });
      return;
    }
    res.status(500).send({ error: "something went wrong" });
  }
};

export const addPost = async (req, res) => {
  const { text, image, video, userid, category } = req.body;

  const uid = new mongoose.Types.ObjectId(userid);

  try {
    await postsModel.create({
      text,
      image,
      video,
      userid: uid,
      category,
    });

    res.status(201).send({ message: "post created successfully." });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ error: error._message });
      return;
    }
    res.status(500).send({ error: "something went wrong" });
  }
};

export const deletePost = async (req, res) => {
  const { postid } = req.body;

  const id = new mongoose.Types.ObjectId(postid);
  try {
    await postsModel.findByIdAndDelete(id);
    res.status(200).send({ message: "post deleted successfully" });
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

export const getFeed = async (req, res) => {
  const { userid } = req.params;
  const id = new mongoose.Types.ObjectId(userid);

  try {
    let feed = [];

    const { friends } = await userDetailsModel
      .findById(id)
      .select({ friends: 1 });

    const userPost = await postsModel.find({ userid: id });

    if (friends.length === 0 && userPost.length === 0) {
      res.status(200).send({ message: "Add friends to see posts" });
    } else if (friends.length > 0 && userPost.length === 0) {
      const friendPost = await postsModel
        .find({ userid: { $in: friends } })
        .sort({ timestamp: 1 });
      res.status(200).send({ feed: friendPost });
    } else if (friends.length === 0 && userPost.length > 0) {
      res.status(200).send({ feed: userPost });
    } else {
      const friendPost = await postsModel
        .find({ userid: { $in: friends } })
        .sort({ timestamp: 1 });
      feed = [...friendPost, ...userPost];
      res.status(200).send({ feed });
    }
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

export const likePost = async (req, res) => {
  // TODO
};

export const dislikePost = async (req, res) => {
  // TODO
};

export const sharePost = async (req, res) => {
  // TODO
};

export const commentOnPost = async (req, res) => {
  // TODO
};
