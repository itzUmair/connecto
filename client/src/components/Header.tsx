import { useState, useRef, useEffect } from "react";
import Logo from "../assets/logo.svg";
import PlaceholderPic from "../assets/profile_placeholder.jpg";
import { animated, useTransition } from "react-spring";
import { useTheme } from "../context/themeContext";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import useUserid from "../hooks/useUserid";
import * as Types from "../Types";
import toast from "react-hot-toast";
import axios from "../api/axios";
import { AxiosError } from "axios";

const Header = ({ profilePicURL }: { profilePicURL: string | undefined }) => {
  const [dropDownActive, setDropDownActive] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [allUsers, setAllUsers] = useState<Types.SearchedUser[]>();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const signout = useSignOut();
  const navigate = useNavigate();
  const uid = useUserid();
  const searchRef = useRef<HTMLInputElement>(null);

  const slideIn = useTransition(dropDownActive, {
    from: { y: -20, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: -20, opacity: 0 },
  });

  const getAllUsers = async (): Promise<void> => {
    try {
      if (!searchRef.current) return;
      const response = await axios.get(
        `/user/search/${searchRef.current.value}`
      );
      setAllUsers(response.data.users);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.status === 404) return;
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (!isSearching) return;
    const callInterval = setInterval(getAllUsers, 2000);
    return () => {
      clearInterval(callInterval);
    };
  }, [isSearching]);

  return (
    <div className="flex justify-between items-center text-content bg-primary py-2 px-4 md:px-16 relative">
      <img
        src={Logo}
        alt="Connecto"
        className=" w-24 md:w-28 cursor-pointer"
        onClick={() => navigate("/feed")}
      />
      <input
        type="search"
        value={username}
        ref={searchRef}
        placeholder="Search"
        onFocus={() => setIsSearching(true)}
        onBlur={() => {
          setTimeout(() => setIsSearching(false), 500);
        }}
        onChange={(e) => setUsername(e.target.value)}
        className="bg-secondary/50 w-1/2 p-1 text-content text-sm focus:outline-none"
      />
      <button onClick={() => setDropDownActive((prevState) => !prevState)}>
        <img
          src={profilePicURL || PlaceholderPic}
          className="w-8 h-8 object-fill cursor-pointer"
        />
      </button>
      {slideIn(
        (style, item) =>
          item && (
            <animated.div
              style={style}
              className="bg-primary p-2 rounded absolute top-16 right-4 md:right-16"
            >
              <ul className="flex flex-col gap-y-2">
                <li>
                  <button
                    onClick={() => navigate(`/profile/${uid}`)}
                    className="bg-white/20 rounded-md p-1 select-none w-full text-left"
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      signout();
                      navigate("/signin");
                    }}
                    className="bg-white/20 rounded-md p-1 select-none w-full text-left"
                  >
                    Logout
                  </button>
                </li>
                <li className="flex items-center gap-2 p-1 mt-4 relative before:content-[''] before:absolute before:-top-2 before:left-0 before:w-full before:h-[0.1rem] before:bg-white before:rounded-lg">
                  Dark Mode
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value={theme}
                      onClick={() => toggleTheme()}
                      defaultChecked={theme === "dark" ? true : false}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-content after:border-secondary after:border after:rounded-full after:h-4 after:w-4 after:transition-all "></div>
                  </label>
                </li>
              </ul>
            </animated.div>
          )
      )}
      {isSearching && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 pt-4 px-4 z-50 bg-accent rounded-md w-11/12 md:w-1/2 lg:w-1/3">
          {!allUsers && (
            <div className="flex items-center justify-center gap-x-2 mb-4 w-full text-left bg-secondary/70 rounded-sm hover:bg-secondary/40">
              <p className="text-content text-center py-2">
                No user with this name found
              </p>
            </div>
          )}
          {allUsers &&
            allUsers.map((user) => (
              <a
                key={user._id}
                href={`/profile/${user._id}`}
                className="flex items-center gap-x-2 mb-4 w-full text-left bg-secondary/70 rounded-sm hover:bg-secondary/40"
              >
                <img
                  src={
                    user.profilePicURL
                      ? user.profilePicURL !== ""
                        ? user.profilePicURL
                        : PlaceholderPic
                      : PlaceholderPic
                  }
                  className="w-12 aspect-square object-cover"
                />
                <div>
                  <p className="capitalize">{user.name}</p>
                  <p className="text-content/50 text-xs">
                    {user.location.city + " - " + user.location.country}
                  </p>
                </div>
              </a>
            ))}
        </div>
      )}
    </div>
  );
};

export default Header;
