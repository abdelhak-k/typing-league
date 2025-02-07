import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ThemeSelector from '../themeSelector/themeSelector';
import { faBars, faTimes, faRankingStar, faUser, faCog, faRightFromBracket, faKeyboard,faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom"; // Use Link for navigation
import './styles.css';

const SideBar = ({isAuthorized}) => {
    const [isOpen, setIsOpen] = useState(false);  
    const [isThemeVisible, setIsThemeVisible] = useState(false);  

    // Toggle the sidebar
    const handleTrigger = () => setIsOpen(!isOpen);

    // Toggle the visibility of ThemeSelector
    const toggleThemeSelector = () => {
        setIsThemeVisible(!isThemeVisible);
    };

    return (
        <div className="sidebar-container">
            <div className={`sidebar ${isOpen ? ' sidebar--open' : ''}`}>
                <div className="trigger" onClick={handleTrigger}>
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
                </div>

                <Link to="/">
                <div className="sidebar-position">
                    <FontAwesomeIcon icon={faKeyboard} />
                    <span>Home</span>
                </div>
                </Link> 
                {isAuthorized ? 
                (<Link to="/profile">
                <div className="sidebar-position">
                        <FontAwesomeIcon icon={faUser} />
                        <span>Profile</span>
                </div>
                </Link>)
                :(<Link to="/login">
                <div className="sidebar-position">
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        <span>Login</span>
                </div>
                </Link>
                )}

                <Link to="/ranking">
                <div className="sidebar-position">
                        <FontAwesomeIcon icon={faRankingStar} />
                        <span>Leaderboard</span>
                </div>
                </Link>

                {/* Theme Selector */}
                <div className="sidebar-position" onClick={toggleThemeSelector}>
                    <FontAwesomeIcon icon={faCog} />
                    <span>Select a theme</span>
                    {isThemeVisible && <ThemeSelector isVisible={isThemeVisible} />}
                </div>

                {isAuthorized && 
                <Link to="/logout">
                    <div className="sidebar-position">
                        <FontAwesomeIcon icon={faDoorOpen} />
                    <span>logout</span>
                </div>
                </Link>
                }

            </div>
        </div>
    );
};

export default SideBar;
