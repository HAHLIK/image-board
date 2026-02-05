package handler

import "time"

type UserInput struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

type User struct {
	Name       string `json:"name"`
	AvatarPath Avatar `json:"avatar"`
}

type Avatar struct {
	Original  string `json:"original"`
	Thumbnail string `json:"thumbnail"`
}

type CreatePostRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type Post struct {
	Id            int64     `json:"id"`
	Title         string    `json:"title"`
	Content       string    `json:"content"`
	Author        User      `json:"author"`
	Rating        int       `json:"rating"`
	TimeStamp     time.Time `json:"timestamp"`
	UserVote      int8      `json:"user_vote"`
	CommentsCount int       `json:"comments_count"`
}

type PostsBatchResponce struct {
	Batch []*Post `json:"batch"`
}

type CreateCommentRequest struct {
	Content string `json:"content"`
}

type Comment struct {
	Id        int64     `json:"id"`
	Author    User      `json:"author"`
	Content   string    `json:"content"`
	TimeStamp time.Time `json:"timestamp"`
}

type CommentsBatchResponce struct {
	Batch []*Comment `json:"batch"`
}

type VoteRequest struct {
	Value int8 `json:"value"`
}
