package postgres

const (
	QueryGetPosts = `
	CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL
);
`
)
