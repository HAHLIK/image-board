package postgres

import (
	"context"
	"errors"

	models "github.com/HAHLIK/image-board/domain"
	"github.com/HAHLIK/image-board/internal/storage"
	"github.com/HAHLIK/image-board/utils"
	"github.com/jackc/pgx/v5"
)

func (p *PostgresStorage) User(ctx context.Context, name string) (models.User, error) {
	const op = "postgres.User"

	var user models.User

	if err := p.db.QueryRow(ctx, QueryUser, name).Scan(&user.Id, &user.Name, &user.PassHash); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return models.User{}, utils.ErrWrap(op, storage.ErrIsNotExist)
		}
		return models.User{}, utils.ErrWrap(op, err)
	}
	return user, nil
}

func (p *PostgresStorage) SaveUser(ctx context.Context, name string, passhash []byte) ([]byte, error) {
	const op = "postgres.SaveUser"

	var id []byte

	if err := p.db.QueryRow(ctx, QuerySaveUser, name, passhash).Scan(&id); err != nil {
		return nil, utils.ErrWrap(op, err)
	}
	return id, nil
}

const (
	QueryUser = `
	SELECT id, name, pass_hash FROM users
	WHERE name = $1;
	`

	QuerySaveUser = `
	INSERT INTO users (name, pass_hash)
	VALUES ($1, $2)
	RETURNING id;
	`
)
