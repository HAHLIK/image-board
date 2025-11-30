package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/HAHLIK/image-board/internal/app"
	"github.com/HAHLIK/image-board/internal/config"
	"github.com/HAHLIK/image-board/internal/handler"
	"github.com/HAHLIK/image-board/internal/service"
	"github.com/HAHLIK/image-board/internal/storage/postgres"
	"github.com/HAHLIK/image-board/utils"
	flagparser "github.com/HAHLIK/image-board/utils/flagParser"
)

func main() {
	//Config and logger
	parser := flagparser.New()

	authJWTSecret := parser.String("auth-jwt-secret", "", "secret for auth jwt")
	cfgPath := parser.String("cfg-path", "", "path to config file")
	pgsUser := parser.String("pgs-user", "", "name postgres user")
	pgsPassword := parser.String("pgs-pass", "", "postgres password")

	if err := parser.Parse(); err != nil {
		panic(err)
	}

	cfg := config.MustLoad(*cfgPath)
	log := utils.SetupLoger(cfg.Env)
	ctx := context.Background()

	//Storage
	postgresStorage := postgres.PostgresStorage{}
	postgresStorage.MustConnect(ctx, cfg.PostgresURL, *pgsUser, *pgsPassword)

	defer postgresStorage.Stop(ctx)

	if err := postgresStorage.Init(ctx); err != nil {
		log.Warn(err.Error())
	}

	//Services
	postsService := &service.PostsService{
		CacheProvider: &postgresStorage,
		Provider:      &postgresStorage,
		Log:           log,
	}

	authService := &service.AuthService{
		UserProvider: &postgresStorage,
		TokenTTL:     cfg.AuthTokenTTL,
		Log:          log,
		Secret:       []byte(*authJWTSecret),
	}

	//handler
	handler := handler.New(
		log,
		authService,
		postsService,
	)
	handler.Init()

	//Application run
	application := app.New(
		handler,
		log,
		cfg.ImageboardPort,
	)
	go application.MustRun()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)

	sign := <-stop

	log.Info("application is stopping", slog.String("Signal", sign.String()))

	postgresStorage.Stop(ctx)

	log.Info("application stopped")
}
