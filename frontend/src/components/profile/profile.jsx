import React, { useEffect, useState } from 'react';
import Login from './login.jsx';  
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './profile.module.css';
import { useAuthentication } from '../../auth';
import { fetchUserData } from '../../scripts/fetchUser.js';
import { useNavigate } from 'react-router-dom';

const Profile = ({isAuthorized}) => {
  const navigate = useNavigate();

    //const { isAuthorized, logout } = useAuthentication();
/*

                    <button onClick={logout} className={styles.logoutButton}>
                        Logout
                    </button>

*/
    const [user, setUser] = useState(null);
    const getUserData = async () => {
      const currUser = await fetchUserData();
      setUser(currUser);
    };

    const [profile, setProfile] = useState(null);
    const getProfile = async () => {
      const currProfile = await fetchProfile(user.id);
      setProfile(currProfile);
    };
    useEffect(() => {
      getUserData();
    }, user)
    return (
        <div className={styles.profileContainer}>
            {user ? (
        <div className={styles.cardsContainer}> 
        <div className={styles.profilecontainer}>
          {/* Profile Header */}
          <div className={styles.avatarAndName}>
            <div>
              <div className={styles.user}>
                <div className={styles.name}>{user.profile_username}</div>
                <div className={styles.userFlags}></div>
              </div>
              <div className={styles.badges}></div>
              <div className={styles.allBadges}></div>
              {new Date(user.joined_at).toLocaleString()}
              </div>
          </div>

        {/*
          <div className={styles.typingStats}>
            <div className={styles.completed}>
              <div className={styles.title}>Tests Completed</div>
              <div className={styles.value} >198</div>
            </div>
            
            <div className={styles.timeTyping}>
              <div className={styles.title}>Time Typing</div>
              <div className={styles.value}>02:30:20</div>
            </div>
          </div>*/}

          {/* Statistics Card Section */}


        </div>
          <div className={styles.cardContainer}>
          <div className={styles.statCard}>
            <h3>Max WPM - 15s</h3>
            <div className={styles.wpm}>{user.max_wpm_15}</div>
          </div>
          <div className={styles.statCard}>
            <h3>Max WPM - 30s</h3>
            <div className={styles.wpm}>{user.max_wpm_30}</div>
          </div>
        </div>
      
        <div className={styles.changeUsernameSection}>
                        <button 
                            className={styles.changeUsernameButton} 
                            onClick={() => navigate('/set-username')}
                        >
                            Change Username here
                        </button>
        </div>
        </div>
      ) : (
                <div>loading ..</div> // {/* here is should be loading instead of a login page */}
            )}
        </div>
    );
};

export default Profile;