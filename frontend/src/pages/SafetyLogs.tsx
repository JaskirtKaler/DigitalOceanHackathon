
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import styles from './SafetyLogs.module.css';
import { safetyLogsData } from '../utils/mockData';

// Icons
import ShieldIcon from '../assets/icons/paper-svgrepo-com.svg';

const SafetyLogs: React.FC = () => {
    // TODO: Connect to Logs DB - Fetch paginated logs
    const [filter] = useState<'ALL' | 'LOW' | 'MED' | 'HIGH'>('ALL');
    // const setFilter was unused, removed for now until filter UI is interactive

    const filteredLogs = filter === 'ALL'
        ? safetyLogsData
        : safetyLogsData.filter(log => log.level === filter);

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <TopBar />

                <div className={styles.content}>
                    <div className={styles.pageHeader}>
                        <div>
                            <h2>Safety Log & Audit Trail</h2>
                            <p className={styles.subHeader}>Regulatory compliance records for autonomous operations.</p>
                        </div>
                        <div className={styles.actions}>
                            <div className={styles.searchBox}>
                                <input type="text" placeholder="Search logs..." />
                            </div>
                            <button className={styles.exportBtn}>Export Log</button>
                        </div>
                    </div>

                    <div className={styles.riskMatrix}>
                        {/* Placeholder for future Risk Matrix Visualization */}
                        <div className={styles.matrixInfo}>
                            <h3>System Safety Status</h3>
                            <div className={styles.statusBadge}>
                                <span className={styles.statusDot}></span>
                                <span>All Systems Nominal</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.logsTableContainer}>
                        <div className={styles.tableHeader}>
                            <div className={styles.colDate}>Date & Time</div>
                            <div className={styles.colPilot}>Pilot in Command</div>
                            <div className={styles.colDrone}>Drone ID</div>
                            <div className={styles.colLevel}>Risk Level</div>
                            <div className={styles.colDesc}>Event Description</div>
                            <div className={styles.colVerify}>Verification</div>
                        </div>

                        <div className={styles.logsList}>
                            {filteredLogs.map(log => (
                                <div key={log.id} className={styles.logRow}>
                                    <div className={styles.colDate}>
                                        <div className={styles.date}>{log.date}</div>
                                        <div className={styles.time}>{log.time}</div>
                                    </div>
                                    <div className={styles.colPilot}>
                                        <div className={styles.pilotAvatar} />
                                        <span>{log.pilot}</span>
                                    </div>
                                    <div className={styles.colDrone}>
                                        <span className={styles.droneTag}>{log.droneId}</span>
                                    </div>
                                    <div className={styles.colLevel}>
                                        <span className={`${styles.levelBadge} ${styles[log.level]}`}>
                                            {log.level}
                                        </span>
                                    </div>
                                    <div className={styles.colDesc}>
                                        {log.description}
                                    </div>
                                    <div className={styles.colVerify}>
                                        {log.verified && (
                                            <div className={styles.verifiedBadge}>
                                                <img src={ShieldIcon} alt="Verified" />
                                                <div className={styles.verifiedText}>
                                                    <span>VERIFIED BY</span>
                                                    <strong>COMMANDER AERO</strong>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SafetyLogs;
