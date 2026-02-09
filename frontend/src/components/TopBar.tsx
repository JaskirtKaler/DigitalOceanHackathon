import React, { useState } from 'react';
import styles from './TopBar.module.css';
import NotificationIcon from '../assets/icons/notification-svgrepo-com.svg';
import { mockNotifications } from '../utils/mockData';

const TopBar: React.FC = () => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
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
                <div className={styles.orgDropdown}>
                    <div className={styles.orgIcon}>
                        {/* Placeholder for org icon or first letter */}
                        <div style={{ width: 24, height: 24, background: '#3B82F6', borderRadius: 4 }}></div>
                    </div>
                    <span className={styles.orgName}>SkyHigh Logistics</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.chevron}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
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
        </header>
    );
};

export default TopBar;
