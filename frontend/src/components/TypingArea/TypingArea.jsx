
import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './TypingArea.module.css'; 
import { ResetButton } from '../../utils/buttons';
import { Tooltip, Box, useForkRef } from "@mui/material";
import Stats from '../stats/stats';
import IconButton from '@mui/material/IconButton';
import createTest from '../../scripts/createTest';
import Fire from '../other/fire';
const TypingArea = ({user, defaultText}) => {

        /*
    let max_wpm_15 = user?.max_wpm_15 || null;
    let max_wpm_30 = user?.max_wpm_30 || null;
    */

    useEffect(() => {
        const detectDevTools = (event) => {
            if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
                event.preventDefault();
            }
        };
        document.addEventListener("keydown", detectDevTools);
        return () => document.removeEventListener("keydown", detectDevTools);
    }, []);
    
    const WORDS_COUNT = 20;
    const COUNT_DOWN_90 = 90;
    const COUNT_DOWN_60 = 60;
    const COUNT_DOWN_30 = 30;
    const COUNT_DOWN_15 = 15;
    const wpmRef = useRef(0);
    const DEFAULT_DIFFICULTY = "Easy";
    const HARD_DIFFICULTY = "Hard";

    const shuffleText = () => {
        const decodedText = atob(defaultText);
        let ws = decodedText.split(/\s+/);
        ws = ws.sort(() => Math.random() - 0.5); 
        
        return ws.slice(0, WORDS_COUNT).join(" "); 
    };
    
    const [text, setShuffledText] = useState(shuffleText()); // Initial shuffle

    const DEFUALT_COUNT_DOWN = COUNT_DOWN_15;

    const [words, setWords] = useState([]);

    const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
    const [numberAddOn, setNumberAddOn] = useState(false);
    const [symbolAddOn, setSymbolAddOn] = useState(false);
    const [countDownConstant, setCountDownConstant] = useState(DEFUALT_COUNT_DOWN);
    

    // useMemo for better optimization
    const [wordSpanRefs, setWordSpanRefs] = useState({});

    const [countDown, setCountDown] = useState(countDownConstant);
    const [status, setStatus] = useState('waiting');
    const [currInput, setCurrInput] = useState('');
    const [currWordIndex, setCurrWordIndex] = useState(0);
    const [currCharIndex, setCurrCharIndex] = useState(-1);
    const [currChar, setCurrChar] = useState('');
    const [wpm, setWpm] = useState(0);
    const [wordsCorrect, setWordsCorrect] = useState(new Set());
    const [wordsInCorrect, setWordsInCorrect] = useState(new Set());
    const [inputWordsHistory, setInputWordsHistory] = useState({});

    // each char has a unique identifier
    const keyString = `${currWordIndex}.${currCharIndex}`; 

    // Tracks correctness of each character
    const [history, setHistory] = useState({});

    // Ref to the hidden input field
    const textInputRef = useRef(null);

    // Ref to the countdown interval
    const intervalRef = useRef(null);

    /*
    const NewRecord = useRef(null);
    const [currentRecordType, setCurrentRecordType] = useState(null);
    */

    // Initialize words from the fetched text
    useEffect(() => {
        if (text) {
            const splitWords = text.split(" ").slice(0, WORDS_COUNT);
            setWords(splitWords);
        }
    }, [text]);
    
    // Scroll to the current word
    useEffect(() => {
        if (
            currWordIndex !== 0 && wordSpanRefs[currWordIndex] && wordSpanRefs[currWordIndex - 1] &&
            wordSpanRefs[currWordIndex].current.offsetLeft < wordSpanRefs[currWordIndex - 1].current.offsetLeft
        ) {
            wordSpanRefs[currWordIndex - 1].current.scrollIntoView({
                behavior: 'smooth',
            }); 
            const newWords = shuffleText().split(/\s+/);
            setWords((prevWords) => [...prevWords, ...newWords]);
        } 
    }, [currWordIndex]);
    
    useEffect(() => {
        const newRefs = {...wordSpanRefs};
        words.forEach((_, index) => {
            if (!newRefs[index]) {
                newRefs[index] = React.createRef();
            }
        });
        setWordSpanRefs(newRefs);
    }, [words]);

    // Focus the hidden input on mount
    useEffect(() => {
        if (textInputRef.current){
            textInputRef.current.focus();
        } 
    }, [status]);

    // Resets the game and marks it as finished
    const resetGame = () => {
        setStatus('waiting');
        setShuffledText(shuffleText()); 
        reset();
    };
    

    useEffect(() => {
        setCountDown(countDownConstant);
        clearInterval(intervalRef.current);  
    }, [countDownConstant]);

    // resets states to their initial values
    const reset = () => {
        const splitWords = text.split(" ").slice(0, WORDS_COUNT);
        setWords(splitWords);
        setCurrWordIndex(0); 
        setCurrCharIndex(-1);
        setCurrInput(''); 
        setHistory({}); 
        setWordsCorrect(new Set());
        setWordsInCorrect(new Set());
        setInputWordsHistory({}); 
        setWpm(0);
        setCountDown(countDownConstant);
        clearInterval(intervalRef.current);
    };
    
    // starts the typing test and initializes the countdown timer.
    const start = () => {
        if (status !== 'started') {
            setStatus('started');

            intervalRef.current = setInterval(() => {
                setCountDown((prev) => {
                    if (prev === 0) {
                        finishTest();
                    } else {
                        return prev - 1;
                    }
                });
            }, 1000); 
        }
    };

    /*
    useEffect(() => {
        if (status !== 'started' || !max_wpm_15 || !max_wpm_30){
            console.log(max_wpm_15);
            console.log(max_wpm_30);    
            return;
        }
    
        const currentMax = countDownConstant === COUNT_DOWN_15 ? max_wpm_15 :
                          countDownConstant === COUNT_DOWN_30 ? max_wpm_30 :
                          countDownConstant === COUNT_DOWN_60 ? 0 : 0;
    
        const isRecord = wpm > currentMax;
        setIsNewRecord(isRecord);
        setCurrentRecordType(countDownConstant);
    }, [wpm, countDownConstant, status, max_wpm_15, max_wpm_30]); // add effects when the user breaks a new record  */ 


    // finishes the test, calculates WPM, and notifies App.jsx
    const finishTest = async () => {
        setStatus('finished');
        if(user){
            await createTest(wpmRef.current ,countDownConstant);
        }
    };
    
    const isCurrprogress = () => {
        const targetWord = words[currWordIndex];
        const typedWord = currInput.trim();
        return targetWord.startsWith(typedWord);
    };


    // calculates WPM and returns it
    const calculateWpm = () => {
        // Calculate the total number of characters in correctly typed words + spaces
        let totalChars = Array.from(wordsCorrect).reduce((sum, wordIdx) => {
            sum += words[wordIdx].length;
            sum += 1;
            return sum;
        }, 0);


        if (isCurrprogress()) {
            totalChars += currInput.length;  // Add the length of the currently typed word
        } 

        // If there are correctly typed words, subtract the extra space after the last word
        // This ensures we don't count an unnecessary space at the end
        const numberOfCorrectWords = wordsCorrect.size;
        const adjustedTotalChars = numberOfCorrectWords > 0 ? totalChars - 1 : 0;

        const normalizedWpm = (adjustedTotalChars / 5) * (60 / countDownConstant);

        const calculatedWpm = Math.round(normalizedWpm);
        wpmRef.current = calculatedWpm;
        return (calculatedWpm > 0 && isFinite(calculatedWpm)) ? calculatedWpm : 0;
    };

    // handles key down events, managing typing logic and WPM calculation.
    const handleKeyDown = ({ keyCode, key }) => {
        if (status === 'finished') {
            return;
        }
        
        const calculatedWPM = calculateWpm();
        setWpm(calculatedWPM);

        if (key.length === 1 && status === 'waiting') {
            start();
        }

        if (keyCode === 32) { // Space bar
            const prevCorrectness = checkPrev();
            if (prevCorrectness === true || prevCorrectness === false) {
                setCurrInput('');
                setCurrWordIndex(prevIndex => prevIndex + 1);
                setCurrCharIndex(-1);
            }
            return;
        }
        if (keyCode === 8) { // Backspace
            setHistory(prevHistory => {
                const newHistory = { ...prevHistory };
                delete newHistory[keyString];
                return newHistory;
            });

            if (currCharIndex < 0) {
                if (wordsInCorrect.has(currWordIndex - 1)) {
                    const prevInputWord = inputWordsHistory[currWordIndex - 1] || '';
                    setCurrInput(prevInputWord + ' ');
                    setCurrCharIndex(prevInputWord.length - 1);
                    setCurrWordIndex(prevIndex => prevIndex - 1);
                }
                return;
            }

            setCurrCharIndex(prevIndex => prevIndex - 1);
            setCurrChar('');
            return;
        }

        if (key.length === 1) { // Typing a character
            setCurrCharIndex(prevIndex => prevIndex + 1);
            setCurrChar(key);
        }
    };

    
    // updates the current input and records the input history.
    const UpdateInput = (e) => {
        if (status!=='finished'){        
            setCurrInput(e.target.value);

            setInputWordsHistory(prevHistory => ({
                ...prevHistory,
                [currWordIndex]: e.target.value.trim()
            }));
        }
    };

    
    // checks if the typed word matches the target word and updates correctness states
    const checkPrev = () => {
        if (currWordIndex >= words.length) return null;

        const wordToCompare = words[currWordIndex];
        const currInputWithoutSpaces = currInput.trim();
        const isCorrect = wordToCompare === currInputWithoutSpaces;

        if (!currInputWithoutSpaces) {
            return null;
        }

        if (isCorrect) {
            setWordsCorrect(prev => new Set(prev).add(currWordIndex));
            setWordsInCorrect(prev => {
                const newSet = new Set(prev);
                newSet.delete(currWordIndex);
                return newSet;
            });
            setInputWordsHistory(prevHistory => ({
                ...prevHistory,
                [currWordIndex]: currInputWithoutSpaces
            }));
            return true;
        } else {
            setWordsInCorrect(prev => new Set(prev).add(currWordIndex));
            setWordsCorrect(prev => {
                const newSet = new Set(prev);
                newSet.delete(currWordIndex);
                return newSet;
            });
            setInputWordsHistory(prevHistory => ({
                ...prevHistory,
                [currWordIndex]: currInputWithoutSpaces
            }));
            return false;
        }
    };

    // determine the CSS class for a word based on its correctness and current typing status.
    const getWordClassName = (wordIdx) => {
        let className = styles.word;

        if (wordsInCorrect.has(wordIdx)) {
            className += ` ${styles.errorWord}`;
        }

        if (wordIdx === currWordIndex) {
            className += ` ${styles.currentWord}`;
        }

        return className;
    };

    // determine the CSS class for a character based on its correctness
    const getCharClassName = (wordIdx, charIdx, char) => {
        const key = `${wordIdx}.${charIdx}`;

        if (history[key] === true) {
            return styles.correctChar;
        }

        if (history[key] === false) {
            return styles.errorChar;
        }

        if (
            wordIdx === currWordIndex &&
            charIdx === currCharIndex &&
            currChar &&
            status !== 'finished'
        ) {
            // Determine correctness and update history
            const correctChar = char === currChar;
            setHistory(prevHistory => ({
                ...prevHistory,
                [key]: correctChar
            }));
            return correctChar ? styles.correctChar : styles.errorChar;
        } else if (
            wordIdx === currWordIndex &&
            currCharIndex >= (words[wordIdx]?.length || 0)
        ) {
            return styles.errorChar;
        }

        return '';
    };

    // extra characters that exceed the length of the target word.
    // display them as errors
    const getExtraCharsDisplay = (word, i) => {
        let input = inputWordsHistory[i];
        if (!input) {
            input = currInput.trim();
        }

        if (i > currWordIndex) {
            return null;
        }

        if (input.length <= word.length) {
            return null;
        } else {
            const extra = input.slice(word.length);
            return extra.split("").map((c, idx) => (
                <span key={`extra-${i}-${idx}`} className={styles.errorChar}>
                    {c}
                </span>
            ));
        }
    };

    return (
        <div className={styles.container}>
            {status !== 'finished' ? (
                <>  
                    <div>
                    <div className={`${styles.options} ${status === 'started' ? styles.hidden : ""}`}>
                        <IconButton onClick={() => setCountDownConstant(COUNT_DOWN_15)}>
                        <span className={countDownConstant === COUNT_DOWN_15 ? styles.activeButton : styles.inactiveButton}>
                            {COUNT_DOWN_15}</span>
                        </IconButton>
                        <IconButton onClick={() => setCountDownConstant(COUNT_DOWN_30)}>
                            <span className={countDownConstant === COUNT_DOWN_30 ? styles.activeButton : styles.inactiveButton}>
                                {COUNT_DOWN_30}
                            </span>
                        </IconButton>
                        <IconButton onClick={() => setCountDownConstant(COUNT_DOWN_60)}>
                            <span className={countDownConstant === COUNT_DOWN_60 ? styles.activeButton : styles.inactiveButton}>
                                {COUNT_DOWN_60}
                            </span>
                        </IconButton>
                        <IconButton onClick={() => setDifficulty(DEFAULT_DIFFICULTY)}>
                            <span className={difficulty === DEFAULT_DIFFICULTY ? styles.activeButton : styles.inactiveButton}>
                                {DEFAULT_DIFFICULTY}
                            </span>
                        </IconButton>    
                    </div>
                    {/*<div>
                        <Fire />
                    </div>*/}

                    </div>
                    <div className={styles['type-box']}>
                    <div className={styles.words}>
                            {words.length === 0 ? (
                                <span>No text available to type</span>
                            ) : (
                                words.map((word, i) => (
                                    <span
                                        key={i}
                                        ref={wordSpanRefs[i]}
                                        className={getWordClassName(i)}
                                    >
                                        {word.split('').map((char, idx) => (
                                            <span
                                                key={idx}
                                                className={getCharClassName(i, idx, char)}
                                            >
                                                {char}
                                            </span>
                                        ))}
                                        {getExtraCharsDisplay(word, i)}
                                    </span>
                                ))
                            )}
                        </div>
                        <input
                            ref={textInputRef}
                            autoComplete="off"
                            type="text"
                            id="textInput"
                            className={styles['hidden-input']}
                            value={currInput} 
                            onKeyDown={handleKeyDown}
                            onPaste={(e) => e.preventDefault()}
                            onChange={UpdateInput}
                            aria-label="Typing Input"
                            role="textbox"
                            onBlur={() => textInputRef.current.focus()}
                        />
                    </div>

                    <div className={styles.stats}>
                        <h3>{countDown}s</h3>
                        <h3>wpm: {wpm}</h3>
                        <Tooltip title="Restart" enterDelay={500} leaveDelay={200}>
                            <span><ResetButton onClick={resetGame} aria-label="Restart Test"/></span>
                        </Tooltip>
                    </div>

                </>
            ) : <Stats wpm={wpmRef.current} onRestart={resetGame} /> }
        </div>
    );

};

export default TypingArea;
