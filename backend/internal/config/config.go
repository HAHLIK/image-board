package config

import (
	"os"

	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
)

type Config struct {
	Env            string `yaml:"env" env-default:"local"`
	ImageboardPort int    `yaml:"imageboard_port" env-default:"8080"`
}

func MustLoad(envPath string, envConfigPathName string) *Config {
	if err := godotenv.Load(envPath); err != nil {
		panic(".env file not found")
	}

	path := os.Getenv(envConfigPathName)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		panic("config file not found")
	}

	var config Config

	if err := cleanenv.ReadConfig(path, &config); err != nil {
		panic("can't read config file")
	}

	return &config
}
