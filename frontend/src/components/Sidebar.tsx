
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import AeroGradientLogo from './AeroGradientLogo';
import styles from './Sidebar.module.css';

// Import SVG icons as React components or image sources
import DashboardIcon from '../assets/icons/dashboard-svgrepo-com.svg';
import FleetIcon from '../assets/icons/radar-2-svgrepo-com.svg';
import MissionsIcon from '../assets/icons/location-svgrepo-com.svg';
import AnalyticsIcon from '../assets/icons/graph-asc-svgrepo-com.svg';
import SafetyIcon from '../assets/icons/alert-triangle-svgrepo-com.svg';
import SettingsIcon from '../assets/icons/setting-svgrepo-com.svg';

// Helper to render SVG or img tag
const Icon = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} className={styles.icon} />
);

const Sidebar: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <AeroGradientLogo showText={true} />
            </div>

            <nav className={styles.nav}>
                <div className={styles.sectionHeader}>OPERATIONS</div>
                <Link to="/command-center" className={`${styles.navItem} ${isActive('/command-center') ? styles.active : ''}`}>
                    <Icon src={DashboardIcon} alt="Dashboard" />
                    <span>Dashboard</span>
                </Link>
                <a href="#" className={styles.navItem}>
                    <Icon src={FleetIcon} alt="Weather Telematics" />
                    <span>Weather Telematics</span>
                </a>
                <a href="#" className={styles.navItem}>
                    <Icon src={MissionsIcon} alt="Active Missions" />
                    <span>Active Missions</span>
                </a>
                <Link to="/analytics" className={`${styles.navItem} ${isActive('/analytics') ? styles.active : ''}`}>
                    <Icon src={AnalyticsIcon} alt="Analytics" />
                    <span>Analytics</span>
                </Link>

                <div className={styles.sectionHeader}>COMPLIANCE</div>
                <Link to="/safety-logs" className={`${styles.navItem} ${isActive('/safety-logs') ? styles.active : ''}`}>
                    <Icon src={SafetyIcon} alt="Safety Logs" />
                    <span>Safety Logs</span>
                </Link>
                <a href="#" className={styles.navItem}>
                    <Icon src={SettingsIcon} alt="Settings" />
                    <span>Settings</span>
                </a>
            </nav>

            <div className={styles.footer}>
                <div className={styles.userProfile}>
                    <UserButton showName />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
