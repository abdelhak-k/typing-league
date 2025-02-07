import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from '../../scripts/fetchUser.js';
import Cookies from "js-cookie";

const RedirectGoogleAuth = ({ setUser }) => {
    const navigate = useNavigate();

    const handleAccess_token= () => {
        return Cookies.get("access_token");
    }
    useEffect(() => {
        const handleFetchUserData = async () => {
            const accessToken = handleAccess_token();
            const refreshToken = Cookies.get("refresh_token");
            console.log(`accessToken: ${accessToken}`);
            console.log(`refreshToken: ${refreshToken}`);

            const error = new URLSearchParams(window.location.search).get('error');

            if (error) {
                console.error('Authentication Error:', error);
                navigate('/login');
                return;
            }

            if (accessToken && refreshToken) {
                try {
                    const userData = await fetchUserData(accessToken);
                    setUser(userData);
                    navigate('/');
                } catch (err) {
                    console.error('Error fetching user data:', err);
                    navigate('/login');
                }
            } else {
                console.log('No tokens found in cookies');
                navigate('/login');
            }
        };

        handleFetchUserData();
    }, [navigate, setUser]);

    return <div>Logging In...</div>;
};

export default RedirectGoogleAuth;
