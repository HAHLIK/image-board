package postsService

import (
	"context"
	"errors"
	"log/slog"

	"github.com/HAHLIK/image-board/internal/models"
	"github.com/HAHLIK/image-board/internal/storage"
	"github.com/HAHLIK/image-board/pkg/errwrapper"
	"github.com/HAHLIK/image-board/pkg/logger"
)

type Service struct {
	cacheProvider Provider
	provider      Provider
	log           *slog.Logger
}

type Provider interface {
	GetPostsBatch(ctx context.Context, offset int64, limit int64) (models.Posts, error)
	SavePost(ctx context.Context, post *models.Post) (int64, error)
}

func New(
	cacheProvider Provider,
	provider Provider,
	log *slog.Logger,
) *Service {
	return &Service{
		cacheProvider: cacheProvider,
		provider:      provider,
		log:           log,
	}
}

func (s *Service) GetPostsBatch(ctx context.Context, offset int64, limit int64) (models.Posts, error) {
	const op = "postsService.GetPosts"

	log := s.log.With("op", op)

	log.Info("Attepmting get posts from cache")

	posts, err := s.cacheProvider.GetPostsBatch(ctx, offset, limit)
	if err == nil {
		return posts, nil
	}

	if !errors.Is(err, storage.ErrPostsNotFound) {
		log.Error("Failed to get posts from cache", logger.Err(err))
		return models.Posts{}, errwrapper.Wrap(op, err)
	}
	log.Info("Posts not found in cache, trying main provider")

	posts, err = s.provider.GetPostsBatch(ctx, offset, limit)
	if err != nil {
		if errors.Is(err, storage.ErrPostsNotFound) {
			log.Info("Posts not found")
			return models.Posts{}, storage.ErrPostsNotFound
		}

		log.Error("Failed to get posts")
		return models.Posts{}, errwrapper.Wrap(op, err)
	}

	log.Info("Succesfuly getting posts batch")
	return posts, nil
}

func (s *Service) SavePost(ctx context.Context, post *models.Post) (int64, error) {
	const op = "postsService.SavePost"

	log := s.log.With("op", op)

	log.Info("Attepmting save post")

	id, err := s.provider.SavePost(ctx, post)
	if err != nil {
		log.Error("Failed save post", logger.Err(err))
		return 0, errwrapper.Wrap(op, err)
	}

	log.Info("Succesfuly save post")
	return id, nil
}
