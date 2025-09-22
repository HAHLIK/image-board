package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/HAHLIK/image-board/internal/models"
	"github.com/HAHLIK/image-board/internal/storage"
	"github.com/HAHLIK/image-board/pkg/errwrapper"
	"github.com/jackc/pgx/v5"
)

type Storage struct {
	db *pgx.Conn
}

func New() *Storage {
	return &Storage{}
}

func (s *Storage) MustConnect(ctx context.Context, url string, user string, password string) {
	if err := s.connect(ctx, url, user, password); err != nil {
		panic(err)
	}
}

func (s *Storage) Stop(ctx context.Context) {
	const op = "postgres.Stop"

	if err := s.db.Close(ctx); err != nil {
		panic(errwrapper.Wrap(op, err))
	}
}

func (s *Storage) GetPostsBatch(ctx context.Context, offset int64, limit int64) (models.Posts, error) {
	const op = "postgres.GetPostsBatch"

	batch := models.Posts{Posts: make([]*models.Post, 0)}

	rows, err := s.db.Query(ctx, QueryGetPosts, offset, limit)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return models.Posts{}, errwrapper.Wrap(op, storage.ErrPostsNotFound)
		}
		return models.Posts{}, errwrapper.Wrap(op, err)
	}

	for rows.Next() {
		var post models.Post
		if err := rows.Scan(&post.Id, &post.Title, &post.Content); err != nil {
			return models.Posts{}, errwrapper.Wrap(op, err)
		}
		batch.Posts = append(batch.Posts, &post)
	}
	return batch, nil
}

func (s *Storage) Init(ctx context.Context) error {
	const op = "postgres.Init"

	if _, err := s.db.Exec(ctx, QueryInit); err != nil {
		return errwrapper.Wrap(op, storage.ErrCantExecInit)
	}
	return nil
}

func (s *Storage) connect(ctx context.Context, url string, user string, password string) error {
	const op = "postgres.Connect"

	connString := fmt.Sprintf("postgres://%s:%s@%s/postgres?sslmode=disable", user, password, url)

	db, err := pgx.Connect(ctx, connString)
	if err != nil {
		return errwrapper.Wrap(op, err)
	}

	s.db = db
	return nil
}
