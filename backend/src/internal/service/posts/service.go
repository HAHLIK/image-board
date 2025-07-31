package postsService

import (
	"errors"
	"log/slog"

	"github.com/HAHLIK/image-board/internal/models"
	"github.com/HAHLIK/image-board/internal/storage"
	"github.com/HAHLIK/image-board/pkg/errwrapper"
)

type Service struct {
	cacheStorage Storage
	mainStorage  Storage
	log          *slog.Logger
}

type Storage interface {
	GetPosts() (models.Posts, error)
}

func New(
	cacheStorage Storage,
	mainStorage Storage,
	log *slog.Logger,
) *Service {
	return &Service{
		cacheStorage: cacheStorage,
		mainStorage:  mainStorage,
		log:          log,
	}
}

func (s *Service) GetPosts() (models.Posts, error) {
	const op = "postsService.GetPosts"

	log := s.log.With("op", op)

	log.Info("Attepmting get posts from cache")

	posts, err := s.cacheStorage.GetPosts()
	if err == nil {
		return posts, nil
	}

	if !errors.Is(err, storage.ErrPostsNotFound) {
		log.Error("Failed to get posts from cache")
		return models.Posts{}, errwrapper.Wrap(op, err)
	}
	log.Info("Posts not found in cache, trying main storage")

	posts, err = s.mainStorage.GetPosts()
	if err != nil {
		if errors.Is(err, storage.ErrPostsNotFound) {
			log.Info("Posts not found")
			return models.Posts{}, storage.ErrPostsNotFound
		}

		log.Error("Failed to get posts")
		return models.Posts{}, errwrapper.Wrap(op, err)
	}

	return posts, nil
}
