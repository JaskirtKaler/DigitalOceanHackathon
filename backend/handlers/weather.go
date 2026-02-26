package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
)

const openWeatherBaseURL = "https://api.openweathermap.org/data/2.5/weather"

// Weather proxies requests to the OpenWeather API so the API key
// is never exposed to the browser.
//
// Query params:
//   - lat (required) — latitude
//   - lon (required) — longitude
func Weather(w http.ResponseWriter, r *http.Request) {
	// Only allow GET
	if r.Method != http.MethodGet {
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	latStr := r.URL.Query().Get("lat")
	lonStr := r.URL.Query().Get("lon")

	if latStr == "" || lonStr == "" {
		http.Error(w, `{"error":"lat and lon query parameters are required"}`, http.StatusBadRequest)
		return
	}

	// Validate that lat/lon are valid numbers
	if _, err := strconv.ParseFloat(latStr, 64); err != nil {
		http.Error(w, `{"error":"lat must be a valid number"}`, http.StatusBadRequest)
		return
	}
	if _, err := strconv.ParseFloat(lonStr, 64); err != nil {
		http.Error(w, `{"error":"lon must be a valid number"}`, http.StatusBadRequest)
		return
	}

	apiKey := os.Getenv("OPEN_WEATHER_KEY")
	if apiKey == "" {
		http.Error(w, `{"error":"server misconfigured: missing API key"}`, http.StatusInternalServerError)
		return
	}

	url := fmt.Sprintf("%s?lat=%s&lon=%s&appid=%s&units=metric", openWeatherBaseURL, latStr, lonStr, apiKey)

	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"failed to reach weather service: %s"}`, err.Error()), http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// Forward the status code and body from OpenWeather
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}
