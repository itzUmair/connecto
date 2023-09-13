import { useState, useEffect } from "react";
import Header from "./Header";
import { useCookies } from "react-cookie";
import * as Types from "../Types";
import axios from "../api/axios";
import toaster from "react-hot-toast";
import Posts from "./Posts";
import toast from "react-hot-toast";
import ProfileHighlight from "./ProfileHighlight";
import FeedSuspense from "./FeedSuspense";

const Feed = () => {
  const [feed, setFeed] = useState<Types.PostStructure[]>();
  const [profilepic, setProfilepic] = useState<string>();
  const [cookies] = useCookies(["_auth"]);
  const cookieData = cookies as Types.CookieStructure;
  const [isLiking, setIsLiking] = useState(false);
  const [isDisLiking, setIsDisLiking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
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
            { userid: cookieData._auth_state, timestamp: new Date(), comment },
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
        userid: cookieData._auth_state,
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
      <div className="grid grid-cols-4">
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
            [1, 2, 3, 4, 5].map((suspense) => <FeedSuspense key={suspense} />)}
        </div>
        <div className="hidden md:flex md:flex-col md:items-start md:mt-8">
          <p>this is friends display</p>
        </div>
      </div>
    </div>
  );
};

export default Feed;
