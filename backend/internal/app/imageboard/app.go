package imageboard

import (
	"log/slog"
	"strconv"

	"github.com/HAHLIK/image-board/internal/endpoints"
	"github.com/HAHLIK/image-board/internal/pkg/errwrapper"
	"github.com/gin-gonic/gin"
)

type App struct {
	log    *slog.Logger
	router *gin.Engine
	port   int
}

func New(log *slog.Logger, port int) *App {
	router := gin.New()

	router.GET("/", endpoints.Dummy)

	return &App{
		log:    log,
		router: router,
		port:   port,
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

	if err := a.router.Run(addr); err != nil {
		return errwrapper.Wrap(op, err)
	}

	return nil
}
