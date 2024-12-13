import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ThemeSelector from '../themeSelector/themeSelector';
import { faBars, faTimes, faRankingStar, faTable, faList, faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import './styles.css';

const SideBar = (props) => {
    const [isOpen, setIsOpen] = useState(false);  // For sidebar open/close state
    const [isThemeVisible, setIsThemeVisible] = useState(false);  // For theme selector visibility state

    // Toggle the sidebar
    const handleTrigger = () => setIsOpen(!isOpen);

    // Toggle the visibility of ThemeSelector
    const toggleThemeSelector = () => {
        setIsThemeVisible(!isThemeVisible);
    };
    const toggleRanking = props.toggleRanking;
    // Toggle the visibility of Ranking component

    return (
        <div className="sidebar-container">
            <div className={`sidebar ${isOpen ? ' sidebar--open' : ''}`}>
                <div className="trigger" onClick={handleTrigger}>
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
                </div>

                <div className="sidebar-position">
                    <FontAwesomeIcon icon={faUser} />
                    <span>Home</span>
                </div>
                <div className="sidebar-position">
                    <FontAwesomeIcon icon={faTable} />
                    <span>Menu item 2</span>
                </div>
                <div className="sidebar-position" onClick={toggleRanking}>
                    <FontAwesomeIcon icon={faRankingStar} />
                    <span>Menu item 3</span>
                </div>
                <div className="sidebar-position">
                    <FontAwesomeIcon icon={faList} />
                    <span>Position 4</span>
                </div>

                <div className="sidebar-position" onClick={toggleThemeSelector}>
                    <FontAwesomeIcon icon={faCog} />
                    <span>Select a theme</span>
                    {isThemeVisible && <ThemeSelector isVisible={isThemeVisible} />}
                </div>
            </div>
        </div>
    );
};

export default SideBar;
