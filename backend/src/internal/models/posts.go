package models

type Posts struct {
	Posts []*Post `json:"posts"`
}

type Post struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}
