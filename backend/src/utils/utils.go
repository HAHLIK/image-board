package utils

import (
	"fmt"
	"log/slog"
	"os"
)

const (
	EnvLocal = "local"
	EnvDev   = "dev"
	EnvProd  = "prod"
)

func SetupLoger(env string) *slog.Logger {
	var log *slog.Logger

	switch env {
	case EnvLocal:
		{
			log = slog.New(
				slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug}))
		}
	case EnvDev:
		{
			log = slog.New(
				slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug}))
		}
	case EnvProd:
		{
			log = slog.New(
				slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
		}
	}

	return log
}

func SlogErr(err error) slog.Attr {
	var slogValue slog.Value

	if err != nil {
		slogValue = slog.StringValue(err.Error())
	}

	return slog.Attr{
		Key:   "error",
		Value: slogValue,
	}
}

func ErrWrap(value any, err error) error {
	if err != nil {
		err = fmt.Errorf("%s : %w", value, err)
	}

	return err
}
