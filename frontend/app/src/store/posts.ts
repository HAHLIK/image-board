import { create } from "zustand";
import type { Post, Comment } from "../models/models";
import { PostService } from "../services";

interface PostState {
  offset: number;
  limit: number;
  commentsLimit: number;
  posts: Post[];
  comments: Record<number, {
    offset: number;
    batch: Comment[];
    isLoading: boolean;
    hasMore: boolean;
  }>;
  isLoading: boolean;
  hasMore: boolean;
  getPostsRequest: () => Promise<void>;
  createPostRequest: (title: string, content: string) => Promise<void>;
  getCommentsRequest: (postId: number) => Promise<void>;
  createCommentRequest: (postId: number, content: string) => Promise<void>;
  voteRequest: (postId: number, value: number) => Promise<void>;
  deleteVoteRequest: (postId: number) => Promise<void>;
}

export const usePostsStore = create<PostState>((set, get) => ({
  offset: 0,
  limit: 2,
  
  commentsLimit: 4,
  isLoading: false,
  hasMore: true,
  posts: [],
  comments: {},
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

  getCommentsRequest: async (postId: number) => {
    try {
      const comments = { ...get().comments };

      if (!comments[postId]) {
        comments[postId] = {
          offset: 0,
          batch: [],
          isLoading: false,
          hasMore: true,
        };
      }

    const postComments = comments[postId];
    if (postComments.isLoading || !postComments.hasMore) return;

    postComments.isLoading = true;
    set({ comments });

    const limit = get().commentsLimit;
    const response = await PostService.comments(
      postComments.offset,
      limit,
      postId
    );

    const batch: Comment[] = response?.data?.batch ?? [];

    postComments.batch.push(...batch);
    postComments.offset += batch.length;
    postComments.hasMore = batch.length === limit;
    postComments.isLoading = false;

    set({ comments: { ...comments } });
  } catch (err) {
    console.error("getCommentsRequest error:", err);
  }
},


  createCommentRequest: async (postId: number, content: string) => {
  try {
    await PostService.createComment(content, postId);

    const comments = { ...get().comments };
    delete comments[postId];
    set({ comments });

    await get().getCommentsRequest(postId);
  } catch (e) {
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