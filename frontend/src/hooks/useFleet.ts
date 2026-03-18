import { useState, useEffect } from 'react';
import type { Drone } from '../utils/mockData'; // we'll use Drone type

export const useFleet = (orgId: string, pollingIntervalMs: number = 2000) => {
    const [fleet, setFleet] = useState<Drone[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isActive = true;

        const fetchFleet = async () => {
            if (!orgId) {
                if (isActive) {
                    setFleet([]);
                    setIsLoading(false);
                }
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/fleet?org_id=${orgId}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                
                if (isActive) {
                    setFleet(data || []);
                    setError(null);
                }
            } catch (err) {
                if (isActive) {
                    setError(err instanceof Error ? err : new Error('Unknown error'));
                    // keep previous fleet data on error or clear it, up to UX. Let's keep it to prevent flickering.
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        // Initial fetch
        fetchFleet();

        // Polling
        const intervalId = setInterval(fetchFleet, pollingIntervalMs);

        return () => {
            isActive = false;
            clearInterval(intervalId);
        };
    }, [orgId, pollingIntervalMs]);

    return { fleet, isLoading, error };
};
