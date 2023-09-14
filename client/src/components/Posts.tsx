import { useState } from "react";
import * as Types from "../Types";
import { useCookies } from "react-cookie";
import Comments from "./Comments";

import ProfilePicPlaceholder from "../assets/profile_placeholder.jpg";
import LikeIcon from "../assets/like.svg";
import SendIcon from "../assets/send.svg";

const Posts = ({
  post,
  likePost,
  disLikePost,
  commentOnPost,
  isLiking,
  isDisLiking,
}: {
  post: Types.PostStructure;
  likePost: (postID: string) => void;
  commentOnPost: (postID: string, comment: string) => void;
  disLikePost: (postID: string) => void;
  isLiking: boolean;
  isDisLiking: boolean;
}) => {
  const [cookies] = useCookies(["_auth"]);
  const cookieData = cookies as Types.CookieStructure;
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [viewComments, setViewComments] = useState<
    Types.CommentStructure[] | null
  >(null);

  return (
    <>
      <div className="bg-accent mb-4 py-1 rounded-md">
        <a
          href={`/profile/${post.userid._id}`}
          className="flex items-center gap-x-2 p-2 border-b border-content/10"
        >
          <img
            src={
              post.userid.profilePicURL === ""
                ? ProfilePicPlaceholder
                : post.userid.profilePicURL
            }
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-content capitalize text-sm">
              {post.userid.fname + " " + post.userid.lname}
            </p>
            <p className="text-xs text-content/50">
              {new Date(post.timestamp).toLocaleDateString()}
            </p>
          </div>
        </a>
        <p className="text-content p-2">{post.text}</p>
        {post.image !== "" && <img src={post.image} className="w-full" />}
        {post.video !== "" && (
          <video src={post.image} controls autoPlay className="w-full" />
        )}
        <div className="flex items-center gap-x-1 p-2">
          <p className="text-sm font text-content/60">
            {post.likes.length} {post.likes.length === 1 ? " like" : " likes"}
          </p>
          <div className="w-1 h-1 rounded-full bg-content/60"></div>
          <p
            className={`text-sm font text-content/60 ${
              post.comments.length > 0 && "cursor-pointer"
            }`}
            onClick={() => {
              setIsCommenting(false);
              setViewComments((prevState) =>
                !prevState
                  ? post.comments.length > 0
                    ? post.comments
                    : null
                  : null
              );
            }}
          >
            {post.comments.length}
            {post.comments.length === 1 ? " comment" : " comments"}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              post.likes.includes(cookieData._auth_state)
                ? disLikePost(post._id)
                : likePost(post._id);
            }}
            disabled={isLiking || isDisLiking}
            className="flex-1 text-content py-2 text-xs hover:bg-content/30 transition-colors rounded-md disabled:cursor-default"
          >
            {post.likes.includes(cookieData._auth_state) ? (
              <img src={LikeIcon} alt="liked" className="w-4 h-4 mx-auto" />
            ) : (
              "Like"
            )}
          </button>
          <div className="w-[1px] h-6 bg-content/50 mx-1"></div>
          <button
            onClick={() => {
              setViewComments(null);
              setIsCommenting((prevState) => !prevState);
            }}
            className="flex-1 text-content py-2 text-xs  hover:bg-content/30 transition-colors rounded-md"
          >
            Comment
          </button>
        </div>
        {isCommenting && (
          <div className="flex items-center gap-x-2 p-2">
            <textarea
              placeholder="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={200}
              className="bg-transparent w-full h-max border border-content p-1 text-content mt-1 focus:outline-none focus:border-primary"
            />
            <button
              className="w-6 h-6 disabled:opacity-50"
              disabled={comment.length === 0}
              onClick={() => {
                commentOnPost(post._id, comment);
                setIsCommenting(false);
                setComment("");
              }}
            >
              <img src={SendIcon} alt="send" />
            </button>
          </div>
        )}
      </div>
      {viewComments && <Comments comments={viewComments} />}
    </>
  );
};

export default Posts;
