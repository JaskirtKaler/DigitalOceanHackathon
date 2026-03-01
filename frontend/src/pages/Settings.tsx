
import React, { useState, useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import styles from './Settings.module.css';
import { teamMembersData, organizationSettings } from '../utils/mockData';
import type { TeamMember } from '../utils/mockData';

const MEMBERS_PER_PAGE = 4;

const Settings: React.FC = () => {
    const { user } = useUser();

    // Organization branding state
    const [orgName, setOrgName] = useState(organizationSettings.name);
    const [displayId, setDisplayId] = useState(organizationSettings.displayId);

    // Build members list with logged-in Clerk user as the first entry
    const initialMembers = useMemo<TeamMember[]>(() => {
        const clerkMember: TeamMember = {
            id: 'tm-clerk',
            name: user?.fullName || 'You',
            email: user?.primaryEmailAddress?.emailAddress || '',
            avatarColor: '#E8B86D',
            avatarUrl: user?.imageUrl,
            status: 'Active',
            isAdmin: true,
            isPilot: true
        };
        // Replace the first mock member with the Clerk user
        return [clerkMember, ...teamMembersData.slice(1)];
    }, [user]);

    const [members, setMembers] = useState<TeamMember[]>(initialMembers);
    const [currentPage, setCurrentPage] = useState(1);

    // Admin toggle confirmation modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingToggle, setPendingToggle] = useState<{ memberId: string; memberName: string; newValue: boolean } | null>(null);

    // Invite member modal state
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteName, setInviteName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteAdmin, setInviteAdmin] = useState(false);
    const [invitePilot, setInvitePilot] = useState(true);

    // Action menu state
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Remove user confirmation modal state
    const [removeModalOpen, setRemoveModalOpen] = useState(false);
    const [pendingRemove, setPendingRemove] = useState<{ memberId: string; memberName: string } | null>(null);

    const totalPages = Math.ceil(members.length / MEMBERS_PER_PAGE);
    const startIdx = (currentPage - 1) * MEMBERS_PER_PAGE;
    const visibleMembers = members.slice(startIdx, startIdx + MEMBERS_PER_PAGE);

    const handleAdminToggleClick = (memberId: string, memberName: string, currentValue: boolean) => {
        setPendingToggle({ memberId, memberName, newValue: !currentValue });
        setModalOpen(true);
    };

    const confirmAdminToggle = () => {
        if (pendingToggle) {
            setMembers(prev =>
                prev.map(m =>
                    m.id === pendingToggle.memberId ? { ...m, isAdmin: pendingToggle.newValue } : m
                )
            );
        }
        setModalOpen(false);
        setPendingToggle(null);
    };

    const cancelAdminToggle = () => {
        setModalOpen(false);
        setPendingToggle(null);
    };

    const handlePilotToggle = (memberId: string) => {
        setMembers(prev =>
            prev.map(m =>
                m.id === memberId ? { ...m, isPilot: !m.isPilot } : m
            )
        );
    };

    const openInviteModal = () => {
        setInviteName('');
        setInviteEmail('');
        setInviteAdmin(false);
        setInvitePilot(true);
        setInviteOpen(true);
    };

    const cancelInvite = () => {
        setInviteOpen(false);
    };

    const submitInvite = () => {
        if (!inviteName.trim() || !inviteEmail.trim()) return;
        const newMember: TeamMember = {
            id: `tm-${Date.now()}`,
            name: inviteName.trim(),
            email: inviteEmail.trim(),
            avatarColor: `hsl(${Math.floor(Math.random() * 360)}, 55%, 65%)`,
            status: 'Pending',
            isAdmin: inviteAdmin,
            isPilot: invitePilot
        };
        setMembers(prev => [...prev, newMember]);
        setInviteOpen(false);
    };

    const handleRemoveClick = (memberId: string, memberName: string) => {
        setOpenMenuId(null);
        setPendingRemove({ memberId, memberName });
        setRemoveModalOpen(true);
    };

    const confirmRemove = () => {
        if (pendingRemove) {
            setMembers(prev => prev.filter(m => m.id !== pendingRemove.memberId));
        }
        setRemoveModalOpen(false);
        setPendingRemove(null);
    };

    const cancelRemove = () => {
        setRemoveModalOpen(false);
        setPendingRemove(null);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };

    const orgInitials = orgName
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
                <TopBar />

                <div className={styles.content}>
                    {/* Page Header */}
                    <div className={styles.pageHeader}>
                        <h2>Settings</h2>
                        <div className={styles.breadcrumbSep} />
                        <span className={styles.breadcrumbLabel}>Organization</span>
                    </div>

                    {/* Organization Branding Card */}
                    <div className={styles.card}>
                        <div className={styles.brandingHeader}>
                            <h3 className={styles.brandingTitle}>Organization Branding</h3>
                            <span className={styles.brandingNote}>Visible on reports &amp; pilot apps</span>
                        </div>

                        <div className={styles.brandingBody}>
                            <div className={styles.avatarSection}>
                                <div className={styles.avatarCircle}>{orgInitials}</div>
                            </div>

                            <div className={styles.formFields}>
                                <div>
                                    <label className={styles.fieldLabel}>Organization Name</label>
                                    <input
                                        type="text"
                                        className={styles.fieldInput}
                                        value={orgName}
                                        onChange={e => setOrgName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className={styles.fieldLabel}>Display ID</label>
                                    <div className={styles.displayIdRow}>
                                        <span className={styles.displayIdPrefix}>aerogradient.com/</span>
                                        <input
                                            type="text"
                                            className={styles.displayIdInput}
                                            value={displayId}
                                            onChange={e => setDisplayId(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardActions}>
                            <button
                                className={styles.discardBtn}
                                onClick={() => {
                                    setOrgName(organizationSettings.name);
                                    setDisplayId(organizationSettings.displayId);
                                }}
                            >
                                Discard
                            </button>
                            <button className={styles.saveBtn}>Save Changes</button>
                        </div>
                    </div>

                    {/* Team Members Card */}
                    <div className={styles.card}>
                        <div className={styles.teamHeader}>
                            <div className={styles.teamHeaderLeft}>
                                <h3>Team Members</h3>
                                <p>Manage access roles and permissions</p>
                            </div>
                            <button className={styles.inviteBtn} onClick={openInviteModal}>
                                <span className={styles.inviteBtnIcon}>+</span>
                                Invite Member
                            </button>
                        </div>

                        <table className={styles.membersTable}>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Status</th>
                                    <th>Admin</th>
                                    <th>Pilot</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleMembers.map(member => (
                                    <tr key={member.id}>
                                        <td>
                                            <div className={styles.userCell}>
                                                {member.avatarUrl ? (
                                                    <img
                                                        className={styles.userAvatarImg}
                                                        src={member.avatarUrl}
                                                        alt={member.name}
                                                    />
                                                ) : (
                                                    <div
                                                        className={styles.userAvatar}
                                                        style={{ backgroundColor: member.avatarColor }}
                                                    >
                                                        {getInitials(member.name)}
                                                    </div>
                                                )}
                                                <div className={styles.userInfo}>
                                                    <span className={styles.userName}>{member.name}</span>
                                                    <span className={styles.userEmail}>{member.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={`${styles.statusBadge} ${member.status === 'Active'
                                                    ? styles.statusActive
                                                    : member.status === 'Pending'
                                                        ? styles.statusPending
                                                        : styles.statusInactive
                                                    }`}
                                            >
                                                {member.status}
                                            </span>
                                        </td>
                                        <td>
                                            <label className={styles.toggleSwitch}>
                                                <input
                                                    type="checkbox"
                                                    checked={member.isAdmin}
                                                    onChange={() => handleAdminToggleClick(member.id, member.name, member.isAdmin)}
                                                />
                                                <span className={styles.toggleSlider} />
                                            </label>
                                        </td>
                                        <td>
                                            <label className={styles.toggleSwitch}>
                                                <input
                                                    type="checkbox"
                                                    checked={member.isPilot}
                                                    onChange={() => handlePilotToggle(member.id)}
                                                />
                                                <span className={styles.toggleSlider} />
                                            </label>
                                        </td>
                                        <td className={styles.actionCol}>
                                            <div className={styles.actionWrapper}>
                                                <button
                                                    className={styles.actionBtn}
                                                    onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                                                >
                                                    ⋮
                                                </button>
                                                {openMenuId === member.id && (
                                                    <div className={styles.actionDropdown}>
                                                        <button
                                                            className={styles.actionDropdownItem}
                                                            onClick={() => handleRemoveClick(member.id, member.name)}
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                            </svg>
                                                            Remove User
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className={styles.pagination}>
                            <span className={styles.paginationInfo}>
                                Showing {visibleMembers.length} of {members.length} members
                            </span>
                            <div className={styles.paginationControls}>
                                <button
                                    className={styles.pageBtn}
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                >
                                    ‹
                                </button>
                                <button
                                    className={styles.pageBtn}
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Admin Toggle Confirmation Modal */}
            {modalOpen && pendingToggle && (
                <div className={styles.modalOverlay} onClick={cancelAdminToggle}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <h3 className={styles.modalTitle}>Change Admin Access</h3>
                        <p className={styles.modalBody}>
                            Are you sure you want to <strong>{pendingToggle.newValue ? 'grant' : 'revoke'}</strong> admin
                            privileges for <strong>{pendingToggle.memberName}</strong>?
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={cancelAdminToggle}>Cancel</button>
                            <button className={styles.modalConfirmBtn} onClick={confirmAdminToggle}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invite Member Modal */}
            {inviteOpen && (
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
                </div>
            )}

            {/* Remove User Confirmation Modal */}
            {removeModalOpen && pendingRemove && (
                <div className={styles.modalOverlay} onClick={cancelRemove}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalIconDanger}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        </div>
                        <h3 className={styles.modalTitle}>Remove Team Member</h3>
                        <p className={styles.modalBody}>
                            Are you sure you want to remove <strong>{pendingRemove.memberName}</strong> from
                            this organization? They will lose all access immediately.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={cancelRemove}>Cancel</button>
                            <button className={styles.modalDangerBtn} onClick={confirmRemove}>Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
