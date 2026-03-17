package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/JaskirtKaler/DigitalOceanHackathon/backend/db"
	"github.com/JaskirtKaler/DigitalOceanHackathon/backend/handlers"
	"github.com/JaskirtKaler/DigitalOceanHackathon/backend/middleware"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file (non-fatal if missing — env vars may be set externally)
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	// Initialize the database connection and schema
	db.InitDB()

	mux := http.NewServeMux()

	// Routes
	mux.HandleFunc("/api/weather", handlers.Weather)
	mux.HandleFunc("/api/webhooks/clerk", handlers.ClerkWebhook)
	mux.HandleFunc("/api/telemetry", handlers.Telemetry)

	// Health check
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintln(w, `{"status":"ok"}`)
	})

	// Wrap with CORS
	handler := middleware.CORS(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server listening on :%s", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatal(err)
	}
}
