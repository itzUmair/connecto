import { useState } from "react";
import Logo from "../assets/logo.svg";
import PlaceholderPic from "../assets/profile_placeholder.jpg";
import { animated, useTransition } from "react-spring";
import { useTheme } from "../context/themeContext";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

const Header = ({ profilePicURL }: { profilePicURL: string | undefined }) => {
  const [dropDownActive, setDropDownActive] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const signout = useSignOut();
  const navigate = useNavigate();

  const slideIn = useTransition(dropDownActive, {
    from: { y: -20, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: -20, opacity: 0 },
  });

  return (
    <div className="flex justify-between items-center text-content bg-primary py-2 px-4 md:px-16 relative">
      <img src={Logo} alt="Connecto" className=" w-24 md:w-28" />
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
                    onClick={() => navigate("/profile")}
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
    </div>
  );
};

export default Header;
