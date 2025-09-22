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

	return posts, nil
}
