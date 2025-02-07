// src/components/profile/Login.jsx

import React from 'react';
import styles from './login.module.css';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Login = () => {

    const handleOAuthLogin = (provider) => {
        const oauthEndpoints = {
            google: `${import.meta.env.VITE_API_URL}/accounts/google/login/`,
        };    

        window.location.href = oauthEndpoints[provider];
    };

    return (
        <div className={styles.logincontainter}>
            <div className={styles.box}>
                <h2>Welcome Back!</h2>
                <span>Sign in to your account to continue</span>
                <div className={styles.loginMethods}>
                    <button className={styles.siginbutton} onClick={() => handleOAuthLogin('google')}>
                        <FontAwesomeIcon className={styles.signicon} icon={faGoogle} />
                        Sign in with Google
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Login;
