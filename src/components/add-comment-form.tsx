"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddCommentFormProps {
  visualizationId: string;
  currentUserId: string;
  onSubmit: (content: string) => Promise<void>;
}

export default function AddCommentForm({
  visualizationId,
  currentUserId,
  onSubmit,
}: AddCommentFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSubmit(content);
      setContent("");
    } catch (err) {
      setError("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <Textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (error) setError("");
        }}
        className="resize-none"
        rows={3}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
}