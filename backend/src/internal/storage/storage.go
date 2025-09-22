package storage

import "errors"

var (
	ErrPostsNotFound = errors.New("posts not found")
	ErrCantExecInit  = errors.New("can't exec init")
)
