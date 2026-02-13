
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

                            <div className={styles.chartPlaceholder}>
                                {/* SVG Line Chart Placeholder */}
                                <svg width="100%" height="200" viewBox="0 0 800 200" className={styles.chartSvg}>
                                    <text x="0" y="55" fill="#9CA3AF" fontSize="12">100%</text>
                                    <text x="0" y="105" fill="#9CA3AF" fontSize="12">90%</text>
                                    <text x="0" y="155" fill="#9CA3AF" fontSize="12">80%</text>

                                    <path d="M40,50 Q240,60 440,100 T800,140" fill="none" stroke="#2D7FF9" strokeWidth="4" />
                                    <path d="M40,50 L800,50" stroke="#eee" strokeWidth="1" strokeDasharray="5,5" />
                                    <path d="M40,100 L800,100" stroke="#eee" strokeWidth="1" strokeDasharray="5,5" />
                                    <path d="M40,150 L800,150" stroke="#eee" strokeWidth="1" strokeDasharray="5,5" />

                                    <circle cx="440" cy="100" r="6" fill="#1A1F36" stroke="#fff" strokeWidth="2" />
                                    <rect x="390" y="60" width="100" height="30" rx="4" fill="#1A1F36" />
                                    <text x="440" y="80" textAnchor="middle" fill="#fff" fontSize="12">Avg Cycle: 245</text>
                                </svg>

                                <div className={styles.chartLabels}>
                                    <span>Jan</span>
                                    <span>Mar</span>
                                    <span>May</span>
                                    <span>Jul</span>
                                    <span>Sep</span>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
