package db

import (
	"log"
)

// CreateUser inserts a new user from Clerk into the PostgreSQL database.
func CreateUser(clerkID, email, baseRole string) error {
	query := `
		INSERT INTO users (id, email, base_role) 
		VALUES ($1, $2, $3)
		ON CONFLICT (id) DO NOTHING;
	`
	_, err := DB.Exec(query, clerkID, email, baseRole)
	if err != nil {
		log.Printf("Error inserting user %s into database: %v\n", clerkID, err)
		return err
	}
	log.Printf("Successfully inserted/verified user %s in database\n", clerkID)
	return nil
}
