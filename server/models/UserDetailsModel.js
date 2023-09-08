import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema(
  {
    fname: {
      type: mongoose.Schema.Types.String,
      minLenght: 3,
      maxLength: 20,
      required: true,
    },
    mname: {
      type: mongoose.Schema.Types.String,
      minLenght: 3,
      maxLength: 20,
    },
    lname: {
      type: mongoose.Schema.Types.String,
      minLenght: 3,
      maxLength: 20,
      required: true,
    },
    location: {
      city: {
        type: mongoose.Schema.Types.String,
        required: true,
      },
      country: {
        type: mongoose.Schema.Types.String,
        required: true,
      },
    },
    profilePicURL: {
      type: mongoose.Schema.Types.String,
    },
    profileBannerURL: {
      type: mongoose.Schema.Types.String,
    },
    friends: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "userDetailsModel",
        },
      ],
    },
    dob: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    doj: {
      type: mongoose.Schema.Types.Date,
      required: true,
      default: new Date(),
    },
    interests: {
      type: [
        {
          type: mongoose.Schema.Types.String,
        },
      ],
    },
  },
  { collection: "user_details" }
);

const userDetailsModel = mongoose.model("userDetailsModel", userDetailsSchema);

export default userDetailsModel;
