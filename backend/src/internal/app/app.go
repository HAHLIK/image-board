package app

import (
	"log/slog"

	"github.com/HAHLIK/image-board/internal/app/imageboard"
)

type App struct {
	ImageboardApp *imageboard.App
}

func New(
	postsController imageboard.Controller,
	log *slog.Logger,
	imageboardPort int,
) *App {
	app := &App{
		ImageboardApp: imageboard.New(
			postsController,
			log,
			imageboardPort),
	}

	return app
}
