import {$api, $auth} from "../http";
import type { AxiosResponse } from "axios";
import type { LoginResponse, PostsResponse, CommentsResponse, TokenValidResponce} from "../models/models";

export class AuthService {
    static async login(name: string, password: string): Promise<AxiosResponse<LoginResponse>> {
        return $auth.post<LoginResponse>('/sign-in', {name, password})
    }

    static async registration(name: string, password: string): Promise<AxiosResponse> {
        return $auth.post('/sign-up', {name, password})
    }
    
    static async tokenIsValid(): Promise<AxiosResponse<TokenValidResponce>> {
        const token = localStorage.getItem('token');

        return $auth.get('/token-valid', {
            headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    }
}

export class PostService {
    static async posts(offset: number, limit: number): Promise<AxiosResponse<PostsResponse>> {
        const response = await $api.get<PostsResponse>('/posts', {
            params: {
                offset: offset, 
                limit: limit
            }})
        response.data.batch = response.data.batch.map(el => ({
            ...el,
            timestamp: new Date(el.timestamp).toLocaleString()
        }))
        return response
    }

    static async createPost(title: string, content: string): Promise<AxiosResponse> {
        return await $api.post('/posts', {title, content})
    }

    static async comments(offset: number, limit: number, postId: number): Promise<AxiosResponse<CommentsResponse>> {
        const response = await $api.get<CommentsResponse>(`/posts/${postId}/comments`, {
            params: {
                offset: offset,
                limit: limit
            }
        })
        response.data.batch = response.data.batch.map(el => ({
            ...el,
            timestamp: new Date(el.timestamp).toLocaleString()
        }))
        return response
    }

    static async createComment(content: string, postId: number): Promise<AxiosResponse> {
        return await $api.post(`/posts/${postId}/comments`, {content})
    }

    static async vote(postId: number, value: number): Promise<AxiosResponse> {
        return await $api.put(`/posts/${postId}/vote`, {value})
    }

    static async deleteVote(postId: number): Promise<AxiosResponse> {
        return await $api.delete(`/posts/${postId}/vote`)
    }
}