export interface Profile {
    name: string,
    avatar: {
        original: string,
        thumbnail: string
    }
}

export interface Post {
    id: number,
    timestamp: string,
    title: string,
    content: string,
    author: Profile,
    rating: number,
    user_vote: number,
    comments_count: number
}

export interface Comment {
    id: number,
    timestamp: string,
    content: string,
    author: Profile,
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