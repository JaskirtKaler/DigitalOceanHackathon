
import { useState, useEffect, useCallback } from 'react';

interface WeatherData {
    windSpeed: number; // km/h
    visibility: number; // km
    precipitation: string;
    pressure: number; // inHg
    cloudCoverage: number; // percentage 0-100
}

interface WeatherState {
    data: WeatherData | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

// San Jose fallback
const DEFAULT_LAT = 37.3382;
const DEFAULT_LON = -121.8863;

export const useWeather = (): WeatherState => {
    const [state, setState] = useState<Omit<WeatherState, 'refetch'>>({
        data: null,
        loading: true,
        error: null,
    });
    const [fetchTrigger, setFetchTrigger] = useState(0);

    const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
        console.log('Fetching weather for', latitude, longitude);
        setState(prev => ({ ...prev, loading: true }));
        try {
            // Call our Go backend proxy — API key stays server-side
            const response = await fetch(
                `/api/weather?lat=${latitude}&lon=${longitude}`
            );

            if (!response.ok) {
                console.error('Weather API response not ok:', response.status, response.statusText);
                throw new Error('Failed to fetch weather data');
            }

            const data = await response.json();
            console.log('Weather API Response:', data);

            // Transform data
            // Wind speed comes in m/s, convert to km/h (multiply by 3.6)
            const windSpeed = Math.round(data.wind.speed * 3.6);

            // Visibility comes in meters, convert to km
            const visibility = Math.round(data.visibility / 1000);

            // Determine precipitation
            let precipitation = 'None';
            if (data.rain) {
                precipitation = 'Rain';
            } else if (data.snow) {
                precipitation = 'Snow';
            } else if (data.weather.some((w: { main: string }) => w.main === 'Drizzle' || w.main === 'Thunderstorm')) {
                precipitation = data.weather[0].main;
            }

            // Pressure: hPa -> inHg (multiply by 0.02953)
            const pressure = parseFloat((data.main.pressure * 0.02953).toFixed(2));

            // Cloud coverage percentage
            const cloudCoverage = data.clouds?.all ?? 0;

            setState({
                data: {
                    windSpeed,
                    visibility,
                    precipitation,
                    pressure,
                    cloudCoverage,
                },
                loading: false,
                error: null,
            });
        } catch (error) {
            console.error('Error fetching weather:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }));
        }
    }, []);

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        fetchWeather(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        console.warn('Geolocation denied or failed, using default location:', error);
                        fetchWeather(DEFAULT_LAT, DEFAULT_LON);
                    }
                );
            } else {
                console.warn('Geolocation not supported, using default location');
                fetchWeather(DEFAULT_LAT, DEFAULT_LON);
            }
        };

        getLocation();
    }, [fetchTrigger, fetchWeather]);

    const refetch = useCallback(() => {
        setFetchTrigger(prev => prev + 1);
    }, []);

    return { ...state, refetch };
};
