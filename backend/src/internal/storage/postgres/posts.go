package postgres

import (
	"context"
	"errors"

	models "github.com/HAHLIK/image-board/domain"
	"github.com/HAHLIK/image-board/utils"
	"github.com/jackc/pgx/v5"
)

func (p *PostgresStorage) GetPostsBatch(ctx context.Context, offset int64, limit int64) (models.Posts, error) {
	const op = "postgres.GetPostsBatch"

	batch := models.Posts{Posts: make([]*models.Post, 0)}

	rows, err := p.db.Query(ctx, QueryGetPosts, offset, limit)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return models.Posts{}, nil
		}
		return models.Posts{}, utils.ErrWrap(op, err)
	}

	for rows.Next() {
		var post models.Post
		if err := rows.Scan(&post.Id, &post.Title, &post.Content, &post.AuthorName, &post.TimeStamp); err != nil {
			return models.Posts{}, utils.ErrWrap(op, err)
		}
		batch.Posts = append(batch.Posts, &post)
	}
	return batch, nil
}

func (p *PostgresStorage) SavePost(ctx context.Context, post *models.Post) (int64, error) {
	const op = "postgres.SavePost"

	var id int64

	if err := p.db.QueryRow(ctx, QuerySavePost, post.Title, post.Content, post.AuthorName).Scan(&id); err != nil {
		return 0, utils.ErrWrap(op, err)
	}
	return id, nil
}

const (
	QuerySavePost = `
	INSERT INTO posts (title, content, author_name, time_stamp)
	VALUES ($1, $2, $3, NOW())
	RETURNING id;
	`

	QueryGetPosts = `(
	SELECT * from posts
	ORDER BY id DESC
	LIMIT $2 OFFSET $1
);
`
)
