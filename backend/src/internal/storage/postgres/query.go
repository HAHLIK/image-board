package postgres

const (
	QuerySavePost = `
	INSERT INTO posts (title, content)
	VALUES ($1, $2)
	RETURNING id;
	`

	QueryGetPosts = `(
	SELECT * from posts
	ORDER BY id DESC
	LIMIT $2 OFFSET $1
);
`
	QueryInit = `
	CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
	content TEXT NOT NULL
);
	`
)
