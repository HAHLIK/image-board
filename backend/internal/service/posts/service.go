package postsService

import "github.com/HAHLIK/image-board/internal/models"

type Service struct {
}

func New() *Service {
	return &Service{}
}

func (s *Service) GetPosts() (models.Posts, error) {

	return models.Posts{
		Posts: []*models.Post{
			{
				Title: "My first post",
				Text:  "Text by my first post",
			},
		},
	}, nil
}
