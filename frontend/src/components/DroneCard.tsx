import React from 'react';
import styles from './DroneCard.module.css';
import type { Drone } from '../utils/mockData';

// Icons
import SignalIcon from '../assets/icons/radar-2-svgrepo-com.svg'; // Placeholder for signal

interface DroneCardProps {
    drone: Drone;
}

const DroneCard: React.FC<DroneCardProps> = ({ drone }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return styles.active;
            case 'Hovering': return styles.hovering;
            case 'Returning': return styles.returning;
            case 'Signal Weak': return styles.warning;
            default: return styles.neutral;
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.droneId}>
                    <span className={styles.model}>{drone.model}</span>
                    <span className={styles.id}>{drone.id}</span>
                </div>
                <div className={styles.statusContainer}>
                    <span className={`${styles.statusDot} ${getStatusColor(drone.status)}`}></span>
                    <span className={styles.statusText}>{drone.status}</span>
                </div>
                <div className={styles.moreOptions}>...</div>
            </div>

            <div className={styles.metricsGrid}>
                <div className={styles.metric}>
                    <span className={styles.label}>SPEED</span>
                    <span className={styles.value}>{drone.speed} km/h</span>
                </div>
                <div className={styles.metric}>
                    <span className={styles.label}>ALT</span>
                    <span className={styles.value}>{drone.altitude} m</span>
                </div>
            </div>

            <div className={styles.progressSection}>
                <div className={styles.progressRow}>
                    <div className={styles.progressLabel}>
                        <img src={SignalIcon} alt="Signal" className={styles.icon} />
                        <span>{drone.signalStrength}</span>
                    </div>
                    <span className={styles.progressValue}>{drone.batteryLevel}%</span>
                </div>
                <div className={styles.progressBarBg}>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${drone.batteryLevel}%`, backgroundColor: drone.batteryLevel < 30 ? '#EF4444' : '#111827' }}
                    ></div>
                </div>
            </div>

            <div className={styles.footer}>
                <span className={`${styles.modeBadge} ${drone.mode === 'Manual Override' ? styles.manual : styles.auto}`}>
                    {drone.mode}
                </span>
                <span className={styles.eta}>ETA {drone.eta}</span>
            </div>
        </div>
    );
};

export default DroneCard;
