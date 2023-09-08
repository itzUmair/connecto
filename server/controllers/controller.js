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
    console.log(error);
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
