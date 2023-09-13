import { useCookies } from "react-cookie";
import * as Types from "../Types";

const useUserid = () => {
  const [cookies] = useCookies(["_auth"]);
  const cookieData = cookies as Types.CookieStructure;
  return cookieData._auth_state;
};

export default useUserid;
