// src/context/WpmContext.jsx
import React, { createContext, useState } from 'react';

// Create the Context
export const WpmContext = createContext();

// Create the Provider Component
export const WpmProvider = ({ children }) => {
    const [wpm, setWpm] = useState(0); // Initialize WPM state

    return (
        <WpmContext.Provider value={{ wpm, setWpm }}>
            {children}
        </WpmContext.Provider>
    );
};
