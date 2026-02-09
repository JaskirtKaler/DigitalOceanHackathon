import React from 'react';
import styles from './FlightCrew.module.css';
import { flightCrew } from '../utils/mockData';

const FlightCrew: React.FC = () => {
    const onlineCount = flightCrew.filter(m => m.status === 'online').length;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Flight Crew</h3>
                <span className={styles.onlineBadge}>{onlineCount} Online</span>
            </div>

            <div className={styles.crewList}>
                {flightCrew.map(member => (
                    <div key={member.id} className={styles.crewMember}>
                        <div className={styles.memberInfo}>
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={`https://ui-avatars.com/api/?name=${member.name.replace(' ', '+')}&background=random`}
                                    alt={member.name}
                                    className={styles.avatar}
                                />
                                <div className={`${styles.statusDot} ${styles[member.status]}`}></div>
                            </div>
                            <div className={styles.nameRole}>
                                <span className={styles.name}>{member.name}</span>
                                <span className={styles.role}>{member.role}</span>
                            </div>
                        </div>
                        <button className={styles.actionBtn}>
                            <svg className={styles.messageIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            <button className={styles.inviteBtn}>Quick Invite</button>
        </div>
    );
};

export default FlightCrew;
