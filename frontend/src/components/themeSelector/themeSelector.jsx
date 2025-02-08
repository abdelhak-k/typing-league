import React, { useState, useEffect } from 'react';
import styles from './themeSelector.module.css';
import getThemeNames from '../../scripts/getThemeNames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const ThemeSelector = ({ isVisible }) => {
  const [themes, setThemes] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('');
  const [hoveredTheme, setHoveredTheme] = useState('');

  // Fetch themes when component mounts
  useEffect(() => {
    getThemeNames().then(fetchedThemes => {
      setThemes(fetchedThemes);
    });

    const savedTheme = sessionStorage.getItem('selectedTheme');
    if (savedTheme) {
      document.querySelector('body').setAttribute('data-theme', savedTheme);
      setCurrentTheme(savedTheme);
    }
  }, []);

  const setTheme = (theme) => {
    document.querySelector('body').setAttribute('data-theme', theme);
    setCurrentTheme(theme);
    sessionStorage.setItem('selectedTheme', theme); // Store in session
  };

  const handleMouseEnter = (theme) => {
    setHoveredTheme(theme);
    setTheme(theme);
  };

  const handleMouseLeave = () => {
    setHoveredTheme(currentTheme);
    setTheme(currentTheme);
  };

  return (
    <div>
      {isVisible && (
        <div className={styles.modal}>
          <div className={styles.close}>
            <div>x</div>
          </div>
          <div className={styles.suggestions}>
            {themes.map((theme, index) => (
              <div
                key={index}
                className={styles.command}
                onClick={() => setTheme(theme)}  // Set theme on click
                onMouseEnter={() => handleMouseEnter(theme)}  // Change on hover
                onMouseLeave={handleMouseLeave}  // Revert back
                style={{
                  backgroundColor: hoveredTheme === theme ? '#f4f4f4' : 'transparent',
                }}
              >
                <div className={styles.icon}>
                  <FontAwesomeIcon icon={faCog} />
                </div>
                <div>{theme}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
