import {
  userDetailsModel,
  userAuthModel,
  postsModel,
} from "../models/models.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const home = async (req, res) => {
  res.status(200).send({ message: "Connecto API. Developed by Umair." });
};

export const signin = async (req, res) => {
  // TODO
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

    if (userExists.length) {
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
