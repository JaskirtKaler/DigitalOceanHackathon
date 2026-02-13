import React from 'react';
import styles from './StatsCard.module.css';

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral' | 'stable';
    icon?: string;
    statusText?: string;
    alert?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, trend, icon, statusText, alert }) => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                {icon && <img src={icon} alt="icon" className={styles.icon} />}
            </div>
            <div className={styles.content}>
                <span className={styles.value}>{value}</span>
                {change && (
                    <span className={`${styles.change} ${trend === 'up' ? styles.up : trend === 'down' ? styles.down : styles.neutral}`}>
                        {change}
                    </span>
                )}
                {statusText && (
                    <span className={`${styles.statusText} ${alert ? styles.alert : ''}`}>
                        {statusText}
                    </span>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
