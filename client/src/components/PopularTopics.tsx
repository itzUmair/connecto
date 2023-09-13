import { useEffect, useState } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";

const PopularTopics = () => {
  const [topics, setTopics] = useState<[string, number][]>();

  useEffect(() => {
    const getPopularTopics = async () => {
      try {
        const response = await axios.get("/post/popular");
        setTopics(response.data.reverse());
      } catch (error) {
        toast.error("Something went wrong");
      }
    };
    getPopularTopics();
  }, []);

  return (
    <div className="bg-accent w-48 p-2 rounded-md">
      <h3 className="text-content font-bold text-lg border-b border-content/20 pb-2 mb-2">
        Trending
      </h3>
      {topics &&
        topics.map((topic) => (
          <div
            key={topic[0]}
            className="mb-3 flex items-center justify-between"
          >
            <div>
              <p className="text-content">{topic[0]}</p>
              <p className="text-xs text-content/60 ">
                {topic[1]} {topic[1] === 1 ? "post" : "posts"}
              </p>
            </div>
            <a
              href={`/post/trending/${topic[0]}`}
              className="text-content text-sm bg-white/10 px-2 py-1 rounded-full"
            >
              View
            </a>
          </div>
        ))}
    </div>
  );
};

export default PopularTopics;
