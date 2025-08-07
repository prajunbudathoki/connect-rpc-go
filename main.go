package main

import (
	"context"
	"fmt"
	"myapp/api/products/v1/productsv1connect"
	"myapp/api/users/v1/usersv1connect"
	"myapp/products"
	productsrepo "myapp/repositories/products"
	usersrepo "myapp/repositories/users"
	"myapp/users"

	"net/http"
	"time"

	"github.com/jackc/pgx/v5"

	"github.com/rs/cors"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "your_username"
	password = "your_password"
	dbname   = "sqlctest"
)

func newCORS() *cors.Cors {
	// To let web developers play with the demo service from browsers, we need a
	// very permissive CORS setup.
	return cors.New(cors.Options{
		AllowedMethods: []string{
			http.MethodHead,
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodPatch,
			http.MethodDelete,
		},
		AllowOriginFunc: func(_ /* origin */ string) bool {
			// Allow all origins, which effectively disables CORS.
			return true
		},
		AllowedHeaders: []string{"*"},
		ExposedHeaders: []string{
			// Content-Type is in the default safelist.
			"Accept",
			"Accept-Encoding",
			"Accept-Post",
			"Connect-Accept-Encoding",
			"Connect-Content-Encoding",
			"Content-Encoding",
			"Grpc-Accept-Encoding",
			"Grpc-Encoding",
			"Grpc-Message",
			"Grpc-Status",
			"Grpc-Status-Details-Bin",
		},
		// Let browsers cache CORS information for longer, which reduces the number
		// of preflight requests. Any changes to ExposedHeaders won't take effect
		// until the cached data expires. FF caps this value at 24h, and modern
		// Chrome caps it at 2h.
		MaxAge: int(2 * time.Hour / time.Second),
	})
}
func main() {

	conn, err := pgx.Connect(context.Background(), "postgres://your_username:your_password@localhost:5432/sqlctest?sslmode=disable")
	if err != nil {
		panic(err)
	}

	mux := http.NewServeMux()

	productsRepo := productsrepo.New(conn)
	productServiceHandler := products.NewProductHandler(productsRepo)
	path, handler := productsv1connect.NewProductServiceHandler(productServiceHandler)

	usersRepo := usersrepo.New(conn)
	userServiceHandler := users.NewUsersHandler(usersRepo, productsRepo)
	usersPath, usersHandler := usersv1connect.NewUsersServiceHandler(userServiceHandler)

	mux.Handle(path, handler)
	mux.Handle(usersPath, usersHandler)

	mux.HandleFunc("POST /upload", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "hello")
	})

	srv := &http.Server{
		Addr: ":8080",
		Handler: h2c.NewHandler(
			newCORS().Handler(mux),
			&http2.Server{},
		),
		ReadHeaderTimeout: time.Second,
		ReadTimeout:       5 * time.Minute,
		WriteTimeout:      5 * time.Minute,
		MaxHeaderBytes:    8 * 1024, // 8KiB
	}

	srv.ListenAndServe()
}