import React from 'react';
import Sidebar from '../components/Sidebar';
import styles from './ActiveMission.module.css';

const ActiveMission: React.FC = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>

                {/* ── Camera disabled background ── */}
                <div className={styles.cameraDisabledOverlay}>
                    <div className={styles.cameraIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="1" y1="1" x2="23" y2="23" />
                            <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m2-2h6l2 2h4a2 2 0 0 1 2 2v9.34" />
                            <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
                        </svg>
                    </div>
                    <span className={styles.cameraLabel}>Camera Feed Disabled</span>
                    <span className={styles.cameraSubLabel}>No live video signal available</span>
                </div>

                {/* ── Top: Mission Badge + Control Mode ── */}
                <div className={styles.topHeader}>
                    <div className={styles.missionBadge}>
                        <div className={styles.missionIcon}>
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" /></svg>
                        </div>
                        <div className={styles.missionInfo}>
                            <span className={styles.missionTitle}>Mission Control</span>
                            <span className={styles.missionDrone}>
                                Drone-X14 <span className={styles.liveDot}>LIVE</span>
                            </span>
                        </div>
                    </div>

                    <div className={styles.controlMode}>
                        <div className={styles.controlLabel}>
                            <span className={styles.controlTitle}>
                                <span className={styles.controlDot} /> Control Mode
                            </span>
                            <span className={styles.controlName}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" />
                                </svg>
                                AI Pilot: Commander Aero
                            </span>
                        </div>
                        <div className={styles.controlActions}>
                            <button className={styles.actionBtn}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                            </button>
                            <button className={styles.actionBtn}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 14h6v6H4zM14 14h6v6h-6zM4 4h6v6H4zM14 4h6v6h-6z" /></svg>
                            </button>
                            <button className={`${styles.actionBtn} ${styles.alertBtn}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Left: Telemetry Panels ── */}
                <div className={styles.leftPanels}>
                    {/* Altitude */}
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <span className={styles.panelLabel}>Altitude</span>
                            <span className={styles.panelIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                            </span>
                        </div>
                        <div className={styles.panelValue}>425<span className={styles.panelUnit}>ft</span></div>
                        <div className={styles.panelChange}>↑ 12 ft/s</div>
                    </div>

                    {/* Velocity */}
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <span className={styles.panelLabel}>Velocity</span>
                            <span className={styles.panelIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                            </span>
                        </div>
                        <div className={styles.panelValue}>38<span className={styles.panelUnit}>mph</span></div>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: '55%' }} />
                        </div>
                    </div>

                    {/* Agent Brain Status */}
                    <div className={styles.agentPanel}>
                        <div className={styles.agentHeader}>
                            <div className={styles.agentBadge}>
                                <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4" /></svg>
                                Agent Brain Status
                            </div>
                            <svg className={styles.agentGear} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </div>
                        <div className={styles.agentLabel}>PPO Stability</div>
                        <div className={styles.agentValue}>98.4<span className={styles.agentPercent}>%</span></div>
                        <div className={styles.agentBars}>
                            <div className={`${styles.bar} ${styles.barFilled}`} />
                            <div className={`${styles.bar} ${styles.barFilled}`} />
                            <div className={`${styles.bar} ${styles.barFilled}`} />
                            <div className={`${styles.bar} ${styles.barFilled}`} />
                            <div className={styles.bar} />
                        </div>
                        <div className={styles.agentConfidence}>Agent Confidence: High</div>
                    </div>

                    {/* Map */}
                    <div className={styles.mapPanel}>
                        <div className={styles.mapPlaceholder}>
                            <span className={styles.mapText}>San Jose Area</span>
                            <span className={styles.mapBadge}>MAP</span>
                        </div>
                    </div>
                </div>

                {/* ── Right: Battery + Signal ── */}
                <div className={styles.rightSidePanel}>
                    <div className={styles.batteryBar}>
                        <span className={styles.batteryLabel}>BAT</span>
                        <div className={styles.batteryTrack}>
                            <div className={styles.batteryFill} style={{ height: '72%' }} />
                        </div>
                        <span className={styles.signalLabel}>SIG</span>
                    </div>
                </div>

                {/* ── Bottom: Flight Log + Orientation ── */}
                <div className={styles.bottomPanel}>
                    <div className={styles.flightLog}>
                        <div className={styles.logHeader}>
                            <span className={styles.logTitle}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                Flight Log / AI Decisions
                            </span>
                            <span className={styles.logDot} />
                        </div>
                        <div className={styles.logEntries}>
                            <div className={styles.logEntry}>
                                <span className={styles.logTime}>10:41:55</span>
                                <span className={styles.logMessage}>System check complete. All motors nominal.</span>
                            </div>
                            <div className={styles.logEntry}>
                                <span className={styles.logTime}>10:41:58</span>
                                <span className={styles.logMessage}>Wind shear detected (15mph NW). Compensating roll +1.2°.</span>
                            </div>
                            <div className={styles.logEntry}>
                                <span className={styles.logTime}>10:42:01</span>
                                <span className={`${styles.logMessage} ${styles.logAlert}`}>Object detected: Obstacle Tree. ID#4922</span>
                            </div>
                            <div className={styles.logEntry}>
                                <span className={styles.logTime}>10:42:02</span>
                                <span className={styles.logMessage}>AI Decision: Rerouting path +5 degrees North.</span>
                            </div>
                            <div className={styles.logEntry}>
                                <span className={styles.logTime}>10:42:03</span>
                                <span className={`${styles.logMessage} ${styles.logAI}`}>PPO Agent: Stability verified. Trajectory updated.</span>
                            </div>
                            <div className={styles.logEntry}>
                                <span className={styles.logTime}>10:42:05</span>
                                <span className={styles.logMessage}>Maintaining altitude 425ft. Scanning sector 7.</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.orientationPanel}>
                        <div className={styles.orientationItem}>
                            <span className={styles.orientationLabel}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                                Pitch
                            </span>
                            <span className={styles.orientationValue}>-4.2°</span>
                        </div>
                        <div className={styles.orientationItem}>
                            <span className={styles.orientationLabel}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
                                Roll
                            </span>
                            <span className={styles.orientationValue}>+1.8°</span>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ActiveMission;
