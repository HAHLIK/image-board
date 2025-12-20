package models

import "time"

type Post struct {
	Id        int64
	Title     string
	Content   string
	AuthorId  []byte
	Rating    int
	TimeStamp time.Time
}

type Posts struct {
	Posts []*Post
}

type User struct {
	Id       []byte
	Name     string
	PassHash []byte
}

type Comment struct {
	Id        int64
	PostId    int64
	AuthorId  []byte
	Content   string
	TimeStamp time.Time
}

type Comments struct {
	Comments []*Comment
}

type Vote struct {
	PostId   int64
	AuthorId []byte
	Value    int8
}
