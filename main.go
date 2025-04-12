package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	// Replace "." with the actual path of the directory you want to expose.
	directoryPath := "./src"

	// Check if the directory exists
	_, err := os.Stat(directoryPath)
	if os.IsNotExist(err) {
		fmt.Printf("Directory '%s' not found.\n", directoryPath)
		return
	}

	// Create a file server handler to serve the directory's contents
	fileServer := http.FileServer(http.Dir(directoryPath))

	// Create a new HTTP server and handle requests
	http.Handle("/", fileServer)

	// Start the server on port 8080
	port := 3000
	fmt.Printf("Server started at http://localhost:%d\n", port)
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}
}
