
import React, { useState } from 'react';
import styles from './JoinOrganizationModal.module.css';

interface JoinOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoin: (orgId: string, password: string) => void;
}

const JoinOrganizationModal: React.FC<JoinOrganizationModalProps> = ({ isOpen, onClose, onJoin }) => {
    const [orgId, setOrgId] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onJoin(orgId, password);
        setOrgId('');
        setPassword('');
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>Join Organization</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="orgId">Organization ID</label>
                        <input
                            type="text"
                            id="orgId"
                            value={orgId}
                            onChange={(e) => setOrgId(e.target.value)}
                            placeholder="Enter Org ID"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Org Password"
                            required
                        />
                    </div>
                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.joinBtn}>Join</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JoinOrganizationModal;
