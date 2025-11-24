package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/HAHLIK/image-board/utils"
	"github.com/jackc/pgx/v5"
)

var (
	ErrCantExecInit = errors.New("can't exec init")
)

type PostgresStorage struct {
	db *pgx.Conn
}

func (p *PostgresStorage) MustConnect(ctx context.Context, url string, user string, password string) {
	if err := p.connect(ctx, url, user, password); err != nil {
		panic(err)
	}
}

func (p *PostgresStorage) Stop(ctx context.Context) {
	const op = "postgres.Stop"

	if err := p.db.Close(ctx); err != nil {
		panic(utils.ErrWrap(op, err))
	}
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

	db, err := pgx.Connect(ctx, connString)
	if err != nil {
		return utils.ErrWrap(op, err)
	}

	p.db = db
	return nil
}

const (
	QueryInit = `
		CREATE TABLE IF NOT EXISTS posts (
    	id SERIAL PRIMARY KEY,
    	title TEXT NOT NULL,
    	content TEXT NOT NULL,
 		time_stamp TIMESTAMP
	);
		CREATE TABLE IF NOT EXISTS users (
    	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    	name VARCHAR(35) NOT NULL,                    
    	pass_hash BYTEA NOT NULL                      
	);
	`
)
