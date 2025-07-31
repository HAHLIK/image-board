package config

import (
	"os"

	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	Env            string `yaml:"env" env-default:"local"`
	ImageboardPort int    `yaml:"imageboard_port" env-default:"8080"`
	PostgresURL    string `yaml:"main_storage_url" env-default:"db-postgres:5432"`
}

func MustLoad(path string) *Config {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		panic("config file not found")
	}

	var config Config

	if err := cleanenv.ReadConfig(path, &config); err != nil {
		panic("can't read config file")
	}

	return &config
}
