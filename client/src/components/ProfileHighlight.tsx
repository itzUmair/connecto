import { useEffect, useState } from "react";
import axios from "../api/axios";
import useUserid from "../hooks/useUserid";
import * as Types from "../Types";
import BannerPlaceholder from "../assets/placeholder_banner.webp";
import ProfilePlaceholder from "../assets/profile_placeholder.jpg";

const ProfileHighlight = () => {
  const [userHighlight, setUserHighlight] =
    useState<Types.UserHighlightStructure>();
  const uid = useUserid();

  useEffect(() => {
    const getUserHighlights = async () => {
      try {
        const response = await axios.get(`/user/highlight/${uid}`);
        setUserHighlight(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserHighlights();
  }, []);

  return (
    <>
      {userHighlight && (
        <div className="bg-accent rounded-md">
          <div>
            <img
              src={
                userHighlight.details.profileBannerURL === ""
                  ? BannerPlaceholder
                  : userHighlight.details.profileBannerURL
              }
              alt=""
              className="w-64 h-24 object-cover opacity-70 rounded-tr-md rounded-tl-md"
            />
            <img
              src={
                userHighlight.details.profilePicURL === ""
                  ? ProfilePlaceholder
                  : userHighlight.details.profilePicURL
              }
              alt=""
              className="w-20 h-20 object-cover mx-auto -translate-y-8 rounded-full"
            />
          </div>
          <div className="flex flex-col justify-center gap-x-1 capitalize -translate-y-6">
            <a href="/profile" className="text-center text-content font-bold">
              {userHighlight.details.fname}
              &nbsp;
              {userHighlight.details.mname[0]}
              &nbsp;
              {userHighlight.details.lname}
            </a>
            <p className="text-center text-xs text-content/60">
              {userHighlight.details.location.city}
              &nbsp;-&nbsp;
              {userHighlight.details.location.country}
            </p>
          </div>
          <div className="px-2 pb-2 text-content">
            <h3 className="text-content font-semibold">Latest Post</h3>
            <a href="/profile">
              <div className="bg-primary/30 px-1 py-2 my-2 rounded-lg">
                {userHighlight.posts[0].text && (
                  <p>{userHighlight.posts[0].text}</p>
                )}
                {userHighlight.posts[0].image && (
                  <img
                    src={userHighlight.posts[0].image}
                    alt="post image"
                    className="w-24"
                  />
                )}
                {userHighlight.posts[0].video && (
                  <video
                    src={userHighlight.posts[0].video}
                    controls
                    autoPlay={false}
                    className="w-24"
                  />
                )}
              </div>
            </a>
            <div className="flex gap-x-2">
              <p className="text-sm">
                {userHighlight.posts[0].likes.length}
                {userHighlight.posts[0].likes.length === 1 ? " like" : " likes"}
              </p>
              <p className="text-sm">
                {userHighlight.posts[0].comments.length}
                {userHighlight.posts[0].comments.length === 1
                  ? " comment"
                  : " comments"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileHighlight;
