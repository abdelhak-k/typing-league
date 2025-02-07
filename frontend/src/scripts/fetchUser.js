import api from '../api';

export const fetchUserData = async () => {
    try {
        const response = await api.get('/api/auth/user/');
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        Cookies.remove("access_token", { path: "/", domain: ".typingclub.tech" });
        Cookies.remove("refresh_token", { path: "/", domain: ".typingclub.tech" });        
        redirect("/login");
        throw error;
    }
};
