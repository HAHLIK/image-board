package service

import "errors"

var (
	ErrInvalidToken       = errors.New("invalid token")
	ErrUserIsExist        = errors.New("user is exist")
	ErrPostsNotFound      = errors.New("posts not found")
	ErrInvalidCredentails = errors.New("invalid credentails")
)
