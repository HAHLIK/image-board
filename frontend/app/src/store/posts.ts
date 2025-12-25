import { create } from "zustand";
import type { Post } from "../models/models";
import { PostService } from "../services";

interface PostState {
  offset: number;
  limit: number;
  commentsLimit: number;
  commentOffsetByPostId: Record<number, number>
  posts: Post[];
  isLoading: boolean;
  hasMore: boolean;
  setPosts: (posts: Post[]) => void;
  getPostsRequest: () => Promise<void>;
  createPostRequest: (title: string, content: string) => Promise<void>;
  getCommentsRequest: () => Promise<void>;
  createCommentRequest: (postId: number, content: string) => Promise<void>;
  voteRequest: (postId: number, value: number) => Promise<void>;
  deleteVoteRequest: (postId: number) => Promise<void>;
}

export const usePostsStore = create<PostState>((set, get) => ({
  offset: 0,
  limit: 2,
  
  commentsLimit: 10,
  commentOffsetByPostId: {},
  isLoading: false,
  hasMore: true,
  posts: [],
  setPosts: (posts: Post[]) => set({ posts }),

  getPostsRequest: async () => {
    if (get().isLoading || !get().hasMore) return;

    set({ isLoading: true });
    try {
      const offset = get().offset;
      const limit = get().limit;
      const response = await PostService.posts(offset, limit);

      const batch: Post[] = response?.data?.batch ?? [];

      if (batch.length > 0) {
        const existing = get().posts;
        const merged = [...existing, ...batch].reduce<Post[]>((acc, p) => {
          if (!acc.find(x => x.id === p.id)) acc.push(p);
          return acc;
        }, []);

        set({
          posts: merged,
          offset: offset + batch.length,
          hasMore: batch.length >= limit,
        });
      } else {
        set({ hasMore: false });
      }
    } catch (err) {
      console.error("getPostsRequest error:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  createPostRequest: async (title: string, content: string) => {
    try {
      await PostService.createPost(title, content);
    } catch (e: any) {
      console.error(e);
    }
  },

  getCommentsRequest: async () => {
    
  },
  createCommentRequest: async (postId: number, content: string) => {
      try {
        await PostService.createComment(content, postId);
      } catch (e: any) {
        console.error(e);
      }
  },

  voteRequest: async (postId: number, value: number) => {
    try {
      await PostService.vote(postId, value);
    } catch (e: any) {
      console.error(e);
    }
  },
  deleteVoteRequest: async (postId: number) => {
    try {
      await PostService.deleteVote(postId);
    } catch (e: any) {
      console.error(e);
    }
  }
}));