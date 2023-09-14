import * as Types from "../Types";
import ProfilePicPlaceholder from "../assets/profile_placeholder.jpg";

const Comments = ({ comments }: { comments: Types.CommentStructure[] }) => {
  return (
    <div className=" w-full pl-6 mb-8 bg-secondary max-h-96 overflow-y-scroll">
      <h3 className="text-content font-semibold">Comments</h3>
      {comments.map((comment, index) => (
        <div key={index} className="bg-accent mb-4 py-1 rounded-md w-3/4 mt-1">
          <div className="flex items-center gap-x-2 p-2 border-b border-content/10">
            <img
              src={
                comment.userid.profilePicURL === ""
                  ? ProfilePicPlaceholder
                  : comment.userid.profilePicURL
              }
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-content capitalize text-sm">
                {comment.userid.fname + " " + comment.userid.lname}
              </p>
              <p className="text-xs text-content/50">
                {new Date(comment.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-content p-2">
            <p>{comment.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
