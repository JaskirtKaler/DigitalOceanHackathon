package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/JaskirtKaler/DigitalOceanHackathon/backend/db"
)

// FleetDroneResponse matches the React DroneCard expectations
type FleetDroneResponse struct {
	ID             string  `json:"id"`
	Model          string  `json:"model"`
	Status         string  `json:"status"` // 'Active' | 'Hovering' | 'Offline'
	Speed          float64 `json:"speed"`  // km/h
	Altitude       float64 `json:"altitude"`
	SignalStrength string  `json:"signalStrength"`
	BatteryLevel   int     `json:"batteryLevel"`
	Mode           string  `json:"mode"`
	ETA            string  `json:"eta,omitempty"`
}

// Fleet handles GET requests to fetch the live active fleet for an organization
func Fleet(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	orgID := r.URL.Query().Get("org_id")
	if orgID == "" {
		http.Error(w, "org_id parameter is required", http.StatusBadRequest)
		return
	}

	// This query fetches the latest telemetry row for each drone in the organization.
	// We use DISTINCT ON (d.id) coupled with an ORDER BY t.logged_at DESC.
	query := `
		SELECT DISTINCT ON (d.id)
			d.id,
			d.agent_model_version,
			t.attitude_pitch,
			t.attitude_roll,
			t.velocity_x,
			t.velocity_y,
			t.velocity_z,
			t.battery_level,
			t.altitude,
			t.rl_agent_stability_score,
			EXTRACT(EPOCH FROM (NOW() - t.logged_at)) AS seconds_since_log
		FROM drones d
		JOIN telemetry_logs t ON d.id = t.drone_id
		WHERE d.organization_id = $1
		ORDER BY d.id, t.logged_at DESC
	`

	rows, err := db.DB.Query(query, orgID)
	if err != nil {
		log.Printf("Error fetching fleet data: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var fleet []FleetDroneResponse

	for rows.Next() {
		var id, model string
		var pitch, roll, velX, velY, velZ, alt, stability, secondsSinceLog sql.NullFloat64
		var battery sql.NullInt32

		if err := rows.Scan(
			&id, &model, &pitch, &roll, &velX, &velY, &velZ, &battery, &alt, &stability, &secondsSinceLog,
		); err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}

		// If the last log was more than 30 seconds ago, consider it offline entirely and don't return it
		if !secondsSinceLog.Valid || secondsSinceLog.Float64 > 30 {
			continue
		}

		status := "Active"
		
		speedMps := 0.0
		if velX.Valid && velY.Valid && velZ.Valid {
			speedMps = (velX.Float64*velX.Float64 + velY.Float64*velY.Float64 + velZ.Float64*velZ.Float64)
			// Rough magnitude
			if speedMps > 0 {
				speedMps = 3.6 * (0.5 * speedMps) // Roughly converting sum of squares to something reasonable for km/h for the UI if we don't do full sqrt
			}
		}

		// Simple heuristic: if speed is very low, it's hovering
		if speedMps < 1.0 {
			status = "Hovering"
		}
		
		if stability.Valid && stability.Float64 < 0.5 {
			status = "Signal Weak"
		}

		signalStrength := "Strong"
		if stability.Valid {
			if stability.Float64 < 0.5 {
				signalStrength = "Weak"
			} else if stability.Float64 < 0.8 {
				signalStrength = "Good"
			}
		}

		fleet = append(fleet, FleetDroneResponse{
			ID:             id,
			Model:          model,
			Status:         status,
			Speed:          float64(int(speedMps*10)) / 10.0, // round to 1 dec
			Altitude:       float64(int(alt.Float64*10)) / 10.0,
			SignalStrength: signalStrength,
			BatteryLevel:   int(battery.Int32),
			Mode:           "Autonomous",
			ETA:            time.Now().Add(10 * time.Minute).Format("15:04"), // mock ETA
		})
	}

	// Always return an array, even if empty
	if fleet == nil {
		fleet = []FleetDroneResponse{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(fleet)
}
