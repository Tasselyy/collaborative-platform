"use client";

import React, { useState, useEffect } from "react";
import CommentCard from "./comment-card";
import AddCommentForm from "./add-comment-form";
import { Comment } from "@/types/comment";
import { authClient } from "@/lib/auth-client";

interface CommentSectionProps {
  visualizationId: string;
  currentUserId: string;
}

export default function CommentSection({ visualizationId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/comments?vizId=${visualizationId}`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data: Comment[] = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [visualizationId]);

  const addComment = async (content: string) => {
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vizId: visualizationId, content, currentUserId }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      const newComment: Comment = await res.json();
      setComments((prev) => [newComment, ...prev]);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete comment");
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <section className="mt-6 border rounded-lg p-4 bg-gray-50 shadow">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      <AddCommentForm visualizationId={visualizationId} currentUserId={currentUserId} onSubmit={addComment} />
      <div className="mt-4">
        {loading ? (
          <p className="text-gray-600">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onDelete={deleteComment}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
