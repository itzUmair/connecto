import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    image: {
      type: [
        {
          type: mongoose.Schema.Types.String,
        },
      ],
    },
    video: {
      type: [
        {
          type: mongoose.Schema.Types.String,
        },
      ],
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
            },
            timestamp: {
              type: mongoose.Schema.Types.Date,
              default: new Date(),
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
    shares: {
      type: mongoose.Schema.Types.Number,
      default: 0,
    },
  },
  { collection: "posts" }
);

const postsModel = mongoose.model("postsModel", postSchema);

export default postsModel;
