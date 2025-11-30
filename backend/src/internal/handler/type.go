package handler

type UserInput struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

type CreatePostRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}
