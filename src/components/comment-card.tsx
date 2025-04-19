"use client";

import React from "react";
import { Comment } from "@/types/comment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CommentCardProps {
  comment: Comment;
  currentUserId: string;
  onDelete: (commentId: string) => void;
}

export default function CommentCard({ comment, currentUserId, onDelete }: CommentCardProps) {
  if (!comment) return null;

  // Fallback for missing author details
  const author = comment.author || { id: "", name: "Anonymous" };

  // Check if the current user is the author of the comment
  const isAuthor = author.id === currentUserId;

  return (
    <Card className="mb-2">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-black font-semibold text-lg">{author.name}</CardTitle>
        <span className="text-xs text-gray-600">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-gray-900 text-[15px] leading-snug">{comment.content}</p>
      </CardContent>
      {isAuthor && (
        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(comment.id)}
          >
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
