
import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatsCard from '../components/StatsCard';
import styles from './Analytics.module.css';
import { analyticsData } from '../utils/mockData';

// Icons
import EfficiencyIcon from '../assets/icons/graph-asc-svgrepo-com.svg'; // Reusing icons
import IncidentIcon from '../assets/icons/alert-triangle-svgrepo-com.svg';
import FlightIcon from '../assets/icons/plane-departure-solid-svgrepo-com.svg';
import TimeIcon from '../assets/icons/gauge-low-svgrepo-com.svg';

const Analytics: React.FC = () => {
    // TODO: Connect to Analytics DB - Fetch aggregated metrics

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <TopBar />

                <div className={styles.content}>
                    <div className={styles.pageHeader}>
                        <div className={styles.dateFilter}>
                            <button className={styles.filterBtn}>7 Days</button>
                            <button className={`${styles.filterBtn} ${styles.active}`}>30 Days</button>
                            <button className={styles.filterBtn}>YTD</button>
                        </div>
                    </div>

                    <div className={styles.kpiGrid}>
                        <StatsCard
                            title="Mission Success Rate"
                            value={`${analyticsData.missionSuccessRate}%`}
                            change="+2.1%"
                            trend="up"
                            icon={FlightIcon}
                        />
                        <StatsCard
                            title="Fleet Efficiency"
                            value={analyticsData.efficiency.value}
                            change={analyticsData.efficiency.change}
                            trend={analyticsData.efficiency.trend}
                            icon={EfficiencyIcon}
                        />
                        <StatsCard
                            title="Incident Rate"
                            value={analyticsData.incidentRate.value}
                            change={analyticsData.incidentRate.change}
                            trend={analyticsData.incidentRate.trend}
                            icon={IncidentIcon}
                            alert={true}
                        />
                        <StatsCard
                            title="Total Flight Hours"
                            value={analyticsData.flightHours.toLocaleString()}
                            statusText="Record"
                            icon={TimeIcon}
                        />
                    </div>

                    <div className={styles.chartsRow}>
                        <div className={styles.chartCard}>
                            <div className={styles.chartHeader}>
                                <h3>Battery Degradation Analysis</h3>
                            </div>
                            <p className={styles.chartSub}>Lifecycle capacity tracking across active fleet segments.</p>

                            <div className={styles.chartPlaceholder} style={{ textAlign: 'center', padding: '4rem 0', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem' }}>
                                    <path d="M3 3v18h18" />
                                    <path d="M18.5 5.5l-6 6-4-4-5 5" strokeDasharray="4 4" />
                                </svg>
                                <h4 style={{ color: '#475569', margin: '0 0 0.5rem 0' }}>No Historical Data Available</h4>
                                <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0' }}>Waiting for flight telemetry to populate analytics engine.</p>
                            </div>
                        </div>


                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
