import mongoose from "mongoose";

const userAuthSchema = new mongoose.Schema(
  {
    email: { type: mongoose.Schema.Types.String, required: true },
    password: { type: mongoose.Schema.Types.String, required: true },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "userDetailsModel",
    },
  },
  { collation: "user_auth" }
);

const userAuthModel = mongoose.model("userAuthModel", userAuthSchema);

export default userAuthModel;
