// Minimal static file server for distroless container.
// Serves SPA with fallback to index.html, cache headers for assets.
package main

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

const root = "/srv"
const addr = ":8080"

var immutableExt = map[string]bool{
	".js": true, ".css": true, ".png": true, ".jpg": true, ".jpeg": true,
	".gif": true, ".ico": true, ".svg": true, ".woff": true, ".woff2": true,
}

func main() {
	fs := http.FileServer(http.Dir(root))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(root, strings.TrimPrefix(r.URL.Path, "/"))
		if info, err := os.Stat(path); err == nil && !info.IsDir() {
			ext := strings.ToLower(filepath.Ext(path))
			if immutableExt[ext] {
				w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
			}
			fs.ServeHTTP(w, r)
			return
		}
		// SPA fallback: serve index.html for non-file routes
		r.URL.Path = "/"
		fs.ServeHTTP(w, r)
	})
	http.ListenAndServe(addr, nil)
}
