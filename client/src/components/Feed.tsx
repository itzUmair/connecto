import { useState, useEffect, useRef } from "react";
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
import SadIllustration from "../assets/sad_illustration.png";
import ImageIcon from "../assets/image.svg";
import VideoIcon from "../assets/video.svg";
import { storage } from "../firebase/firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

const Feed = () => {
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
  const [error, setError] = useState<string>("");
  const uid = useUserid();

  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [video, setVideo] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);
    const getUser = async () => {
      try {
        const responseForInfo = await axios.get(`/user/userPrimaryInfo/${uid}`);
        const responseForFeed = await axios.get(`/feed/get/${uid}`);
        setUserPrimaryInfo(responseForInfo.data.info);
        setFeed(responseForFeed.data.feed || []);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setError("");
    if (e.target.name === "text") {
      setText(e.target.value);
    } else if (e.target.name === "category") {
      setCategory(e.target.value);
    } else if (e.target.name === "image") {
      if (video !== "") {
        setVideo("");
      }
      const droppedFiles: FileList | null | undefined =
        imageRef?.current?.files;
      if (!droppedFiles) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(droppedFiles[0]);
      if (
        !droppedFiles[0]?.name.endsWith(".jpg") &&
        !droppedFiles[0]?.name.endsWith(".jpeg") &&
        !droppedFiles[0]?.name.endsWith(".webp")
      ) {
        setError("Please provide image in .jpg, .jpeg or .webp format");
        return;
      }
    } else {
      if (image !== "") {
        setImage("");
      }
      const droppedFiles: FileList | null | undefined =
        videoRef?.current?.files;
      if (!droppedFiles) return;

      const src = URL.createObjectURL(droppedFiles[0]);
      setVideo(src);
    }
  };

  const handlePost = async (): Promise<void> => {
    setIsPosting(true);
    const LoadingToast = toast.loading("Posting...");
    try {
      let imageDownloadURL;
      let videoDownloadURL;
      if (
        imageRef.current &&
        imageRef.current.files &&
        imageRef.current.files.length > 0
      ) {
        const postStorageRef = ref(
          storage,
          `/${uid}/posts/${new Date().toLocaleString()}`
        );
        const uploadPromiseImage = await uploadBytes(
          postStorageRef,
          imageRef?.current?.files[0]
        );
        imageDownloadURL = await getDownloadURL(uploadPromiseImage.ref);
      }
      if (
        videoRef.current &&
        videoRef.current.files &&
        videoRef.current.files.length > 0
      ) {
        const postStorageRef = ref(
          storage,
          `/${uid}/posts/${new Date().toLocaleString()}`
        );
        const uploadPromiseVideo = await uploadBytes(
          postStorageRef,
          videoRef?.current?.files[0]
        );
        videoDownloadURL = await getDownloadURL(uploadPromiseVideo.ref);
      }
      const response = await axios.post("/post/create", {
        userid: uid,
        text,
        image: imageDownloadURL,
        video: videoDownloadURL,
        category,
      });
      toast.success(response.data.message, { id: LoadingToast });
      setImage("");
      setVideo("");
      setText("");
      setCategory("");
    } catch (error) {
      toast.error("Something went wrong", { id: LoadingToast });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="2xl:mx-auto 2xl:w-[1440px]">
      <Header profilePicURL={userPrimaryInfo?.profilePicURL} />
      <div className="px-4 pb-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <div className="hidden md:flex md:flex-col md:items-end md:mt-8">
          {!isLoading && <ProfileHighlight />}
        </div>
        <div className="px-4 pb-16 mt-8 col-span-4 md:col-span-2 md:col-start-2 relative">
          <div className="w-full bg-accent flex flex-col items-center justify-center mb-4 p-2 rounded-md">
            <textarea
              maxLength={200}
              value={text}
              name="text"
              onChange={handleChange}
              placeholder="Share what's on your mind"
              className="bg-secondary w-full border border-primary px-1 pt-1 text-content mt-1 focus:outline-none focus:border-primary"
            />
            <div className="flex items-center w-full">
              <span className="w-full mt-1">
                <label
                  htmlFor="image"
                  className="flex items-center justify-center text-content cursor-pointer hover:bg-content/30 transition-colors rounded-md"
                >
                  <img src={ImageIcon} alt="image" className="w-7 h-7" />
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="image"
                  onChange={handleChange}
                  ref={imageRef}
                  className="file:hidden hidden w-full"
                />
              </span>

              <div className="w-[1px] h-6 bg-content/50 mx-1"></div>
              <span className="w-full mt-1 cursor-pointer">
                <label
                  htmlFor="video"
                  className="flex items-center justify-center text-content cursor-pointer hover:bg-content/30 transition-colors rounded-md"
                >
                  <img src={VideoIcon} alt="video" className="w-8 h-8" />
                  Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  name="video"
                  id="video"
                  onChange={handleChange}
                  ref={videoRef}
                  className="file:hidden hidden w-full"
                />
              </span>
            </div>

            {(image !== "" || video !== "") && (
              <button
                onClick={() => {
                  setImage("");
                  setVideo("");
                }}
                className="bg-red-500 px-2 py-1 text-secondary mb-2 ml-auto rounded-md"
              >
                Remove
              </button>
            )}
            {image !== "" && <img src={image} />}
            {video !== "" && <video src={video} controls autoPlay={false} />}
            {error.length > 0 && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <div className="w-full flex justify-between items-center mt-2">
              {(image !== "" || video !== "" || text !== "") && (
                <input
                  type="text"
                  placeholder="category"
                  value={category}
                  name="category"
                  onChange={handleChange}
                  maxLength={20}
                  className="bg-secondary self-start w-1/3 my-2 border border-primary px-1 pt-1 text-content focus:outline-none focus:border-primary"
                />
              )}
              {(image !== "" || video !== "" || text !== "") &&
                category !== "" && (
                  <button
                    onClick={handlePost}
                    className="bg-primary px-2 py-1 text-secondary mb-2 ml-auto rounded-md"
                    disabled={isPosting}
                  >
                    Post
                  </button>
                )}
            </div>
          </div>
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
        <div className="hidden lg:flex lg:flex-col lg:items-start lg:mt-8">
          {!isLoading && <PopularTopics />}
        </div>
      </div>
    </div>
  );
};

export default Feed;
