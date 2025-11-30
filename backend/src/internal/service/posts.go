package service

import (
	"context"
	"log/slog"

	models "github.com/HAHLIK/image-board/domain"
	"github.com/HAHLIK/image-board/utils"
)

type PostsService struct {
	CacheProvider Provider
	Provider      Provider
	Log           *slog.Logger
}

type Provider interface {
	GetPostsBatch(ctx context.Context, offset int64, limit int64) (posts models.Posts, err error)
	SavePost(ctx context.Context, post *models.Post) (id int64, err error)
}

func (p *PostsService) GetPostsBatch(ctx context.Context, offset int64, limit int64) (models.Posts, error) {
	const op = "postsService.GetPosts"

	log := p.Log.With("op", op)

	posts, err := p.CacheProvider.GetPostsBatch(ctx, offset, limit)

	if err != nil {
		log.Error("Failed to get posts from cache", utils.SlogErr(err))
		return models.Posts{}, utils.ErrWrap(op, err)
	}
	if posts.Posts != nil {
		return posts, nil
	}

	posts, err = p.Provider.GetPostsBatch(ctx, offset, limit)
	if err != nil {
		log.Error("Failed to get posts")
		return models.Posts{}, utils.ErrWrap(op, err)
	}
	if posts.Posts == nil {
		return models.Posts{}, utils.ErrWrap(op, ErrPostsNotFound)
	}
	return posts, nil
}

func (p *PostsService) SavePost(ctx context.Context, post *models.Post) (int64, error) {
	const op = "postsService.SavePost"

	log := p.Log.With("op", op)

	id, err := p.Provider.SavePost(ctx, post)
	if err != nil {
		log.Error("Failed save post", utils.SlogErr(err))
		return 0, utils.ErrWrap(op, err)
	}
	return id, nil
}
