package errwrapper

import "fmt"

func Wrap(value any, err error) error {
	if err != nil {
		err = fmt.Errorf("%s : %w", value, err)
	}

	return err
}
