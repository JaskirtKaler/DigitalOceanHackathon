import React from 'react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import AeroGradientLogo from '../components/AeroGradientLogo';
import styles from './Login.module.css';

const Login: React.FC = () => {

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

                <div className={styles.form}>
                    <SignInButton mode="modal">
                        <button className={styles.signInButton}>
                            Sign In with Clerk
                        </button>
                    </SignInButton>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <span style={{ color: '#6B7280', marginRight: '0.5rem' }}>Don't have an account?</span>
                        <SignUpButton mode="modal">
                            <button style={{ color: '#3B82F6', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                                Sign up
                            </button>
                        </SignUpButton>
                    </div>
                </div>

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
