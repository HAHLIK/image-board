package imageboard

import (
	"log/slog"
	"strconv"

	"github.com/HAHLIK/image-board/pkg/errwrapper"
)

type Controller interface {
	Run(addr string) error
}

type App struct {
	postsController Controller
	log             *slog.Logger
	port            int
}

func New(postsController Controller, log *slog.Logger, port int) *App {
	return &App{
		postsController: postsController,
		log:             log,
		port:            port,
	}
}

func (a *App) MustRun() {
	if err := a.run(); err != nil {
		panic(err)
	}
}

func (a *App) run() error {
	const op = "imageboard.Run"

	log := a.log.With(
		"op", op,
		"port", a.port,
	)

	log.Info("imageboard is running")

	addr := ":" + strconv.Itoa(a.port)

	if err := a.postsController.Run(addr); err != nil {
		return errwrapper.Wrap(op, err)
	}

	return nil
}
