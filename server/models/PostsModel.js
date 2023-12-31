import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    text: {
      type: mongoose.Schema.Types.String,
      maxLength: 500,
    },
    image: {
      type: mongoose.Schema.Types.String,
    },
    video: {
      type: mongoose.Schema.Types.String,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userDetailsModel",
      required: true,
    },
    timestamp: {
      type: mongoose.Schema.Types.Date,
      default: new Date(),
      required: true,
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "userDetailsModel",
        },
      ],
    },
    comments: {
      type: [
        {
          type: {
            userid: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref: "userDetailsModel",
            },
            comment: {
              type: mongoose.Schema.Types.String,
              required: true,
              maxLength: 200,
            },
            timestamp: {
              type: mongoose.Schema.Types.Date,
              default: new Date().toLocaleString(),
              required: true,
            },
          },
        },
      ],
    },
    category: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },
  { collection: "posts" }
);

const postsModel = mongoose.model("postsModel", postSchema);

export default postsModel;
