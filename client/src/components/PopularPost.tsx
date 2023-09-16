import { useState, useEffect } from "react";
import Header from "./Header";
import * as Types from "../Types";
import axios from "../api/axios";
import toaster from "react-hot-toast";
import Posts from "./Posts";
import toast from "react-hot-toast";
import FeedSuspense from "./FeedSuspense";
import useUserid from "../hooks/useUserid";
import SadIllustration from "../assets/sad_illustration.png";

const PopularPost = () => {
  const [feed, setFeed] = useState<Types.PostStructure[]>();
  const [userPrimaryInfo, setUserPrimaryInfo] = useState<{
    _id: string;
    fname: string;
    lname: string;
    profilePicURL: string;
  }>();
  const [isLiking, setIsLiking] = useState(false);
  const [isDisLiking, setIsDisLiking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const uid = useUserid();
  const category = window.location.href.split("/").reverse()[0];
  useEffect(() => {
    setIsLoading(true);
    const getUser = async () => {
      try {
        const responseForInfo = await axios.get(`/user/userPrimaryInfo/${uid}`);
        const responseForFeed = await axios.get(`/post/category/${category}`);
        setUserPrimaryInfo(responseForInfo.data.info);
        setFeed(responseForFeed.data.posts || []);
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
    if (!feed || !userPrimaryInfo) return;
    const oldFeed = [...feed];
    const newFeed = feed.map((post) => {
      if (post._id === postID) {
        const updatedPost = {
          ...post,
          comments: [
            ...post.comments,
            { userid: userPrimaryInfo, timestamp: new Date(), comment },
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
      <Header profilePicURL={userPrimaryInfo?.profilePicURL} />
      <div className="px-4 pb-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <div className="px-4 pb-16 mt-8 col-span-4 md:col-span-2 md:col-start-2 relative">
          <h3 className="text-content font-bold text-2xl text-center mb-4">
            Category: {category}
          </h3>
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
          {!isLoading && feed && feed.length === 0 && (
            <>
              <img src={SadIllustration} className="w-36 mx-auto" />
              <h3 className="text-center text-xl font-bold text-content">
                Nothing to see here
              </h3>
              <p className="text-center text-content/70 pt-2 text-sm">
                Add friends to see posts
              </p>
            </>
          )}
          {isLoading &&
            [1, 2, 3, 4].map((suspense) => <FeedSuspense key={suspense} />)}
        </div>
      </div>
    </div>
  );
};

export default PopularPost;
