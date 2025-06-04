import React from 'react';

const CommentItem = ({ comment }) => {
  return (
    <div className="border p-3 rounded-md bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{comment.content}</span>
        <span className={`text-xs px-2 py-1 rounded ${
          comment.status === 'approved'
            ? 'bg-green-100 text-green-700'
            : comment.status === 'pending'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {comment.status}
        </span>
      </div>
    </div>
  );
};

export default CommentItem;
