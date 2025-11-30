export interface Post {
    id: number,
    timestamp: string,
    title: string,
    content: string,
    author_name: string
}

export interface LoginResponse {
    token: string,
}

export interface PostsResponse {
    posts: Post[]
}