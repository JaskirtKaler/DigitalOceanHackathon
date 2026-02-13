import React from 'react';
import styles from './RegulatoryAudit.module.css';
import { auditData } from '../utils/mockData';
import { useWeather } from '../hooks/useWeather';

const RegulatoryAudit: React.FC = () => {
    const { data: weather } = useWeather();

    const windSpeed = weather?.windSpeed ?? auditData.windSpeed;
    const visibility = weather?.visibility ?? auditData.visibility;
    const precipitation = weather?.precipitation ?? auditData.precipitation;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>AI Regulatory Audit</h3>
                <div className={styles.badge}>
                    <span className={styles.badgeSub}>COMMANDER</span>
                    <span>AERO</span>
                    <span className={styles.badgeSub}>CERTIFIED</span>
                </div>
            </div>

            <div className={styles.complianceBox}>
                <div className={styles.checkIcon}>
                    <svg className={styles.checkSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <div className={styles.complianceContent}>
                    <h4>Compliance Verified</h4>
                    <p>Current flight conditions meet all regulatory thresholds for autonomous operation.</p>
                </div>
            </div>

            <div className={styles.metrics}>
                <div className={styles.metricRow}>
                    <div className={styles.metricLabel}>
                        <span className={styles.labelMain}>Wind Speed</span>
                        <span className={styles.labelSub}>(Gusts)</span>
                    </div>
                    <div className={styles.metricValue}>
                        {windSpeed} km/h
                        <span className={styles.pass}>PASS (&lt;45)</span>
                    </div>
                </div>
                <div className={styles.metricRow}>
                    <div className={styles.metricLabel}>
                        <span className={styles.labelMain}>Visibility</span>
                    </div>
                    <div className={styles.metricValue}>
                        {visibility} km
                        <span className={styles.pass}>PASS (&gt;5)</span>
                    </div>
                </div>
                <div className={styles.metricRow}>
                    <div className={styles.metricLabel}>
                        <span className={styles.labelMain}>Precipitation</span>
                    </div>
                    <div className={styles.metricValue}>
                        {precipitation}
                        <span className={styles.pass}>PASS</span>
                    </div>
                </div>
            </div>

            <div className={styles.sources}>
                <div className={styles.sourcesTitle}>VERIFICATION SOURCES</div>
                <div className={styles.sourceItem}>
                    <svg className={styles.sourceIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="3" x2="9" y2="21"></line>
                    </svg>
                    <span>FAA Part 107.51 (Weather Minimums)</span>
                </div>
                <div className={styles.sourceItem}>
                    <svg className={styles.sourceIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span>Org Safety Protocol v2.1</span>
                </div>
            </div>

            <button className={styles.auditBtn}>View Full Audit Trail</button>
        </div>
    );
};

export default RegulatoryAudit;
