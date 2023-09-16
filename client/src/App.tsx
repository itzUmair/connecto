import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import { useTheme } from "./context/themeContext";
import { Toaster } from "react-hot-toast";
import ProfileEdit from "./components/ProfileEdit";
import PopularPost from "./components/PopularPost";

function App() {
  const { theme } = useTheme();
  useEffect(() => {
    document.getElementsByTagName("html")[0].setAttribute("data-theme", theme);
  });

  return (
    <>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/feed"
          element={
            <RequireAuth loginPath="/signin">
              <Feed />
            </RequireAuth>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <RequireAuth loginPath="/signin">
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <RequireAuth loginPath="/signin">
              <ProfileEdit />
            </RequireAuth>
          }
        />
        <Route
          path="/post/category/:category"
          element={
            <RequireAuth loginPath="/signin">
              <PopularPost />
            </RequireAuth>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
