export interface Post {
    id: number,
    timestamp: string,
    title: string,
    content: string,
    author_name: string,
    rating: number,
    user_vote: number
}

export interface Comment {
    id: number,
    timestamp: string,
    content: string,
    author_name: string
}

export interface LoginResponse {
    token: string,
}

export interface TokenValidResponce {
    valid: boolean,
}

export interface PostsResponse {
    batch: Post[]
}

export interface CommentsResponse {
    batch: Comment[]
}