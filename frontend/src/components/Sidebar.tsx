import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AeroGradientLogo from './AeroGradientLogo';
import styles from './Sidebar.module.css';

// Import SVG icons as React components or image sources
import DashboardIcon from '../assets/icons/dashboard-svgrepo-com.svg';
import FleetIcon from '../assets/icons/radar-2-svgrepo-com.svg'; // Using radar for fleet overview
import MissionsIcon from '../assets/icons/location-svgrepo-com.svg'; // Using location for active missions
import AnalyticsIcon from '../assets/icons/graph-asc-svgrepo-com.svg';
import SafetyIcon from '../assets/icons/alert-triangle-svgrepo-com.svg';
import SettingsIcon from '../assets/icons/setting-svgrepo-com.svg';
import LogOutIcon from '../assets/icons/log-out-svgrepo-com.svg';

// Helper to render SVG or img tag
const Icon = ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} className={styles.icon} />
);

const Sidebar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = () => {
        // In a real app, clear auth tokens here
        navigate('/');
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <AeroGradientLogo showText={true} />
            </div>

            <nav className={styles.nav}>
                <div className={styles.sectionHeader}>OPERATIONS</div>
                <a href="#" className={`${styles.navItem} ${styles.active}`}>
                    <Icon src={DashboardIcon} alt="Dashboard" />
                    <span>Dashboard</span>
                </a>
                <a href="#" className={styles.navItem}>
                    <Icon src={FleetIcon} alt="Fleet Overview" />
                    <span>Fleet Overview</span>
                </a>
                <a href="#" className={styles.navItem}>
                    <Icon src={MissionsIcon} alt="Active Missions" />
                    <span>Active Missions</span>
                </a>
                <a href="#" className={styles.navItem}>
                    <Icon src={AnalyticsIcon} alt="Analytics" />
                    <span>Analytics</span>
                </a>

                <div className={styles.sectionHeader}>COMPLIANCE</div>
                {/* Note: I might need to adjust the SVGs used here if exact matches aren't found in the provided list */}
                <a href="#" className={styles.navItem}>
                    <Icon src={SafetyIcon} alt="Safety Logs" />
                    <span>Safety Logs</span>
                </a>
                <a href="#" className={styles.navItem}>
                    <Icon src={SettingsIcon} alt="Settings" />
                    <span>Settings</span>
                </a>
            </nav>

            <div className={styles.footer}>
                {isMenuOpen && (
                    <div className={styles.userMenu}>
                        <button className={styles.menuItem}>
                            <Icon src={SettingsIcon} alt="Profile Settings" />
                            <span>Profile Settings</span>
                        </button>
                        <button className={styles.menuItem}>
                            <Icon src={AnalyticsIcon} alt="Organization Details" />
                            <span>Organization Details</span>
                        </button>
                        <div className={styles.menuDivider}></div>
                        <button className={`${styles.menuItem} ${styles.signOut}`} onClick={handleSignOut}>
                            <Icon src={LogOutIcon} alt="Sign Out" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                )}
                <div className={styles.userProfile} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <div className={styles.avatar}>
                        <img src="https://ui-avatars.com/api/?name=Alex+Chen&background=random" alt="User" />
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>Alex Chen</div>
                        <div className={styles.userRole}>Flight Director</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
