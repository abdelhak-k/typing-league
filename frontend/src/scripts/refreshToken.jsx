import axios from 'axios';
import Cookies from 'js-cookie';

const refreshToken = async () => {
  try {
    const refreshToken = Cookies.get("refresh_token"); 
    if (!refreshToken) throw new Error("No refresh token");

    const response = await axios.post(
      "https://api.typingclub.tech/api/token/refresh/", 
      { refresh: refreshToken } 
    );

    const newAccessToken = response.data.access; 
    return newAccessToken;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error; 
  }
};

export default refreshToken;