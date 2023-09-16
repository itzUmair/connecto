import axios from "axios";

export default axios.create({
  baseURL: "https://connecto-api.vercel.app/api/v1",
  withCredentials: true,
});
