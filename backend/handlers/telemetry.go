package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/JaskirtKaler/DigitalOceanHackathon/backend/db"
)

var (
	latestCameraFeeds = make(map[string]string)
	cameraMutex       sync.RWMutex

	latestTelemetry = make(map[string]TelemetryData)
	telemetryMutex  sync.RWMutex
)

// TelemetryData represents the payload from the ML Agent or the response to the Frontend
type TelemetryData struct {
	DroneID                 string  `json:"drone_id"`
	OrganizationID          string  `json:"organization_id"`
	AttitudePitch           float64 `json:"attitude_pitch"`
	AttitudeRoll            float64 `json:"attitude_roll"`
	AttitudeYaw             float64 `json:"attitude_yaw"`
	VelocityX               float64 `json:"velocity_x"`
	VelocityY               float64 `json:"velocity_y"`
	VelocityZ               float64 `json:"velocity_z"`
	BatteryLevel            int     `json:"battery_level"`
	Altitude                float64 `json:"altitude"`
	GPSLat                  float64 `json:"gps_lat"`
	GPSLon                  float64 `json:"gps_lon"`
	RLAgentStabilityScore   float64 `json:"rl_agent_stability_score"`
	WeatherWindSpeedDisturb float64 `json:"weather_wind_speed_disturbance"`
	CameraFeed              string  `json:"camera_feed,omitempty"` // Base64 encoded JPEG
}

// Telemetry handles both GET (fetching latest) and POST (logging new) telemetry
func Telemetry(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method == http.MethodPost {
		var data TelemetryData
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		if data.CameraFeed != "" {
			cameraMutex.Lock()
			latestCameraFeeds[data.DroneID] = data.CameraFeed
			cameraMutex.Unlock()
		}

		// Upsert the Organization to satisfy foreign key constraints during simulation testing
		orgQuery := `
			INSERT INTO organizations (id, name)
			VALUES ($1, $2)
			ON CONFLICT (id) DO NOTHING;
		`
		_, err := db.DB.Exec(orgQuery, data.OrganizationID, "Simulation Test Org")
		if err != nil {
			log.Printf("Error upserting org: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		// Upsert the Drone (in case it's the first time it's reporting)
		droneQuery := `
			INSERT INTO drones (id, organization_id, is_simulated)
			VALUES ($1, $2, true)
			ON CONFLICT (id) DO NOTHING;
		`
		_, err = db.DB.Exec(droneQuery, data.DroneID, data.OrganizationID)
		if err != nil {
			log.Printf("Error upserting drone: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		// Insert Telemetry
		telemetryQuery := `
			INSERT INTO telemetry_logs (
				drone_id, attitude_pitch, attitude_roll, attitude_yaw, 
				velocity_x, velocity_y, velocity_z, battery_level, 
				altitude, gps_lat, gps_lon, rl_agent_stability_score, 
				weather_wind_speed_disturbance
			) VALUES (
				$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
			)
		`
		_, err = db.DB.Exec(telemetryQuery,
			data.DroneID, data.AttitudePitch, data.AttitudeRoll, data.AttitudeYaw,
			data.VelocityX, data.VelocityY, data.VelocityZ, data.BatteryLevel,
			data.Altitude, data.GPSLat, data.GPSLon, data.RLAgentStabilityScore,
			data.WeatherWindSpeedDisturb,
		)
		if err != nil {
			log.Printf("Error inserting telemetry: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		// Update RAM cache so UI fetches are instant
		telemetryMutex.Lock()
		latestTelemetry[data.DroneID] = data
		telemetryMutex.Unlock()

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "success"})
		return
	}

	if r.Method == http.MethodGet {
		droneID := r.URL.Query().Get("drone_id")
		if droneID == "" {
			http.Error(w, "drone_id parameter is required", http.StatusBadRequest)
			return
		}

		// Fast Path: Check RAM cache first
		telemetryMutex.RLock()
		data, ok := latestTelemetry[droneID]
		telemetryMutex.RUnlock()

		if ok {
			cameraMutex.RLock()
			if feed, okCam := latestCameraFeeds[droneID]; okCam {
				data.CameraFeed = feed
			}
			cameraMutex.RUnlock()

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}

		// Slow Path: Fallback to DB (e.g. server restarted and ram is empty)
		query := `
			SELECT 
				drone_id, attitude_pitch, attitude_roll, attitude_yaw,
				velocity_x, velocity_y, velocity_z, battery_level,
				altitude, gps_lat, gps_lon, rl_agent_stability_score,
				weather_wind_speed_disturbance
			FROM telemetry_logs
			WHERE drone_id = $1
			ORDER BY logged_at DESC
			LIMIT 1
		`

		err := db.DB.QueryRow(query, droneID).Scan(
			&data.DroneID, &data.AttitudePitch, &data.AttitudeRoll, &data.AttitudeYaw,
			&data.VelocityX, &data.VelocityY, &data.VelocityZ, &data.BatteryLevel,
			&data.Altitude, &data.GPSLat, &data.GPSLon, &data.RLAgentStabilityScore,
			&data.WeatherWindSpeedDisturb,
		)

		if err == sql.ErrNoRows {
			// No data found -> return empty success (null) so frontend knows there's no data
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`null`))
			return
		} else if err != nil {
			log.Printf("Error fetching telemetry: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		cameraMutex.RLock()
		if feed, ok := latestCameraFeeds[droneID]; ok {
			data.CameraFeed = feed
		}
		cameraMutex.RUnlock()

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
		return
	}

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}
