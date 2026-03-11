package db

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("DATABASE_URL must be set")
	}

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	log.Println("Successfully connected to the PostgreSQL database.")

	execSchema()
}

func execSchema() {
	// Read schema.sql from the same package/directory, or wherever it is located.
	// We'll read it using os.ReadFile
	schemaBytes, err := os.ReadFile("db/schema.sql")
	if err != nil {
		log.Fatal("Failed to read schema.sql: ", err)
	}

	_, err = DB.Exec(string(schemaBytes))
	if err != nil {
		log.Fatal("Failed to execute schema.sql: ", err)
	}

	log.Println("Successfully executed schema.sql")
}
