package config

import (
	"os"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
)

type Config struct {
	Env            string        `yaml:"env" env-default:"local"`
	ImageboardPort int           `yaml:"imageboard_port" env-required:"true"`
	PostgresURL    string        `yaml:"main_storage_url" env-required:"true"`
	AuthTokenTTL   time.Duration `yaml:"auth_token_ttl" env-required:"true"`
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
