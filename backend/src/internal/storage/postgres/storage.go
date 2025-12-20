package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/HAHLIK/image-board/utils"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrCantExecInit = errors.New("can't exec init")
)

type PostgresStorage struct {
	db *pgxpool.Pool
}

func (p *PostgresStorage) MustConnect(ctx context.Context, url string, user string, password string) {
	if err := p.connect(ctx, url, user, password); err != nil {
		panic(err)
	}
}

func (p *PostgresStorage) Stop(ctx context.Context) {
	p.db.Close()
}

func (p *PostgresStorage) Init(ctx context.Context) error {
	const op = "postgres.Init"

	if _, err := p.db.Exec(ctx, QueryInit); err != nil {
		return utils.ErrWrap(op, ErrCantExecInit)
	}
	return nil
}

func (p *PostgresStorage) connect(ctx context.Context, url string, user string, password string) error {
	const op = "postgres.Connect"

	connString := fmt.Sprintf("postgres://%s:%s@%s/postgres?sslmode=disable", user, password, url)

	pool, err := pgxpool.New(ctx, connString)
	if err != nil {
		return utils.ErrWrap(op, err)
	}

	p.db = pool
	return nil
}

const (
	QueryInit = `
		CREATE TABLE IF NOT EXISTS users (
  			id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  			name      VARCHAR(35) NOT NULL,
  			pass_hash BYTEA NOT NULL
		);
		CREATE TABLE IF NOT EXISTS posts (
  			id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 			author_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  			title      TEXT NOT NULL,
  			content    TEXT NOT NULL,
  			time_stamp TIMESTAMP
		);
		CREATE TABLE IF NOT EXISTS comments (
  			id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  			post_id    BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  			author_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  			content    TEXT NOT NULL,
			time_stamp TIMESTAMP
		);
		CREATE TABLE IF NOT EXISTS votes (
    		post_id   BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    		author_id   UUID   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    		value     SMALLINT NOT NULL CHECK (value IN (-1, 1)),
    		PRIMARY KEY (post_id, author_id)
		);
	`
)
