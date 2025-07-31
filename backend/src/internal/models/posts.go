package models

type Posts struct {
	Posts []*Post `json:"posts"`
}

type Post struct {
	Title string `json:"title"`
	Text  string `json:"text"`
}
