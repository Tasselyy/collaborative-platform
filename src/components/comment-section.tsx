"use client";

import React, { useState, useEffect } from "react";
import CommentCard from "./comment-card";
import AddCommentForm from "./add-comment-form";
import { Comment } from "@/types/comment";
import { authClient } from "@/lib/auth-client"

interface CommentSectionProps {
  visualizationId: string;
  currentUserId: string; // Logged-in user ID
}

export default function CommentSection({ visualizationId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();

  const fetchComments = async () => {
    setLoading(true);
    try {
      
      const res = await fetch(`/api/comments?vizId=${visualizationId}`);
      if (res.ok) {
        const data: Comment[] = await res.json();
        setComments(data);
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [visualizationId]);

  const handleAddComment = async (content: string) => {
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vizId: visualizationId,
          content,
          currentUserId,
        }),
      });

      if (res.ok) {
        const newComment: Comment = await res.json();
        setComments((prev) => [newComment, ...prev]);
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
	  console.log(commentId)

      if (res.ok) {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      <AddCommentForm visualizationId={visualizationId} currentUserId={currentUserId} onSubmit={handleAddComment} /> {/* Adjust submission logic */}
      <div className="mt-4">
        {loading ? (
          <p className="text-gray-600">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onDelete={handleDeleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
}