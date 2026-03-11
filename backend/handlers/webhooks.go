package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/JaskirtKaler/DigitalOceanHackathon/backend/db"
	svix "github.com/svix/svix-webhooks/go"
)

// ClerkWebhook handles incoming webhooks from Clerk 
func ClerkWebhook(w http.ResponseWriter, r *http.Request) {
	secret := os.Getenv("CLERK_WEBHOOK_SECRET")
	if secret == "" {
		log.Println("CLERK_WEBHOOK_SECRET is not set")
		http.Error(w, "Webhook Secret not set", http.StatusInternalServerError)
		return
	}

	payload, err := io.ReadAll(r.Body)
	if err != nil {
		log.Println("Error reading body", err)
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}

	headers := r.Header

	wh, err := svix.NewWebhook(secret)
	if err != nil {
		log.Println("Error creating svix webhook", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	err = wh.Verify(payload, headers)
	if err != nil {
		log.Println("Webhook verification failed:", err)
		http.Error(w, "Webhook Verification failed", http.StatusBadRequest)
		return
	}

	// Parsing the Clerk Payload 
	var evt struct {
		Type string `json:"type"`
		Data struct {
			ID           string `json:"id"`
			EmailAddress []struct {
				EmailAddress string `json:"email_address"`
			} `json:"email_addresses"`
		} `json:"data"`
	}

	if err := json.Unmarshal(payload, &evt); err != nil {
		log.Println("Error parsing payload", err)
		http.Error(w, "Error parsing payload", http.StatusBadRequest)
		return
	}

	// Handle the event
	if evt.Type == "user.created" {
		userID := evt.Data.ID
		email := ""
		if len(evt.Data.EmailAddress) > 0 {
			email = evt.Data.EmailAddress[0].EmailAddress
		}

		// Insert into db
		err = db.CreateUser(userID, email, "pilot")
		if err != nil {
			log.Println("Failed to create user in DB", err)
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		log.Println("User Successfully Synced:", userID)
	}

	w.WriteHeader(http.StatusOK)
}
