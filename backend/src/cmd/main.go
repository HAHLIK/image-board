package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/HAHLIK/image-board/internal/app"
	"github.com/HAHLIK/image-board/internal/config"
	postsController "github.com/HAHLIK/image-board/internal/controller/posts"
	postsService "github.com/HAHLIK/image-board/internal/service/posts"
	"github.com/HAHLIK/image-board/internal/storage/postgres"
	flagparser "github.com/HAHLIK/image-board/pkg/flagParser"
	"github.com/HAHLIK/image-board/pkg/logger"
)

func main() {
	parser := flagparser.New()

	cfgPath := parser.String("cfg-path", "", "path to config file")
	pgsUser := parser.String("pgs-user", "", "name postgres user")
	pgsPassword := parser.String("pgs-pass", "", "postgres password")

	if err := parser.Parse(); err != nil {
		panic(err)
	}

	cfg := config.MustLoad(*cfgPath)

	log := logger.SetupLoger(cfg.Env)

	ctx := context.Background()

	storage := postgres.New()
	storage.MustConnect(ctx, cfg.PostgresURL, *pgsUser, *pgsPassword)

	defer storage.Stop(ctx)

	postsService := postsService.New(storage, storage, log)
	postsController := postsController.New(postsService, log)

	application := app.New(
		postsController,
		log,
		cfg.ImageboardPort,
	)
	go application.ImageboardApp.MustRun()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)

	sign := <-stop

	log.Info("application is stopping", slog.String("Signal", sign.String()))

	storage.Stop(ctx)

	log.Info("application stopped")
}
