
import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './TypingArea.module.css'; 
import { ResetButton } from '../../utils/buttons';
import { Tooltip, Box } from "@mui/material";
import Stats from '../stats/stats';

const TypingArea = (props) => {
    const text = props.text;

    const WORDS_COUNT = 300;
    const COUNT_DOWN_90 = 90;
    const COUNT_DOWN_60 = 60;
    const COUNT_DOWN_30 = 30;
    const COUNT_DOWN_15 = 15;

    const DEFAULT_DIFFICULTY = "Easy";
    const HARD_DIFFICULTY = "Hard";

    const COUNT_DOWN = 5; 

    const [words, setWords] = useState([]);

    const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
    const [numberAddOn, setNumberAddOn] = useState(false);
    const [symbolAddOn, setSymbolAddOn] = useState(false);
    const [countDownConstant, setCountDownConstant] = useState(COUNT_DOWN_60);
    

    // useMemo for better optimization
    const wordSpanRefs = useMemo(() => Array(WORDS_COUNT).fill(0).map(() => React.createRef()), [WORDS_COUNT]);

    const [countDown, setCountDown] = useState(COUNT_DOWN);
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
            currWordIndex !== 0 &&
            wordSpanRefs[currWordIndex].current.offsetLeft < wordSpanRefs[currWordIndex - 1].current.offsetLeft
        ) {
            wordSpanRefs[currWordIndex - 1].current.scrollIntoView({
                behavior: 'smooth',
            }); 
        } 
    }, [currWordIndex, wordSpanRefs]);

    // Focus the hidden input on mount
    useEffect(() => {
        if (textInputRef.current){
            textInputRef.current.focus();
        } 
    }, [status]);

    // Resets the game and marks it as finished
    const resetGame = () => {
        setStatus('waiting'); 
        reset();
    };
    
    const getDifficultyButtonClassName = (buttonDifficulty) => {
        return difficulty === buttonDifficulty ? "active-button" : "inactive-button";
    };
    
    const getAddOnButtonClassName = (addon) => {
        return addon ? "active-button" : "inactive-button";
    };
    
    const getPacingStyleButtonClassName = (buttonPacingStyle) => {
        return pacingStyle === buttonPacingStyle ? "active-button" : "inactive-button";
    };

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
        setCountDown(COUNT_DOWN);
        clearInterval(intervalRef.current);
    };
    
    // starts the typing test and initializes the countdown timer.
    const start = () => {
        if (status === 'finished') {
            setStatus('started'); 

            intervalRef.current = setInterval(() => {
                setCountDown((prev) => {
                    if (prev === 0) {
                        finishTest();
                        clearInterval(intervalRef.current);
                        return COUNT_DOWN;
                    } else {
                        return prev - 1;
                    }
                });
            }, 1000); 

            return;
        }

        if (status !== 'started') {
            setStatus('started');

            intervalRef.current = setInterval(() => {
                setCountDown((prev) => {
                    if (prev === 0) {
                        finishTest();
                        clearInterval(intervalRef.current);
                        return COUNT_DOWN;
                    } else {
                        return prev - 1;
                    }
                });
            }, 1000); 
        }
    };
    
    // finishes the test, calculates WPM, and notifies App.jsx
    const finishTest = () => {
        setStatus('finished');
    };
    
    // calculates WPM and returns it
    const calculateWpm = () => {
        const correctChars = Object.values(history).filter(v => v === true).length;
        let calculatedWpm = Math.round(((correctChars / 5) / COUNT_DOWN) * 60);
        calculatedWpm = calculatedWpm < 0 || calculatedWpm === Infinity || !calculatedWpm ? 0 : calculatedWpm;
        return calculatedWpm;
    };

    // handles key down events, managing typing logic and WPM calculation.
    const handleKeyDown = ({ keyCode, key }) => {
        if (status === 'finished') {
            return;
        }

        const calculatedWPM = calculateWpm();
        setWpm(calculatedWPM);

        if (status === 'waiting') {
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
        <div>
            {status !== 'finished' ? (
                <>
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
                            type="text"
                            className={styles['hidden-input']}
                            value={currInput} 
                            onKeyDown={handleKeyDown}
                            onChange={UpdateInput}
                            aria-label="Typing Input"
                            role="textbox"
                            onBlur={() => textInputRef.current.focus()}
                        />
                    </div>

                    <div className={styles.stats}>
                        <h3>{countDown}s</h3>
                        <h3>WPM: {wpm}</h3>
                    </div>
                    <div className={styles.options}>
                        <Tooltip title="Restart" enterDelay={500} leaveDelay={200}>
                                <span><ResetButton onClick={resetGame} aria-label="Restart"/></span>
                        </Tooltip>
                    </div>
                </>
            ) : <Stats wpm={wpm} onRestart={resetGame}/> }
        </div>
    );

};

export default TypingArea;
