import { useState, useEffect } from "react";
import Header from "./Header";
import { useCookies } from "react-cookie";
import * as Types from "../Types";
import axios from "../api/axios";

const Feed = () => {
  const [feed, setFeed] = useState<Types.PostStructure[]>();
  const [profilepic, setProfilepic] = useState<string>();
  const [cookies] = useCookies(["_auth"]);

  useEffect(() => {
    const cookieData = cookies as Types.CookieStructure;
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
      } catch (error) {
        console.log(error);
      }
    };
    // set header profile pic
    getUser();
  }, []);

  return (
    <div>
      <Header profilePicURL={profilepic} />
    </div>
  );
};

export default Feed;
