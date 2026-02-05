package flagandenv

import (
	"errors"
	"flag"
	"fmt"
	"os"
)

var (
	ErrValueIsEmpty = errors.New("value is empty")
)

type FlagParser struct {
	flags map[string]*string
}

func NewFlagParser() *FlagParser {
	return &FlagParser{
		flags: make(map[string]*string),
	}
}

func (f *FlagParser) String(name string, value string, usage string) *string {
	pars := flag.String(name, value, usage)
	f.flags[name] = pars
	return pars
}

func (f *FlagParser) Parse() error {
	flag.Parse()

	for name, value := range f.flags {
		if *value == "" {
			return fmt.Errorf("%w : %s", ErrValueIsEmpty, name)
		}
	}
	return nil
}

type EnvGetter struct {
	emptyValues []string
}

func (e *EnvGetter) Get(key string) string {
	value := os.Getenv(key)
	if value == "" {
		e.emptyValues = append(e.emptyValues, key)
	}
	return value
}

func (e *EnvGetter) EmptiesValues() error {
	if len(e.emptyValues) == 0 {
		return nil
	}
	errStr := ""
	for _, emptyValue := range e.emptyValues {
		errStr = errStr + emptyValue + ""
	}
	return errors.New("Values is empty by keys: " + errStr)
}
