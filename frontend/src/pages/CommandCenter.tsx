import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatsCard from '../components/StatsCard';
import DroneCard from '../components/DroneCard';
import WeatherTelematics from '../components/WeatherTelematics';
import styles from './CommandCenter.module.css';
import { statistics } from '../utils/mockData';

// Icons for stats
import PlaneIcon from '../assets/icons/plane-departure-solid-svgrepo-com.svg';
import BatteryIcon from '../assets/icons/temperature-list-svgrepo-com.svg';
import TargetIcon from '../assets/icons/radar-2-svgrepo-com.svg';
import AlertIcon from '../assets/icons/alert-triangle-svgrepo-com.svg';


import { useState, useEffect } from 'react';
import FlightCrew from '../components/FlightCrew';
import { useFleet } from '../hooks/useFleet';
// import RegulatoryAudit from '../components/RegulatoryAudit';

const CommandCenter: React.FC = () => {
    // Org filter
    const [currentOrgId, setCurrentOrgId] = useState(localStorage.getItem('currentOrgId') || 'org-001');

    useEffect(() => {
        const handleOrgChange = () => {
            setCurrentOrgId(localStorage.getItem('currentOrgId') || 'org-001');
        };
        window.addEventListener('orgChanged', handleOrgChange);
        return () => window.removeEventListener('orgChanged', handleOrgChange);
    }, []);

    const isSkyHigh = currentOrgId === 'org-001';
    
    const { fleet } = useFleet(currentOrgId);

    // Default to empty arrays/objects if not SkyHigh
    const activeFleet = isSkyHigh ? fleet : [];
    const activeStats = isSkyHigh ? statistics : {
        totalActive: { value: 0, change: '0%', trend: 'stable' },
        avgBattery: { value: 'N/A', change: '0%', trend: 'stable' },
        missionsToday: { value: 0, change: '0%', trend: 'stable' },
        safetyAlerts: { value: 0, status: 'N/A' }
    };
    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <TopBar />

                <div className={styles.content}>
                    <div className={styles.pageHeader}>
                        <div>
                            <h2>Command Center Dashboard</h2>
                            <p className={styles.subHeader}>Real-time monitoring and active fleet control interface.</p>
                        </div>
                    </div>

                    <div className={styles.dashboardContent}>
                        <div className={styles.leftColumn}>
                        {/* Stats Row */}
                        <div className={styles.statsGrid}>
                            <StatsCard
                                title="Total Active"
                                value={activeFleet.length}
                                change={activeStats.totalActive.change}
                                trend={activeStats.totalActive.trend as any}
                                icon={PlaneIcon}
                            />
                            <StatsCard
                                title="Avg Battery"
                                value={activeStats.avgBattery.value}
                                change={activeStats.avgBattery.change}
                                trend={activeStats.avgBattery.trend as any}
                                icon={BatteryIcon}
                            />
                            <StatsCard
                                title="Missions Today"
                                value={activeStats.missionsToday.value}
                                change={activeStats.missionsToday.change}
                                trend={activeStats.missionsToday.trend as any}
                                icon={TargetIcon}
                            />
                            <StatsCard
                                title="Safety Alerts"
                                value={activeStats.safetyAlerts.value}
                                statusText={activeStats.safetyAlerts.status}
                                alert={false}
                                icon={AlertIcon}
                            />
                        </div>

                        {/* Weather Telematics Section */}
                        {isSkyHigh ? <WeatherTelematics /> : (
                            <div className={styles.emptyWeatherState} style={{ padding: '2rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1', marginBottom: '1.5rem', color: '#64748B' }}>
                                No active launch sites for this organization.
                            </div>
                        )}

                        {/* Fleet Status Section */}
                        <div className={styles.fleetSection}>
                            <div className={styles.sectionHeader}>
                                <div>
                                    <h2 className={styles.sectionTitle}>Fleet Status: Live</h2>
                                    <p className={styles.sectionSubtitle}>Real-time monitoring of all active autonomous units.</p>
                                </div>

                            </div>

                            <div className={styles.fleetGrid}>
                                {activeFleet.length > 0 ? (
                                    activeFleet.map(drone => (
                                        <DroneCard key={drone.id} drone={drone} />
                                    ))
                                ) : (
                                    <div style={{ padding: '2rem', gridColumn: '1 / -1', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
                                        No active drones in the fleet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        {/* <RegulatoryAudit /> */}
                        <FlightCrew />
                    </div>
                </div>
                </div>
            </main>
        </div>
    );
};

export default CommandCenter;
