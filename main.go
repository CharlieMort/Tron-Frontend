package main

import (
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("Welcome...")
	http.Handle("/", http.FileServer(http.Dir("./src")))
	http.ListenAndServe(":3000", nil)
}
