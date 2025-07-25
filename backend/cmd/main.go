package main

import (
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/HAHLIK/image-board/internal/app"
	"github.com/HAHLIK/image-board/internal/config"
	"github.com/HAHLIK/image-board/internal/pkg/logger"
)

const (
	ENV_PATH             = "../.env"
	ENV_NAME_CONFIG_PATH = "CONFIG_PATH"
)

func main() {
	config := config.MustLoad(ENV_PATH, ENV_NAME_CONFIG_PATH)

	log := logger.SetupLoger(config.Env)

	application := app.New(log, config.ImageboardPort)

	go application.ImageboardApp.MustRun()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)

	sign := <-stop

	log.Info("application is stopping", slog.String("Signal", sign.String()))

	log.Info("application stopped")
}
