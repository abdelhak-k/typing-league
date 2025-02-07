import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "./api";
import { fetchUserData } from "./scripts/fetchUser";
import Cookies from "js-cookie";
import refreshToken from "./scripts/refreshToken";

export const useAuthentication = () => {
    const [user, setUser] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const auth = async () => {
            const token = Cookies.get("access_token");
            const googleAccessToken = Cookies.get("google_access_token");

            if (token) {
                const decoded = jwtDecode(token);
                const tokenExpiration = decoded.exp;
                const now = Date.now() / 1000;
                /*if (tokenExpiration < now) {
                    console.log("Access token expired, refreshing...");
                    const newAccessToken = await refreshToken();

                    if (newAccessToken) {
                        setIsAuthorized(true);
                        handleFetchUserData();
                    } else {
                        setIsAuthorized(false);
                    }
                } else {*/
                    setIsAuthorized(true);
                    handleFetchUserData();
                
            } else if (googleAccessToken) {
                const isGoogleTokenValid = await validateGoogleToken(googleAccessToken);
                if (isGoogleTokenValid) {
                    handleFetchUserData();
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } else {
                setIsAuthorized(false);
            }
        };

        auth().catch(() => setIsAuthorized(false));
    }, []);

    const handleFetchUserData = async () => {
        const accessToken = Cookies.get("access_token");
        if (accessToken) {
            try {
                const userData = await fetchUserData();
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    };

    const validateGoogleToken = async (googleAccessToken) => {
        try {
            const res = await api.post(
                "/api/google/validate_token/",
                { access_token: googleAccessToken },
                { headers: { "Content-Type": "application/json" } }
            );

            return res.data.valid;
        } catch (error) {
            console.error("Error validating Google token", error);
            return false;
        }
    };

    const logout = async () => {
        const refreshToken = Cookies.get("refresh_token");

        if (refreshToken) {
            try {
                await api.post("/api/logout/", { refresh_token: refreshToken });
            } catch (error) {
                console.error("Error during logout:", error);
            }
        }

        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("google_access_token");
        setIsAuthorized(false);
        setUser(null);
    };

    return { user, isAuthorized, logout };
};
