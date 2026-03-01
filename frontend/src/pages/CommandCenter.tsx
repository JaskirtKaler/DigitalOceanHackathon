import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatsCard from '../components/StatsCard';
import DroneCard from '../components/DroneCard';
import WeatherTelematics from '../components/WeatherTelematics';
import styles from './CommandCenter.module.css';
import { statistics, fleetStatusData } from '../utils/mockData';

// Icons for stats
import PlaneIcon from '../assets/icons/plane-departure-solid-svgrepo-com.svg';
import BatteryIcon from '../assets/icons/temperature-list-svgrepo-com.svg';
import TargetIcon from '../assets/icons/radar-2-svgrepo-com.svg';
import AlertIcon from '../assets/icons/alert-triangle-svgrepo-com.svg';


import FlightCrew from '../components/FlightCrew';
// import RegulatoryAudit from '../components/RegulatoryAudit';

const CommandCenter: React.FC = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <TopBar />

                <div className={styles.dashboardContent}>
                    <div className={styles.leftColumn}>
                        {/* Stats Row */}
                        <div className={styles.statsGrid}>
                            <StatsCard
                                title="Total Active"
                                value={statistics.totalActive.value}
                                change={statistics.totalActive.change}
                                trend="up"
                                icon={PlaneIcon}
                            />
                            <StatsCard
                                title="Avg Battery"
                                value={statistics.avgBattery.value}
                                change={statistics.avgBattery.change}
                                trend="up"
                                icon={BatteryIcon}
                            />
                            <StatsCard
                                title="Missions Today"
                                value={statistics.missionsToday.value}
                                change={statistics.missionsToday.change}
                                trend="up"
                                icon={TargetIcon}
                            />
                            <StatsCard
                                title="Safety Alerts"
                                value={statistics.safetyAlerts.value}
                                statusText={statistics.safetyAlerts.status}
                                alert={false}
                                icon={AlertIcon}
                            />
                        </div>

                        {/* Weather Telematics Section */}
                        <WeatherTelematics />

                        {/* Fleet Status Section */}
                        <div className={styles.fleetSection}>
                            <div className={styles.sectionHeader}>
                                <div>
                                    <h2 className={styles.sectionTitle}>Fleet Status: Live</h2>
                                    <p className={styles.sectionSubtitle}>Real-time monitoring of all active autonomous units.</p>
                                </div>

                            </div>

                            <div className={styles.fleetGrid}>
                                {fleetStatusData.map(drone => (
                                    <DroneCard key={drone.id} drone={drone} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        {/* <RegulatoryAudit /> */}
                        <FlightCrew />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CommandCenter;
