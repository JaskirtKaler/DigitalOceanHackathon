import React, { useState } from 'react';
import styles from './TopBar.module.css';
import NotificationIcon from '../assets/icons/notification-svgrepo-com.svg';
import { mockNotifications } from '../utils/mockData';
import JoinOrganizationModal from './JoinOrganizationModal';

const defaultOrgList = [
    { id: 'org-001', name: 'SkyHigh Logistics' },
    { id: 'org-002', name: 'Pacific Drone Fleet' }
];

const TopBar: React.FC = () => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    // Organization State
    const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [orgList, setOrgList] = useState(defaultOrgList);
    
    const [currentOrg, setCurrentOrg] = useState(() => {
        const savedId = localStorage.getItem('currentOrgId');
        if (savedId) {
            const found = defaultOrgList.find(o => o.id === savedId);
            if (found) return found;
        }
        return defaultOrgList[0];
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const handleJoinOrg = (orgId: string, password: string) => {
        // Mock DB Call
        console.log(`Joining Org: ${orgId} with password: ${password}`);
        const newOrg = { id: orgId, name: `Organization ${orgId}` };
        setOrgList([...orgList, newOrg]);
        setCurrentOrg(newOrg);
        localStorage.setItem('currentOrgId', newOrg.id);
        window.dispatchEvent(new Event('orgChanged'));
        setIsJoinModalOpen(false);
        setIsOrgDropdownOpen(false);
    };

    const handleSwitchOrg = (org: { id: string, name: string }) => {
        setCurrentOrg(org);
        localStorage.setItem('currentOrgId', org.id);
        window.dispatchEvent(new Event('orgChanged'));
        setIsOrgDropdownOpen(false);
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'warning': return '⚠️';
            case 'success': return '✅';
            default: return 'ℹ️';
        }
    };

    return (
        <header className={styles.topbar}>
            <div className={styles.leftSection}>
                <div className={styles.orgWrapper}>
                    <div className={styles.orgDropdown} onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}>
                        <div className={styles.orgIcon}>
                            <div style={{ width: 24, height: 24, background: '#3B82F6', borderRadius: 4 }}></div>
                        </div>
                        <span className={styles.orgName}>{currentOrg.name}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${styles.chevron} ${isOrgDropdownOpen ? styles.rotate : ''}`}>
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>

                    {isOrgDropdownOpen && (
                        <div className={styles.orgMenu}>
                            <div className={styles.orgLabel}>Switch Organization</div>
                            {orgList.map(org => (
                                <div
                                    key={org.id}
                                    className={`${styles.orgItem} ${currentOrg.id === org.id ? styles.activeOrg : ''}`}
                                    onClick={() => handleSwitchOrg(org)}
                                >
                                    {org.name}
                                    {currentOrg.id === org.id && <span>✓</span>}
                                </div>
                            ))}
                            <div className={styles.orgDivider}></div>
                            <button className={styles.joinOrgBtn} onClick={() => setIsJoinModalOpen(true)}>
                                + Join Organization
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.divider}></div>
                <h1 className={styles.pageTitle}>Command Center</h1>
            </div>

            <div className={styles.rightSection}>
                <div className={styles.searchContainer}>
                    <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" placeholder="Search Drone ID..." className={styles.searchInput} />
                </div>
                <div className={styles.notificationWrapper}>
                    <button className={styles.notificationBtn} onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
                        <img src={NotificationIcon} alt="Notifications" />
                        {unreadCount > 0 && <span className={styles.badge}></span>}
                    </button>

                    {isNotificationsOpen && (
                        <div className={styles.notificationDropdown}>
                            <div className={styles.notificationHeader}>
                                <span className={styles.notificationTitle}>Notifications</span>
                                {unreadCount > 0 && (
                                    <button className={styles.markReadBtn} onClick={handleMarkAllRead}>
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className={styles.notificationList}>
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div key={notification.id} className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}>
                                            <div className={styles.notificationIcon}>{getIconForType(notification.type)}</div>
                                            <div className={styles.notificationContent}>
                                                <div className={styles.notificationTop}>
                                                    <span className={styles.notificationItemTitle}>{notification.title}</span>
                                                    <span className={styles.notificationTime}>{notification.time}</span>
                                                </div>
                                                <p className={styles.notificationMessage}>{notification.message}</p>
                                            </div>
                                            {!notification.read && <div className={styles.unreadDot}></div>}
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.emptyState}>
                                        <span className={styles.emptyText}>No notifications at all</span>
                                    </div>
                                )}
                            </div>
                            <div className={styles.notificationFooter}>
                                <button className={styles.viewAllBtn}>View All Notifications</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <JoinOrganizationModal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                onJoin={handleJoinOrg}
            />
        </header>
    );
};

export default TopBar;
