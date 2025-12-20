package service

import "errors"

var (
	ErrInvalidToken       = errors.New("invalid token")
	ErrUserIsNotExist     = errors.New("user is not exist")
	ErrUserIsExist        = errors.New("user is not exist")
	ErrNotFound           = errors.New("not found")
	ErrInvalidCredentails = errors.New("invalid credentails")
)
