package main

import (
	"fmt"
	"net/http"
)

const (
	PORT = ":8030"
)

func main() {
	http.HandleFunc("/",
		func(w http.ResponseWriter, r *http.Request) {
			fmt.Fprintf(w, "Hello world")
		})

	http.ListenAndServe(PORT, nil)
}
