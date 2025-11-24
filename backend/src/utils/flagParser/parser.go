package parser

import (
	"errors"
	"flag"
	"fmt"
)

var (
	ErrFlagValueIsEmpty = errors.New("flag value is empty")
)

type Parser struct {
	flags map[string]*string
}

func New() *Parser {
	return &Parser{
		flags: make(map[string]*string),
	}
}

func (p *Parser) String(name string, value string, usage string) *string {
	pars := flag.String(name, value, usage)
	p.flags[name] = pars
	return pars
}

func (p *Parser) Parse() error {
	flag.Parse()

	for name, value := range p.flags {
		if *value == "" {
			return fmt.Errorf("%w : %s", ErrFlagValueIsEmpty, name)
		}
	}
	return nil
}
