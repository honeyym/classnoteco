// Minimal HTTP healthcheck for Docker HEALTHCHECK.
// Exits 0 if GET :8080/ returns 2xx, else 1.
package main

import (
	"net/http"
	"os"
)

func main() {
	resp, err := http.Get("http://127.0.0.1:8080/")
	if err != nil {
		os.Exit(1)
	}
	resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 400 {
		os.Exit(1)
	}
	os.Exit(0)
}
