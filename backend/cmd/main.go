package main

import (
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/HAHLIK/image-board/internal/app"
	"github.com/HAHLIK/image-board/internal/config"
	postsController "github.com/HAHLIK/image-board/internal/controller/posts"
	"github.com/HAHLIK/image-board/internal/pkg/logger"
	postsService "github.com/HAHLIK/image-board/internal/service/posts"
)

const (
	ENV_PATH             = "../.env"
	ENV_NAME_CONFIG_PATH = "CONFIG_PATH"
)

func main() {
	config := config.MustLoad(ENV_PATH, ENV_NAME_CONFIG_PATH)

	log := logger.SetupLoger(config.Env)

	postsService := postsService.New()
	postsController := postsController.New(postsService, log)

	application := app.New(
		postsController,
		log,
		config.ImageboardPort,
	)

	go application.ImageboardApp.MustRun()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)

	sign := <-stop

	log.Info("application is stopping", slog.String("Signal", sign.String()))

	log.Info("application stopped")
}
