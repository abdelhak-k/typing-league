import React, { useState, useEffect } from 'react';
import api from '../../api';
import styles from './SetUsername.module.css'; // Importing CSS module

const SetUsername = ({ user }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState(''); // For frontend validation errors
  const [disableSubmit, setDisableSubmit] = useState(true); // Disable submit initially

  // Function to validate username on the frontend
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    return usernameRegex.test(username);
  };

  // Live validation using useEffect
  useEffect(() => {
    if (!username) {
      setDisableSubmit(true);
    } else if (!validateUsername(username)) {
      setFormError('Username can only contain numbers, characters, "_" and "-"');
      setDisableSubmit(true);
    } else {
      setFormError('');
      setDisableSubmit(false);
    }
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset backend error state

    try {
      const response = await api.post('/api/set-username/', {
        user_id: user.id,
        username: username,
      });
      if (response.data.success) {
        window.location.href = '/'; // Redirect to home page
      } else {
        setError(response.data.error || 'An error occurred.'); // Display specific backend error
      }
    } catch (error) {
      // Handle errors from the backend
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('An error occurred.');
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.box}>
        <h2 className={styles.title}>Set Your Username</h2>
        <form onSubmit={handleSubmit} className={styles.usernameForm}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.usernameInput}
            required
          />
          {formError && <p className={styles.errorMessage}>{formError}</p>} {/* Display frontend validation error */}
          {error && <p className={styles.errorMessage}>{error}</p>} {/* Display backend error */}
          <button
            type="submit"
            className={`${styles.submitButton} ${disableSubmit ? styles.disabledButton : ''}`}
            disabled={disableSubmit}
            >
            Submit
          </button>

        </form>
      </div>
    </div>
  );
};

export default SetUsername;
