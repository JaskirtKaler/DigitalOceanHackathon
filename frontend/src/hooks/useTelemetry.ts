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
    camera_feed?: string;
}

export const useTelemetry = (droneId: string | null) => {
    const [data, setData] = useState<TelemetryData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTelemetry = async (isBackgroundPoll = false) => {
        if (!droneId) return;

        try {
            if (!isBackgroundPoll) setLoading(true);
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
            if (!isBackgroundPoll) setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        
        fetchTelemetry(false);

        // Fetch live ML data at a blazing fast 200ms interval (5Hz)
        const intervalId = setInterval(() => {
            if (isMounted) fetchTelemetry(true);
        }, 200);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [droneId]);

    return { data, loading, error, refetch: () => fetchTelemetry(false) };
};
