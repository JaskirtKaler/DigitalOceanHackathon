import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import styles from './ActiveMission.module.css';
import { useTelemetry } from '../hooks/useTelemetry';

const ActiveMission: React.FC = () => {
    const [activeDroneId, setActiveDroneId] = useState('AG-ALPHA-01');

    const { data: telemetry } = useTelemetry(activeDroneId);

    // Derived values or empty representations
    const hasData = !!telemetry;
    const altitude = hasData ? Math.round(telemetry.altitude) : 'N/A';
    const velocity = hasData ? Math.round(Math.sqrt(telemetry.velocity_x ** 2 + telemetry.velocity_y ** 2) * 2.23694) : 'N/A'; // m/s to mph
    const ppoScore = hasData ? (telemetry.rl_agent_stability_score * 100).toFixed(1) : 'N/A';
    const pitch = hasData ? (telemetry.attitude_pitch * (180 / Math.PI)).toFixed(1) : 'N/A';
    const roll = hasData ? (telemetry.attitude_roll * (180 / Math.PI)).toFixed(1) : 'N/A';
    const battery = hasData ? telemetry.battery_level : 0;
    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>

                {/* ── Camera Background ── */}
                {hasData && telemetry.camera_feed ? (
                    <div className={styles.cameraLiveOverlay}>
                        <img src={telemetry.camera_feed} className={styles.cameraFeedImg} alt="Live POV" />
                    </div>
                ) : (
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
                )}

                {/* ── Top: Mission Badge + Control Mode ── */}
                <div className={styles.topHeader}>
                    <div className={styles.missionBadge}>
                        <div className={styles.missionIcon}>
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" /></svg>
                        </div>
                        <div className={styles.missionInfo}>
                            <span className={styles.missionTitle}>Mission Control</span>
                            <span className={styles.missionDrone}>
                                <select
                                    className={styles.droneSelect}
                                    value={activeDroneId}
                                    onChange={(e) => setActiveDroneId(e.target.value)}
                                >
                                    <option value="AG-ALPHA-01">AG-ALPHA-01</option>
                                    <option value="AG-ALPHA-02">AG-ALPHA-02</option>
                                    <option value="AG-ALPHA-03">AG-ALPHA-03</option>
                                </select>
                                <span className={hasData ? styles.liveDot : styles.offlineDot}>{hasData ? 'LIVE' : 'OFFLINE'}</span>
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
                        <div className={styles.panelValue}>{altitude}<span className={styles.panelUnit}>{hasData ? 'ft' : ''}</span></div>
                        <div className={styles.panelChange}>{hasData ? 'Tracking Live Data' : 'Waiting for connection'}</div>
                    </div>

                    {/* Velocity */}
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <span className={styles.panelLabel}>Velocity</span>
                            <span className={styles.panelIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                            </span>
                        </div>
                        <div className={styles.panelValue}>{velocity}<span className={styles.panelUnit}>{hasData ? 'mph' : ''}</span></div>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: hasData ? `${Math.min(100, (Number(velocity) / 60) * 100)}%` : '0%' }} />
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
                        <div className={styles.agentValue}>{ppoScore}<span className={styles.agentPercent}>{hasData ? '%' : ''}</span></div>
                        <div className={styles.agentBars}>
                            <div className={`${styles.bar} ${hasData && telemetry.rl_agent_stability_score > 0.2 ? styles.barFilled : ''}`} />
                            <div className={`${styles.bar} ${hasData && telemetry.rl_agent_stability_score > 0.4 ? styles.barFilled : ''}`} />
                            <div className={`${styles.bar} ${hasData && telemetry.rl_agent_stability_score > 0.6 ? styles.barFilled : ''}`} />
                            <div className={`${styles.bar} ${hasData && telemetry.rl_agent_stability_score > 0.8 ? styles.barFilled : ''}`} />
                            <div className={`${styles.bar} ${hasData && telemetry.rl_agent_stability_score > 0.95 ? styles.barFilled : ''}`} />
                        </div>
                        <div className={styles.agentConfidence}>Agent Confidence: {hasData ? (telemetry.rl_agent_stability_score > 0.8 ? 'High' : 'Low') : 'N/A'}</div>
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
                            <div className={styles.batteryFill} style={{ height: `${battery}%` }} />
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
                            {hasData ? (
                                <div className={styles.logEntry}>
                                    <span className={styles.logTime}>NOW</span>
                                    <span className={`${styles.logMessage} ${styles.logAI}`}>Receiving live telemetry frames. PPO Score: {ppoScore}%</span>
                                </div>
                            ) : (
                                <div className={styles.logEntry}>
                                    <span className={styles.logTime}>N/A</span>
                                    <span className={styles.logMessage}>Waiting for Python Environment Data stream...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.orientationPanel}>
                        <div className={styles.orientationItem}>
                            <span className={styles.orientationLabel}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                                Pitch
                            </span>
                            <span className={styles.orientationValue}>{pitch}{hasData ? '°' : ''}</span>
                        </div>
                        <div className={styles.orientationItem}>
                            <span className={styles.orientationLabel}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
                                Roll
                            </span>
                            <span className={styles.orientationValue}>{roll}{hasData ? '°' : ''}</span>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default ActiveMission;
