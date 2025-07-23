package main

import (
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/HAHLIK/image-board/internal/app"
	"github.com/HAHLIK/image-board/internal/pkg/logger"
)

const (
	PORT = 8030
)

func main() {
	log := logger.SetupLoger(logger.EnvLocal)

	application := app.New(log, PORT)

	go application.ImageboardApp.MustRun()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)

	sign := <-stop

	log.Info("application is stopping", slog.String("Signal", sign.String()))

	log.Info("application stopped")
}
