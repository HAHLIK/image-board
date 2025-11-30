import { create } from "zustand"
import type { Post } from "../models/models";
import { PostService } from "../services";

interface PostState {
    offset: number,
    limit: number,
    posts: Post[],
    setPosts: (posts: Post[]) => void;
    getPostsRequest: () => Promise<void>;
    createPostRequest: (title: string, content: string) => Promise<void>;
}

export const usePostsStore = create<PostState>((set, get) => ({
    offset: 0,
    limit: 100,
    posts: [{
        id: 1,
        timestamp: "2025-11-02T06:49:28.441086Z",
        title: "How make border in CSS?",
        content: `# I want make border`,
        author_name: "TeBMG"
    }],
    setPosts: (posts: Post[]) => set({ posts }),

    getPostsRequest: async () => {
        try {
            const response = await PostService.posts(get().offset, get().limit)
            set({posts: response.data.posts})
        } 
        catch (e: any) {
            console.error(e)
        }
    },

    createPostRequest: async (title: string, content: string) => {
        try {
            await PostService.createPost(title, content)
        } 
        catch (e: any) {
            console.error(e)
        }
    }
}))