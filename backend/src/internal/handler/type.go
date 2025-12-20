package handler

import "time"

type UserInput struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

type CreatePostRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type Post struct {
	Id         int64     `json:"id"`
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	AuthorName string    `json:"author_name"`
	Rating     int       `json:"rating"`
	TimeStamp  time.Time `json:"timestamp"`
}

type PostsBatchResponce struct {
	Batch []*Post `json:"batch"`
}

type CreateCommentRequest struct {
	Content string `json:"content"`
}

type Comment struct {
	Id         int64     `json:"id"`
	AuthorName string    `json:"author_name"`
	Content    string    `json:"content"`
	TimeStamp  time.Time `json:"timestamp"`
}

type CommentsBatchResponce struct {
	Batch []*Comment `json:"batch"`
}

type VoteRequest struct {
	Value int8 `json:"value"`
}
