package app

import (
	"log/slog"

	"github.com/HAHLIK/image-board/internal/app/imageboard"
)

type App struct {
	ImageboardApp *imageboard.App
}

func New(log *slog.Logger, imageboardPort int) *App {
	app := &App{
		ImageboardApp: imageboard.New(log, imageboardPort),
	}

	return app
}
