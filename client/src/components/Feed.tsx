import { useState, useEffect } from "react";
import Header from "./Header";
import * as Types from "../Types";
import axios from "../api/axios";
import toaster from "react-hot-toast";
import Posts from "./Posts";
import toast from "react-hot-toast";
import ProfileHighlight from "./ProfileHighlight";
import PopularTopics from "./PopularTopics";
import FeedSuspense from "./FeedSuspense";
import useUserid from "../hooks/useUserid";

const Feed = () => {
  const [feed, setFeed] = useState<Types.PostStructure[]>();
  const [profilepic, setProfilepic] = useState<string>();
  const [isLiking, setIsLiking] = useState(false);
  const [isDisLiking, setIsDisLiking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const uid = useUserid();

  useEffect(() => {
    setIsLoading(true);
    const getUser = async () => {
      try {
        const responseForPP = await axios.get(`/user/profilepic/${uid}`);
        const responseForFeed = await axios.get(`/feed/get/${uid}`);
        setProfilepic(responseForPP.data.profilePicURL);
        setFeed(responseForFeed.data.feed);
        console.log(responseForFeed.data.feed);
      } catch (error) {
        toaster.error("Something went wrong. Please try again later");
      } finally {
        setIsLoading(false);
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
        if (!post.likes.includes(uid)) {
          const updatedPost = {
            ...post,
            likes: [...post.likes, uid],
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
        userid: uid,
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
        if (post.likes.includes(uid)) {
          const updatedPost = {
            ...post,
            likes: [...post.likes.filter((like) => like !== uid)],
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
        userid: uid,
      });
    } catch (error) {
      toast.error("Something went wrong.");
      setFeed(oldFeed);
    } finally {
      setIsDisLiking(false);
    }
  };

  const commentOnPost = async (
    postID: string,
    comment: string
  ): Promise<void> => {
    if (!feed) return;
    const oldFeed = [...feed];
    const newFeed = feed.map((post) => {
      if (post._id === postID) {
        const updatedPost = {
          ...post,
          comments: [
            ...post.comments,
            { userid: uid, timestamp: new Date(), comment },
          ],
        };
        return updatedPost;
      } else {
        return post;
      }
    });
    setFeed(newFeed);
    try {
      await axios.post("/post/comment/add", {
        postid: postID,
        comment,
        userid: uid,
      });
      toast.success("Comment sent!");
    } catch (error) {
      toast.error("Something went wrong.");
      setFeed(oldFeed);
    }
  };

  return (
    <div className="2xl:mx-auto 2xl:w-[1440px]">
      <Header profilePicURL={profilepic} />
      <div className="px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <div className="hidden md:flex md:flex-col md:items-end md:mt-8">
          {!isLoading && <ProfileHighlight />}
        </div>
        <div className="px-4 mt-8 col-span-4 md:col-span-2 md:col-start-2">
          {!isLoading &&
            feed &&
            feed.map((post, index) => (
              <Posts
                key={index}
                post={post}
                likePost={likePost}
                disLikePost={disLikePost}
                isLiking={isLiking}
                isDisLiking={isDisLiking}
                commentOnPost={commentOnPost}
              />
            ))}
          {isLoading &&
            [1, 2, 3, 4].map((suspense) => <FeedSuspense key={suspense} />)}
        </div>
        <div className="hidden lg:flex lg:flex-col lg:items-start lg:mt-8">
          {!isLoading && <PopularTopics />}
        </div>
      </div>
    </div>
  );
};

export default Feed;
