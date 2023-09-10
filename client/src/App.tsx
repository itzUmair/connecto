import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Feed from "./components/Feed";

function App() {
  return (
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
        path="/profile"
        element={
          <RequireAuth loginPath="/signin">
            <Feed />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
