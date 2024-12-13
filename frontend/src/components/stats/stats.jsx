// Stats.jsx

import React from 'react';
import PropTypes from 'prop-types';
import styles from './stats.module.css'; 
import { Tooltip } from "@mui/material";
import { ResetButton } from '../../utils/buttons';

const Stats = ({ wpm, onRestart }) => {
    console.log(wpm);
    return (
        <div className={styles.statsContainer}>
            <h2>Test Completed!</h2>
            
            <p>Your Words Per Minute (WPM): <strong>{wpm}</strong></p>
            <Tooltip title="Restart" enterDelay={500} leaveDelay={200}>
                <ResetButton onClick={onRestart} aria-label="Restart Test" />
            </Tooltip>
        </div>
    );
};

Stats.propTypes = {
    wpm: PropTypes.number.isRequired,
    onRestart: PropTypes.func.isRequired,
};

export default Stats;
