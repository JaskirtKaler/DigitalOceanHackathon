import React, { useState } from 'react';
import AeroGradientLogo from '../components/AeroGradientLogo';
import styles from './Login.module.css';

const Login: React.FC = () => {
    const [orgId, setOrgId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', { orgId, email, password });
    };

    return (
        <div className={styles.container}>
            <div className={styles.logoWrapper}>
                <AeroGradientLogo />
                <span style={{
                    marginLeft: '8px',
                    fontWeight: 700,
                    fontSize: '20px',
                    color: '#111827',
                    fontFamily: 'Instrument Sans, sans-serif' // Fallback or if imported
                }}>
                    {/* Logo component already has text, but checking alignment */}
                </span>
            </div>

            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Sign in to your account</h1>
                    <p className={styles.subtitle}>Welcome back to your drone fleet dashboard</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="orgId">Organization ID</label>
                        <input
                            id="orgId"
                            type="text"
                            className={styles.input}
                            placeholder="e.g. aero-corps-01"
                            value={orgId}
                            onChange={(e) => setOrgId(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="email">Work Email</label>
                        <input
                            id="email"
                            type="email"
                            className={styles.input}
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="password">
                            Password
                            <a href="#" className={styles.forgotPassword}>Forgot password?</a>
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.signInButton}>
                        Sign in
                    </button>
                </form>

                {/* SSO Button commented out for now 
                <div className={styles.divider}>Or continue with</div>

                <button type="button" className={styles.ssoButton}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Single Sign-On (SSO)
                </button> 
                */}
            </div>

            <div className={styles.footer}>
                <div>© 2024 AeroGradient Inc. All rights reserved.</div>
                <div className={styles.footerLinks}>
                    <a href="#" className={styles.footerLink}>Privacy Policy</a>
                    <span>·</span>
                    <a href="#" className={styles.footerLink}>Terms of Service</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
