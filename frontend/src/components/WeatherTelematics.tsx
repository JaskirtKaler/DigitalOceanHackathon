import React from 'react';
import styles from './WeatherTelematics.module.css';
import { useWeather } from '../hooks/useWeather';

// Icons
import WindIcon from '../assets/icons/wind-svgrepo-com.svg';
import RadarIcon from '../assets/icons/radar-2-svgrepo-com.svg';
import DropletIcon from '../assets/icons/droplet-svgrepo-com.svg';
import GaugeIcon from '../assets/icons/gauge-low-svgrepo-com.svg';
import RefreshIcon from '../assets/icons/refresh-svgrepo-com.svg';

/* ── tiny SVG helpers ── */
const CheckSvg: React.FC<{ size?: number }> = ({ size = 10 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const RocketSvg: React.FC = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
);

const GlobeSvg: React.FC = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const EyeIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const WeatherTelematics: React.FC = () => {
    const { data: weather, refetch } = useWeather();

    // Show N/A when no API data is available
    const hasData = weather !== null;
    const windSpeed = hasData ? Math.round(weather.windSpeed * 0.621371) : null;  // km/h -> mph
    const visibility = hasData ? Math.round(weather.visibility * 0.621371) : null; // km -> mi
    const precipitation = hasData ? (weather.precipitation === 'None' ? 0 : 100) : null;
    const pressure = hasData ? weather.pressure : null;
    const cloudCoverage = hasData ? weather.cloudCoverage : 0;

    // Determine status flags (only valid when data exists)
    const windOk = hasData && windSpeed! <= 25;
    const visOk = hasData && visibility! >= 3;
    const precipOk = hasData && precipitation === 0;
    const pressureOk = hasData && pressure! >= 29.80 && pressure! <= 30.20;

    // Mini line‐chart bar heights for wind
    const windBars = [35, 50, 40, 55, 45, 60, 50, 65, 55, 70, 60, 48, 42, 58, 52];

    // Mini bar chart heights for visibility
    const visBars = [60, 70, 75, 80, 85, 88, 90, 92, 95, 90];

    // Pressure gauge position (29.0 – 31.0 range mapped to 0%-100%)
    const gaugePos = pressure !== null ? Math.max(0, Math.min(100, ((pressure - 29.0) / 2.0) * 100)) : 50;

    return (
        <div className={styles.weatherSection}>
            {/* ── Header ── */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.liveBadge}>
                        <span className={styles.pulseDot} />
                        LIVE TELEMETRY
                    </div>
                    <h2 className={styles.mainTitle}>Pre-Flight Weather &amp; Safety</h2>
                    <p className={styles.subtitle}>
                        Real-time meteorological data for Launch Site Alpha. FAA Part 107 compliance verification in progress.
                    </p>
                </div>
                <div className={styles.headerButtons}>
                    <button className={styles.refreshBtn} onClick={refetch}>
                        <img src={RefreshIcon} alt="refresh" />
                        Refresh Data
                    </button>
                    <button className={styles.radarBtn}>
                        <img src={RadarIcon} alt="radar" />
                        View Radar
                    </button>
                </div>
            </div>

            {/* ── Weather Cards ── */}
            <div className={styles.cardsGrid}>
                {/* Wind Speed */}
                <div className={styles.weatherCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>Wind Speed</span>
                        <img src={WindIcon} alt="wind" className={`${styles.cardIcon} ${styles.windIcon}`} />
                    </div>
                    <div className={styles.cardValue}>
                        <span className={styles.bigValue}>{windSpeed !== null ? windSpeed : 'N/A'}</span>
                        {windSpeed !== null && <span className={styles.unit}>mph</span>}
                    </div>
                    <div className={styles.miniChart}>
                        {windBars.map((h, i) => (
                            <div
                                key={i}
                                className={`${styles.chartBar} ${i >= windBars.length - 3 ? styles.chartBarActive : ''}`}
                                style={{ height: hasData ? `${h}%` : '20%' }}
                            />
                        ))}
                    </div>
                    <div className={styles.statusRow}>
                        <span className={`${styles.statusCheck} ${hasData ? styles.statusGreen : styles.statusGray}`}>
                            {hasData && <CheckSvg />}
                        </span>
                        <span className={styles.statusText}>
                            {!hasData ? 'Awaiting Data...' : windOk ? 'Optimal Range (+2% gust)' : 'Above Threshold'}
                        </span>
                    </div>
                </div>

                {/* Visibility */}
                <div className={styles.weatherCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>Visibility</span>
                        <EyeIcon />
                    </div>
                    <div className={styles.cardValue}>
                        <span className={styles.bigValue}>{visibility !== null ? visibility : 'N/A'}</span>
                        {visibility !== null && <span className={styles.unit}>mi</span>}
                    </div>
                    <div className={styles.miniBarChart}>
                        {visBars.map((h, i) => (
                            <div
                                key={i}
                                className={styles.barSegment}
                                style={{ height: hasData ? `${h}%` : '20%' }}
                            />
                        ))}
                    </div>
                    <div className={styles.statusRow}>
                        <span className={`${styles.statusCheck} ${hasData ? styles.statusBlue : styles.statusGray}`}>
                            {hasData && <CheckSvg />}
                        </span>
                        <span className={styles.statusText}>
                            {!hasData ? 'Awaiting Data...' : visOk ? `Clear Sky (Ceiling > ${cloudCoverage < 50 ? '5000' : '3000'}ft)` : 'Low Visibility Warning'}
                        </span>
                    </div>
                </div>

                {/* Precipitation */}
                <div className={styles.weatherCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>Precipitation</span>
                        <img src={DropletIcon} alt="droplet" className={`${styles.cardIcon} ${styles.precipIcon}`} />
                    </div>
                    <div className={styles.cardValue}>
                        <span className={styles.bigValue}>{precipitation !== null ? precipitation : 'N/A'}</span>
                        {precipitation !== null && <span className={styles.unit}>%</span>}
                    </div>
                    <div className={styles.precipTag}>
                        {!hasData ? 'AWAITING DATA' : precipOk ? 'NO PRECIPITATION DETECTED' : 'PRECIPITATION ACTIVE'}
                    </div>
                    <div className={styles.statusRow}>
                        <span className={`${styles.statusCheck} ${hasData ? styles.statusBlue : styles.statusGray}`}>
                            {hasData && <CheckSvg />}
                        </span>
                        <span className={styles.statusText}>
                            {!hasData ? 'Awaiting Data...' : precipOk ? 'Conditions Dry' : 'Wet Conditions'}
                        </span>
                    </div>
                </div>

                {/* Air Pressure */}
                <div className={styles.weatherCard}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardLabel}>Air Pressure</span>
                        <img src={GaugeIcon} alt="gauge" className={`${styles.cardIcon} ${styles.pressureIcon}`} />
                    </div>
                    <div className={styles.cardValue}>
                        <span className={styles.bigValue}>{pressure !== null ? pressure : 'N/A'}</span>
                        {pressure !== null && <span className={styles.unit}>inHg</span>}
                    </div>
                    <div className={styles.gaugeTrack}>
                        <div className={styles.gaugeThumb} style={{ left: `${gaugePos}%` }} />
                    </div>
                    <div className={styles.statusRow}>
                        <span className={`${styles.statusCheck} ${hasData ? styles.statusYellow : styles.statusGray}`}>
                            {hasData && <CheckSvg />}
                        </span>
                        <span className={styles.statusText}>
                            {!hasData ? 'Awaiting Data...' : pressureOk ? 'Barometer Steady' : 'Pressure Deviation'}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.divider} />

            {/* ── Commander Sign-off ── */}
            <div className={styles.signoffBar}>
                <div className={styles.signoffLeft}>
                    <span className={styles.verifiedIcon}>
                        <svg className={styles.verifiedSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </span>
                    <span className={styles.signoffLabel}>Commander Aero Sign-off</span>
                </div>
                <span className={styles.docRef}>DOC REF: AG-2023-10-27-X99</span>
            </div>

            {/* ── Bottom: Regulatory + Checklist ── */}
            <div className={styles.bottomSection}>
                {/* Left: Regulatory Confirmation */}
                <div className={styles.regulatoryPanel}>
                    <h3 className={styles.regTitle}>Regulatory Confirmation</h3>
                    <p className={styles.regBody}>
                        I, <strong>AI Commander AG-9002</strong>, certify that current meteorological conditions meet
                        all FAA Part 107 requirements for safe UAS operation. Visual Line of Sight (VLOS) is
                        maintained. No Temporary Flight Restrictions (TFRs) are active in the operational zone.
                    </p>
                    <div className={styles.badgeRow}>
                        <div className={styles.infoBadge}>
                            <span className={styles.badgeIconGreen}>
                                <CheckSvg size={12} />
                            </span>
                            <div className={styles.badgeContent}>
                                <span className={styles.badgeTitle}>Automated Check</span>
                                <span className={styles.badgeDesc}>System diagnostics pass all pre-flight safety gates.</span>
                            </div>
                        </div>
                        <div className={styles.infoBadge}>
                            <span className={styles.badgeIconBlue}>
                                <GlobeSvg />
                            </span>
                            <div className={styles.badgeContent}>
                                <span className={styles.badgeTitle}>Digital Signature</span>
                                <span className={styles.badgeDesc}>ID: 0x7f3...a92b verified</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Checklist */}
                <div className={styles.checklistPanel}>
                    <div className={styles.checklistHeader}>
                        <span className={styles.checklistTitle}>Checklist Status</span>
                        <span className={styles.checklistStatus}>Complete</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: '100%' }} />
                    </div>
                    <div className={styles.checklistItems}>
                        <div className={styles.checkItem}>
                            <span className={styles.checkItemIcon}>✓</span>
                            Battery Voltage Check
                        </div>
                        <div className={styles.checkItem}>
                            <span className={styles.checkItemIcon}>✓</span>
                            GPS Satellites Locked (14)
                        </div>
                        <div className={styles.checkItem}>
                            <span className={styles.checkItemIcon}>✓</span>
                            Airspace Authorization
                        </div>
                    </div>
                    <button className={styles.launchBtn}>
                        <RocketSvg />
                        Authorize Launch Sequence
                    </button>
                    <p className={styles.launchDisclaimer}>
                        By clicking, you accept full liability for this flight plan.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WeatherTelematics;
