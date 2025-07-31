package postgres

import (
	"context"
	"fmt"

	"github.com/HAHLIK/image-board/internal/models"
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

func (s *Storage) GetPosts() (models.Posts, error) {
	return models.Posts{}, nil
}

func (s *Storage) connect(ctx context.Context, url string, user string, password string) error {
	const op = "postgres.Connect"

	connString := fmt.Sprintf("postgres://%s:%s@%s/postgres", user, password, url)

	db, err := pgx.Connect(ctx, connString)
	if err != nil {
		return errwrapper.Wrap(op, err)
	}

	s.db = db
	return nil
}
