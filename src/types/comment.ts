// src/types/comment.ts

export interface Comment {
    id: string;
    content: string;
    authorId: string;
    vizId: string;
    createdAt: string;
    // Optionally, if you fetch the author details, you can include:
    author?: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    };
  }
  