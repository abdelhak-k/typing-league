import React, { useEffect, useState } from "react";
import TypingArea from './components/TypingArea/TypingArea.jsx';
import Profile from "./components/profile/profile.jsx";
import SetUsername from "./components/profile/SetUsername.jsx";
import Ranking from './components/ranking/Ranking.jsx';
import SideBar from "./components/sidebar/sideBar.jsx";
import RedirectGoogleAuth from "./components/profile/GoogleCallBack.jsx";
import { HashRouter, Route, Routes } from "react-router-dom";
import styles from './App.module.css';
import Login from "./components/profile/login.jsx";
import Logout from "./scripts/logout.jsx";
import {useAuthentication} from './auth.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const defaultText = "fast hands move over keys focus keeps speed high practice makes better always keep typing never stop learning small steps big progress stay calm stay smooth fingers glide easy keep flow steady mind clear eyes forward touch type right way build skill push limits reach goal stay sharp avoid rush stay relaxed keep going never quit train daily stay light move quick find rhythm stay loose type strong press soft trust hands aim true flow natural focus deep breathe steady keep balance tap fast work smart gain control feel smooth never force stay cool";

const App = () => {

    const { isAuthorized, user, logout } = useAuthentication(); 
    // get the selected them
    const savedTheme = sessionStorage.getItem('selectedTheme');
    if (savedTheme) {
    document.querySelector('body').setAttribute('data-theme', savedTheme);
    }
    else{
        document.querySelector('body').setAttribute('data-theme', 'cyber');
    }
    const[currUser, setCurrUser] = useState(null);
    useEffect(() => {
        setCurrUser(user);
    }, [user]);
    
    return (
        <HashRouter> 
            <div>
                <SideBar isAuthorized={isAuthorized}/> 
                <div className={styles.container}>
                    {/*in case adding a header to the page*/}
                    <div>
                        <div className={styles.exhide}>header</div>
                    </div>
                    <Routes>
                        <Route path="/" element={<TypingArea defaultText={defaultText} user={currUser}/>} />
                        <Route path="/ranking" element={<Ranking />} />
                        <Route path="/profile" element={isAuthorized ? <Profile user={currUser} isAuthorized={isAuthorized}/> : <Login />} />
                        <Route path="/login/callback" element={<RedirectGoogleAuth setUser={setCurrUser}/>} /> 
                        <Route path="/set-username" element={<SetUsername user={currUser} />} /> 
                        <Route path="/login" element={<Login />} />
                        <Route path="/logout" element={<Logout logout={logout} />} />
                    </Routes>
                    <div className={styles.footer}>
                        <a href="https://github.com/abdelhak-k/typing-league" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faGithub} size="2x" /> GitHub Repository
                        </a>
                    </div>
                </div>
            </div>
        </HashRouter>
    );
};

export default App;
