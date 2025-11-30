import {$api, $auth} from "../http";
import type { Post } from "../models/models";
import type { AxiosResponse } from "axios";
import type { LoginResponse, PostsResponse } from "../models/models";

export class AuthService {
    static async login(name: string, password: string): Promise<AxiosResponse<LoginResponse>> {
        return $auth.post<LoginResponse>('/sign-in', {name, password})
    }

    static async registration(name: string, password: string): Promise<AxiosResponse> {
        return $auth.post('/sign-up', {name, password})
    }
}

export class PostService {
    static async posts(offset: number, limit: number): Promise<AxiosResponse<PostsResponse>> {
        const response = await $api.get<PostsResponse>('/posts', {
            params: {
                offset: offset, 
                limit: limit
            }})
        response.data.posts = normalizeTimeStamp(response.data.posts)

        return response
    }
    static async createPost(title: string, content: string): Promise<AxiosResponse> {
        return await $api.post('/posts', {title, content})
    }
}

function normalizeTimeStamp(posts: Post[]) {
  return posts.map(post => ({
    ...post,
    timestamp: new Date(post.timestamp).toLocaleString()
  }))
}