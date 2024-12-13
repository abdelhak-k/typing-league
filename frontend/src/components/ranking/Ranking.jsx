import React from 'react';
import styles from './ranking.module.css';
import { faRankingStar, faCrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Ranking = () => {
    // Example data (you can populate this from your database or API)
    const rankings = [
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 1, name: 'rocket', wpm: 304.76, date: '27 Aug 2023 14:24' },
        { rank: 2, name: 'saerith', wpm: 304.60, date: '25 Jun 2023 05:20' },
        { rank: 3, name: 'joshua728', wpm: 294.20, date: '25 Jun 2023 05:04' },
        { rank: 4, name: 'floppedrelic', wpm: 293.45, date: '08 Apr 2024 05:39' },
        { rank: 5, name: 'APackOfSmarties', wpm: 278.29, date: '06 May 2024 02:57' },
        // Add more entries here if needed...
    ];

    return (
        <div>
            <div className={styles.container}>

                <div className={styles.leagues}>
                    <div>
                    <label>choose a league:</label>
                        <select>
                            <option value="global">Global</option>
                            <option value="YOUR LEAGUE">YOUR LEAGUh</option>
                            <option value="">..</option>
                        </select>
                    </div>
                    <div>
                        <label>Join league</label>
                        <input></input>
                        <button>Join</button>
                    </div>
                    <div>
                        <label>create a league</label>
                        <input></input>
                        <button>Create</button>
                    </div>
                </div>
                
                <div className={styles.ranking}>
                    <table>

                        <thead className={styles.header}>
                            <tr>
                                <td colSpan={4}><FontAwesomeIcon icon={faCrown}/>15</td> 
                            </tr>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>WPM</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankings.map((entry, i) => (
                                <tr key={entry.rank}>
                                    <td>{i+1}</td>
                                    <td>{entry.name}</td>
                                    <td>{entry.wpm}</td>
                                    <td>{entry.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className={styles.ranking}>
                    <table>
                        <thead thead className={styles.header}>
                            <tr>
                                <td colSpan={4}><FontAwesomeIcon icon={faCrown}/>30</td> 
                            </tr>
                            <tr className={styles.header}>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>WPM</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankings.map((entry, i) => (
                                <tr key={entry.rank}>
                                    <td>{i+1}</td>
                                    <td>{entry.name}</td>
                                    <td>{entry.wpm}</td>
                                    <td>{entry.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Ranking;
