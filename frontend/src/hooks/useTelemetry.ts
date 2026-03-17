import { useState, useEffect } from 'react';

// Defines the telemetry output matching the DB schema
export interface TelemetryData {
    drone_id: string;
    organization_id: string;
    attitude_pitch: number;
    attitude_roll: number;
    attitude_yaw: number;
    velocity_x: number;
    velocity_y: number;
    velocity_z: number;
    battery_level: number;
    altitude: number;
    gps_lat: number;
    gps_lon: number;
    rl_agent_stability_score: number;
    weather_wind_speed_disturbance: number;
}

export const useTelemetry = (droneId: string | null) => {
    const [data, setData] = useState<TelemetryData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTelemetry = async () => {
        if (!droneId) return;

        try {
            setLoading(true);
            // Fetch from backend telemetry route using matching local host
            const response = await fetch(`http://localhost:8080/api/telemetry?drone_id=${droneId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result); // Can be null if drone hasn't reported data
            setError(null);
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching telemetry:', err);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTelemetry();

        // Optional: poll every few seconds for live ML data
        const intervalId = setInterval(() => {
            fetchTelemetry();
        }, 3000);

        return () => clearInterval(intervalId);
    }, [droneId]);

    return { data, loading, error, refetch: fetchTelemetry };
};
