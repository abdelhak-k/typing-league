import React, { useState } from "react";
import TypingArea from './components/TypingArea/TypingArea.jsx';
import ThemeSelector from "./components/themeSelector/themeSelector.jsx";
import Ranking from './components/ranking/Ranking.jsx';
import styles from './App.module.css';
import SideBar from "./components/sidebar/sideBar.jsx"; // Import the Sidebar component

const defaultText = "type efficiently requires consistent practice and focus important to build muscle memory so your fingers can move swiftly across the keyboard. With time, your speed and accuracy will improve, allowing you to work faster and with less effort. A steady rhythm helps prevent fatigue and ensures a smoother typing experience. Make sure to avoid unnecessary distractions and maintain proper posture for maximum comfort";


const App = () => {
    const [isRankingVisible, setIsRankingVisible] = useState(false); 

    const toggleRanking = () => {
        setIsRankingVisible(!isRankingVisible);
    };
    
    return (
        <div>
            <SideBar toggleRanking={toggleRanking}/>
            <div className={styles.container}>
                <div>
                    <div>header</div>
                </div>
                {!isRankingVisible && <TypingArea text={defaultText}/>} {/*hide when the ranking page appears*/}
                {isRankingVisible && <Ranking />}
                {!isRankingVisible && (<div>
                    footer
                </div>)}
            </div>
        </div>
    );
};

export default App;
