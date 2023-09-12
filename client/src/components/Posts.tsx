import * as Types from "../Types";
import ProfilePicPlaceholder from "../assets/profile_placeholder.jpg";
import { useCookies } from "react-cookie";

import LikeIcon from "../assets/like.svg";

const Posts = ({
  post,
  likePost,
  disLikePost,
  isLiking,
  isDisLiking,
}: {
  post: Types.PostStructure;
  likePost: (postID: string) => void;
  disLikePost: (postID: string) => void;
  isLiking: boolean;
  isDisLiking: boolean;
}) => {
  const [cookies] = useCookies(["_auth"]);
  const cookieData = cookies as Types.CookieStructure;

  return (
    <div className="bg-accent mb-4 py-1 rounded-md">
      <div className="flex items-center gap-x-2 p-2 border-b border-content/10">
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
      </div>
      <div className="text-content p-2">{post.text}</div>
      <div>{post.image}</div>
      <div>{post.video}</div>
      <div className="flex items-center gap-x-1 p-2">
        <p className="text-sm font text-content/60">
          {post.likes.length} {post.likes.length === 1 ? " like" : " likes"}
        </p>
        <div className="w-1 h-1 rounded-full bg-content/60"></div>
        <p className="text-sm font text-content/60">
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
        <button className="flex-1 text-content py-2 text-xs  hover:bg-content/30 transition-colors rounded-md">
          Comment
        </button>
      </div>
    </div>
  );
};

export default Posts;
