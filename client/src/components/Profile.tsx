import { useEffect, useState } from "react";
import * as Types from "../Types";
import axios from "../api/axios";
import toast from "react-hot-toast";
import Header from "./Header";
import ProfilePicPlaceholder from "../assets/profile_placeholder.jpg";
import ProfileBannerPlaceholder from "../assets/placeholder_banner.webp";
import useUserid from "../hooks/useUserid";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userDetails, setUserDetails] = useState<Types.UserDetailStructure>();
  const [isLoading, setIsLoading] = useState(false);
  const [reset, setReset] = useState<boolean>(false);
  const uid = useUserid();
  const navigate = useNavigate();

  useEffect(() => {
    const userid = window.location.href.split("/").reverse()[0];
    setIsLoading(true);
    const getUserDetails = async () => {
      try {
        const response = await axios.get(`/user/details/${userid}`);
        setUserDetails(response.data);
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    getUserDetails();
  }, [reset]);

  const isAlreadyFriend = () => {
    if (!userDetails) return false;

    for (let i = 0; i < userDetails.details.friends.length; i++) {
      if (userDetails.details.friends[i]._id === uid) {
        return true;
      }
    }
    return false;
  };

  const isRequestSent = () => {
    if (!userDetails) return false;
    for (
      let i = 0;
      i < userDetails.details.friendRequestsReceived.length;
      i++
    ) {
      if (userDetails.details.friendRequestsReceived[i]._id === uid) {
        return true;
      }
    }
    return false;
  };

  const handleAddFriend = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/friend/request/send", {
        userid: uid,
        friendid: userDetails?.details._id,
      });
      setReset((prev) => !prev);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/friend/remove", {
        userid: uid,
        friendid: userDetails?.details._id,
      });
      setReset((prev) => !prev);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async (fid: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/friend/request/cancel", {
        userid: uid,
        friendid: fid,
        state: "sent",
      });
      setReset((prev) => !prev);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAcceptRequest = async (fid: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/friend/request/accept", {
        userid: uid,
        friendid: fid,
      });
      setReset((prev) => !prev);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="2xl:mx-auto 2xl:w-[1440px]">
      <Header profilePicURL={userDetails?.details.profilePicURL} />
      {!isLoading && userDetails && (
        <>
          <div className="md:px-4 pb-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            <div className="md:col-span-3 md:col-start-1 lg:col-span-2 lg:col-start-2">
              <img
                src={
                  userDetails.details.profileBannerURL === ""
                    ? ProfileBannerPlaceholder
                    : userDetails.details.profileBannerURL
                }
                className="w-full h-36 md:h-48 object-cover bg-gray-500"
              />
              <div className="flex items-end gap-x-2 m-4">
                <img
                  src={
                    userDetails.details.profilePicURL === ""
                      ? ProfilePicPlaceholder
                      : userDetails.details.profilePicURL
                  }
                  className="w-20 aspect-square"
                />
                <div className="w-full flex justify-between items-center">
                  <div>
                    <p className="text-content capitalize font-semibold text-xl">
                      {userDetails.details.fname +
                        " " +
                        userDetails.details.mname +
                        " " +
                        userDetails.details.lname}
                    </p>
                    <p className="text-content text-sm mb-1">
                      {userDetails.details.location.city +
                        " - " +
                        userDetails.details.location.country}
                    </p>
                    <p className="text-content text-xs">
                      {"Date Of Birth: " +
                        new Date(userDetails.details.dob).toLocaleDateString()}
                    </p>
                  </div>
                  {uid !== userDetails.details._id ? (
                    isAlreadyFriend() ? (
                      <button
                        onClick={handleRemoveFriend}
                        className="text-content p-1 rounded-md bg-primary"
                        disabled={isLoading}
                      >
                        Remove Friend
                      </button>
                    ) : isRequestSent() ? (
                      <button
                        onClick={() =>
                          handleCancelRequest(userDetails.details._id)
                        }
                        className="text-content p-1 rounded-md bg-primary"
                        disabled={isLoading}
                      >
                        Cancel Request
                      </button>
                    ) : (
                      <button
                        onClick={handleAddFriend}
                        className="text-content p-1 rounded-md bg-primary"
                        disabled={isLoading}
                      >
                        Make Friend
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => navigate("/profile/edit")}
                      className="text-content p-1 rounded-md bg-primary"
                      disabled={isLoading}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
              <div className="px-4">
                <h3 className="text-content font-semibold border-b-2 border-b-accent">
                  Friends: {userDetails.details.friends.length}
                </h3>
                <div className="max-h-36">
                  {userDetails.details.friends.map((friend) => (
                    <a
                      href={`/profile/${friend._id}`}
                      key={friend._id}
                      className="flex items-center gap-x-2 p-2"
                    >
                      <img
                        src={
                          friend.profilePicURL === ""
                            ? ProfilePicPlaceholder
                            : friend.profilePicURL
                        }
                        className="w-8 h-8 rounded-sm"
                      />
                      <div>
                        <p className="text-content capitalize text-sm">
                          {friend.fname + " " + friend.lname}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              {uid === userDetails.details._id && (
                <div className="px-4 mt-4">
                  <h3 className="text-content font-semibold border-b-2 border-b-accent">
                    Friends Requests Received:&nbsp;
                    {userDetails.details.friendRequestsReceived.length}
                  </h3>
                  {userDetails.details.friendRequestsReceived.length > 0 ? (
                    <div className="max-h-36">
                      {userDetails.details.friendRequestsReceived.map(
                        (friend) => (
                          <div
                            key={friend._id}
                            className="flex items-center justify-between gap-x-2 p-2"
                          >
                            <a
                              href={`/profile/${friend._id}`}
                              className="flex items-center gap-x-2"
                            >
                              <img
                                src={
                                  friend.profilePicURL === ""
                                    ? ProfilePicPlaceholder
                                    : friend.profilePicURL
                                }
                                className="w-8 h-8 rounded-sm"
                              />
                              <p className="text-content capitalize text-sm">
                                {friend.fname + " " + friend.lname}
                              </p>
                            </a>
                            <button
                              onClick={() => handleAcceptRequest(friend._id)}
                              className="text-content p-1 rounded-md bg-primary"
                            >
                              Accept
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-content/50">No requests received</p>
                  )}
                </div>
              )}
              {uid === userDetails.details._id && (
                <div className="px-4 mt-4">
                  <h3 className="text-content font-semibold border-b-2 border-b-accent">
                    Friends Requests Sent:&nbsp;
                    {userDetails.details.friendRequestsSent.length}
                  </h3>
                  {userDetails.details.friendRequestsSent.length > 0 ? (
                    <div className="max-h-36">
                      {userDetails.details.friendRequestsSent.map((friend) => (
                        <div
                          key={friend._id}
                          className="flex items-center justify-between gap-x-2 p-2"
                        >
                          <a
                            href={`/profile/${friend._id}`}
                            className="flex items-center gap-x-2"
                          >
                            <img
                              src={
                                friend.profilePicURL === ""
                                  ? ProfilePicPlaceholder
                                  : friend.profilePicURL
                              }
                              className="w-8 h-8 rounded-sm"
                            />
                            <p className="text-content capitalize text-sm">
                              {friend.fname + " " + friend.lname}
                            </p>
                          </a>
                          <button
                            onClick={() => handleCancelRequest(friend._id)}
                            className="text-content p-1 rounded-md bg-primary z-10"
                          >
                            Cancel
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-content/50">No requests received</p>
                  )}
                </div>
              )}
              <div className="px-4 pt-8">
                <h3 className="text-content font-semibold border-b-2 border-b-accent">
                  Posts: {userDetails.posts.length}
                </h3>
                {userDetails.posts.map((post) => (
                  <div key={post._id} className="bg-accent my-2 rounded-md">
                    <p className="text-content p-2">{post.text}</p>
                    {post.image !== "" && (
                      <img src={post.image} className="w-full" />
                    )}
                    {post.video !== "" && (
                      <video
                        src={post.video}
                        controls
                        autoPlay={false}
                        className="w-full"
                      />
                    )}
                    <div className="flex items-center gap-x-1 p-2">
                      <p className="text-sm font text-content/60">
                        {post.likes.length}
                        {post.likes.length === 1 ? " like" : " likes"}
                      </p>
                      <div className="w-1 h-1 rounded-full bg-content/60"></div>
                      <p
                        className={`text-sm font text-content/60 ${
                          post.comments.length > 0 && "cursor-pointer"
                        }`}
                      >
                        {post.comments.length}
                        {post.comments.length === 1 ? " comment" : " comments"}
                      </p>
                      <p className="text-sm ml-2 text-content/50">
                        {new Date(post.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pt-8">
                <h3 className="text-content font-semibold text-center">
                  Joined Connecto on:&nbsp;
                  {new Date(userDetails.details.doj).toLocaleDateString()}
                </h3>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
