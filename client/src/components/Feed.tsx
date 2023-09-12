import { useState, useEffect } from "react";
import Header from "./Header";
import { useCookies } from "react-cookie";
import * as Types from "../Types";
import axios from "../api/axios";
import toaster from "react-hot-toast";
import Posts from "./Posts";
import toast from "react-hot-toast";

const Feed = () => {
  const [feed, setFeed] = useState<Types.PostStructure[]>();
  const [profilepic, setProfilepic] = useState<string>();
  const [cookies] = useCookies(["_auth"]);
  const cookieData = cookies as Types.CookieStructure;
  const [isLiking, setIsLiking] = useState(false);
  const [isDisLiking, setIsDisLiking] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const responseForPP = await axios.get(
          `/user/profilepic/${cookieData._auth_state}`
        );
        const responseForFeed = await axios.get(
          `/feed/get/${cookieData._auth_state}`
        );
        setProfilepic(responseForPP.data.profilePicURL);
        setFeed(responseForFeed.data.feed);
        console.log(responseForFeed.data.feed);
      } catch (error) {
        toaster.error("Something went wrong. Please try again later");
      }
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const likePost = async (postID: string): Promise<void> => {
    setIsLiking(true);
    if (!feed) return;
    const oldFeed = [...feed];
    const newFeed = feed.map((post) => {
      if (post._id === postID) {
        if (!post.likes.includes(cookieData._auth_state)) {
          const updatedPost = {
            ...post,
            likes: [...post.likes, cookieData._auth_state],
          };
          return updatedPost;
        }
        return post;
      } else {
        return post;
      }
    });
    setFeed(newFeed);
    try {
      await axios.post("/post/like", {
        postid: postID,
        userid: cookieData._auth_state,
      });
    } catch (error) {
      toast.error("Something went wrong.");
      setFeed(oldFeed);
    } finally {
      setIsLiking(false);
    }
  };

  const disLikePost = async (postID: string): Promise<void> => {
    setIsDisLiking(true);
    if (!feed) return;
    const oldFeed = [...feed];
    const newFeed = feed.map((post) => {
      if (post._id === postID) {
        if (post.likes.includes(cookieData._auth_state)) {
          const updatedPost = {
            ...post,
            likes: [
              ...post.likes.filter((like) => like !== cookieData._auth_state),
            ],
          };
          return updatedPost;
        }
        return post;
      } else {
        return post;
      }
    });
    setFeed(newFeed);
    try {
      await axios.post("/post/dislike", {
        postid: postID,
        userid: cookieData._auth_state,
      });
    } catch (error) {
      toast.error("Something went wrong.");
      setFeed(oldFeed);
    } finally {
      setIsDisLiking(false);
    }
  };

  return (
    <div>
      <Header profilePicURL={profilepic} />
      <div className="px-4 mt-8 w-full md:w-2/5 md:mx-auto ">
        {feed &&
          feed.map((post, index) => (
            <Posts
              key={index}
              post={post}
              likePost={likePost}
              disLikePost={disLikePost}
              isLiking={isLiking}
              isDisLiking={isDisLiking}
            />
          ))}
      </div>
    </div>
  );
};

export default Feed;
