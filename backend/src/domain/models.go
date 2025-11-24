package models

import "time"

type Posts struct {
	Posts []*Post `json:"posts"`
}

type Post struct {
	Id        int64     `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	TimeStamp time.Time `json:"timestamp"`
}

type User struct {
	Id       []byte
	Name     string
	PassHash []byte
}
