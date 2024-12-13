import React from "react";
import IconButton from '@mui/material/IconButton';
import styles from './IconButton.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CustomIconButton = ({ icon, ...props }) => {
  return (
    <IconButton className={styles.iconButton} {...props}>
      <FontAwesomeIcon icon={icon} />
    </IconButton>
  );
};

export default CustomIconButton;
