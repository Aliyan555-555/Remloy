import { useState } from "react";
import { MAX_REPLY_DEPTH } from "../../constants";
import Button from "./Button";
import { formatDate } from "../../utils";

const CommentItem = ({
  comment,
  onReplyClick,
  replyingTo,
  setReplyingTo,
  handleReplySubmit,
  depth,
}) => {
  const [replyContent, setReplyContent] = useState("");
  const isAtMaxDepth = depth >= MAX_REPLY_DEPTH;
  const [repliesOpen, setRepliesOpen] = useState(false);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 border border-gray-100${
        depth > 0 ? " ml-8" : ""
      }`}
    >
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <img
            src={
              comment.userId
                ? comment.userId?.profileImage
                : "https://placehold.co/600x400?text=Remlyo"
            }
            alt={comment.userId ? comment.userId?.username : "User"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x400?text=Remlyo";
            }}
          />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between">
            <h4 className="font-medium text-gray-800">
              {comment.userId.username}
            </h4>
            <div className="text-gray-500 text-sm flex items-center">
              <span className="mr-2">{comment.upvoteCount} Upvote</span>
              <span>{formatDate(comment.createdAt)}</span>
            </div>
          </div>
          <p className="text-gray-700 mt-1">{comment.content}</p>
          {!isAtMaxDepth && (
            <button
              className="text-gray-500 text-sm mt-2 hover:text-brand-green"
              onClick={() => {
                if (replyingTo === comment._id) {
                  setReplyingTo(null);
                } else {
                  setReplyingTo(comment._id);
                }
              }}
            >
              Reply
            </button>
          )}
          {replyingTo === comment._id && !isAtMaxDepth && (
            <form
              onSubmit={(e) => {
                handleReplySubmit(
                  e,
                  comment._id,
                  replyContent,
                  setReplyContent
                );
              }}
              className="flex mt-2"
            >
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              <Button
                variant="contained"
                color="brand"
                type="submit"
                className="rounded-l-none"
              >
                Reply
              </Button>
            </form>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <button
              className="text-xs text-brand-green mt-2 flex items-center"
              onClick={() => setRepliesOpen((open) => !open)}
            >
              {repliesOpen
                ? "Hide Replies"
                : `Show Replies (${comment.replies.length})`}
              <svg
                className={`ml-1 w-3 h-3 transition-transform ${
                  repliesOpen ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
          {repliesOpen && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onReplyClick={onReplyClick}
                  replyingTo={replyingTo}
                  setReplyingTo={setReplyingTo}
                  handleReplySubmit={handleReplySubmit}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
