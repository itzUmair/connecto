import ProfilePicPlaceholder from "../assets/profile_placeholder.jpg";

const FeedSuspense = () => {
  return (
    <div>
      <div className="bg-accent mb-4 py-1 rounded-md">
        <div className="flex items-center gap-x-2 p-2 border-b border-content/10">
          <img src={ProfilePicPlaceholder} className="w-8 h-8 rounded-full" />
          <div className="w-full">
            <div className="w-1/3 h-2 bg-white/30 mb-1"></div>
            <div className="w-1/4 h-2 bg-white/30"></div>
          </div>
        </div>
        <div className="text-content p-2"></div>
        <div className="flex flex-col gap-x-1 p-2">
          <div className="w-3/4 h-2 bg-white/30 mb-1"></div>
          <div className="w-2/4 h-2 bg-white/30 mb-1"></div>
          <div className="w-1/4 h-2 bg-white/30 mb-1"></div>
        </div>
        <div className="flex justify-between items-center p-2">
          <div className="w-1/4 h-2 bg-white/30 mb-1"></div>
        </div>
      </div>
    </div>
  );
};

export default FeedSuspense;
