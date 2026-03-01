import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './FlightCrew.module.css';
import { flightCrew } from '../utils/mockData';
import type { CrewMember } from '../utils/mockData';

const FlightCrew: React.FC = () => {
    const [crew, setCrew] = useState<CrewMember[]>(flightCrew);
    const onlineCount = crew.filter(m => m.status === 'online').length;

    // Invite modal state
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteName, setInviteName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteAdmin, setInviteAdmin] = useState(false);
    const [invitePilot, setInvitePilot] = useState(true);

    const openInvite = () => {
        setInviteName('');
        setInviteEmail('');
        setInviteAdmin(false);
        setInvitePilot(true);
        setInviteOpen(true);
    };

    const cancelInvite = () => setInviteOpen(false);

    const submitInvite = () => {
        if (!inviteName.trim() || !inviteEmail.trim()) return;
        const newMember: CrewMember = {
            id: `crew-${Date.now()}`,
            name: inviteName.trim(),
            role: 'Pending Invite',
            status: 'offline'
        };
        setCrew(prev => [...prev, newMember]);
        setInviteOpen(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Flight Crew</h3>
                <span className={styles.onlineBadge}>{onlineCount} Online</span>
            </div>

            <div className={styles.crewList}>
                {crew.map(member => (
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

            <button className={styles.inviteBtn} onClick={openInvite}>Quick Invite</button>

            {/* Invite Modal — portalled to body so it sits above everything */}
            {inviteOpen && ReactDOM.createPortal(
                <div className={styles.modalOverlay} onClick={cancelInvite}>
                    <div className={styles.inviteModalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.inviteModalHeader}>
                            <h3 className={styles.modalTitle}>Invite Team Member</h3>
                            <button className={styles.closeBtn} onClick={cancelInvite}>×</button>
                        </div>
                        <p className={styles.inviteSubtext}>Send an invitation to join the organization</p>

                        <div className={styles.inviteForm}>
                            <div className={styles.inviteField}>
                                <label className={styles.fieldLabel}>Full Name</label>
                                <input
                                    type="text"
                                    className={styles.inviteInput}
                                    placeholder="e.g. Jane Smith"
                                    value={inviteName}
                                    onChange={e => setInviteName(e.target.value)}
                                />
                            </div>

                            <div className={styles.inviteField}>
                                <label className={styles.fieldLabel}>Email Address</label>
                                <input
                                    type="email"
                                    className={styles.inviteInput}
                                    placeholder="jane@skyhigh.com"
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                />
                            </div>

                            <div className={styles.inviteToggles}>
                                <div className={styles.inviteToggleRow}>
                                    <div className={styles.inviteToggleInfo}>
                                        <span className={styles.inviteToggleLabel}>Admin Access</span>
                                        <span className={styles.inviteToggleDesc}>Can manage members, toggle permissions, and billing</span>
                                    </div>
                                    <label className={styles.toggleSwitch}>
                                        <input
                                            type="checkbox"
                                            checked={inviteAdmin}
                                            onChange={() => setInviteAdmin(v => !v)}
                                        />
                                        <span className={styles.toggleSlider} />
                                    </label>
                                </div>

                                <div className={styles.inviteToggleRow}>
                                    <div className={styles.inviteToggleInfo}>
                                        <span className={styles.inviteToggleLabel}>Pilot Privileges</span>
                                        <span className={styles.inviteToggleDesc}>Can operate drones and manage missions</span>
                                    </div>
                                    <label className={styles.toggleSwitch}>
                                        <input
                                            type="checkbox"
                                            checked={invitePilot}
                                            onChange={() => setInvitePilot(v => !v)}
                                        />
                                        <span className={styles.toggleSlider} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={cancelInvite}>Cancel</button>
                            <button
                                className={styles.modalConfirmBtn}
                                onClick={submitInvite}
                                disabled={!inviteName.trim() || !inviteEmail.trim()}
                            >
                                Send Invite
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default FlightCrew;

