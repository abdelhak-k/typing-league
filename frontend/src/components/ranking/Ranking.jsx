import React, { useState, useEffect } from 'react';
import styles from './ranking.module.css';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../api';
const Ranking = () => {
    const [inputValue, setInputValue] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [leagues, setLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [leagueRankings, setLeagueRankings] = useState({ 15: [], 30: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [isGlobalLoading, setIsGlobalLoading] = useState(false);


    // Add state for global rankings
    const [globalRankings15, setGlobalRankings15] = useState([]);
    const [globalRankings30, setGlobalRankings30] = useState([]);

    // Fetch user's leagues AND global rankings on mount
    useEffect(() => {
        const fetchGlobalRankings = async () => {
            setIsGlobalLoading(true);
            try {
                const global15Response = await api.get('/api/ranking/15/');
                const global30Response = await api.get('/api/ranking/30/');
                setGlobalRankings15(global15Response.data);
                setGlobalRankings30(global30Response.data);
            } catch (error) {
                console.error('Error fetching global rankings:', error);
            } finally {
                setIsGlobalLoading(false);
            }
        };
        fetchGlobalRankings();
    }, []);

    // Fetch user's leagues on mount
    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const response = await api.get('/api/leagues/');
                setLeagues(response.data);
            } catch (error) {
                console.error('Error fetching leagues:', error);
            }
        };
        fetchLeagues();
    }, []);

    // Fetch league rankings when selected
    useEffect(() => {
        const fetchLeagueRankings = async () => {
            if (!selectedLeague) return;
            
            setIsLoading(true);
            try {
                const response = await api.get(`/api/leagues/${selectedLeague.id}/ranking/`);
                const fifteen = response.data.sort((a, b) => b.max_wpm_15 - a.max_wpm_15);
                const thirty = response.data.sort((a, b) => b.max_wpm_30 - a.max_wpm_30);
                setLeagueRankings({ 15: fifteen, 30: thirty });
            } catch (error) {
                console.error('Error fetching league rankings:', error);
                Swal.fire('Error', 'Failed to load league rankings', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeagueRankings();
    }, [selectedLeague]);

    const handleCreateLeague = async (leagueName) => {
        try {
            const response = await api.post('/api/leagues/', { name: leagueName });
            Swal.fire({
                title: 'League Created!',
                html: `Your league code is <strong>${response.data.code}</strong>`,
                icon: 'success'
            });
            setLeagues([...leagues, response.data]);
        } catch (error) {
            Swal.fire('Error', 'Failed to create league', 'error');
        }
    };

    const handleJoinLeague = async () => {
        try {
            await api.put('/api/leagues/', { code: joinCode.toUpperCase() });
            Swal.fire('Success', 'Joined league successfully!', 'success');
            // Refresh leagues list
            const response = await api.get('/api/leagues/');
            setLeagues(response.data);
            setJoinCode('');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.error || 'Failed to join league', 'error');
        }
    };

    const showSwal = () => {
        withReactContent(Swal).fire({
            title: <i>What's the name of your league?</i>,
            input: 'text',
            inputValue,
            preConfirm: (name) => {
                if (!name) {
                    Swal.showValidationMessage('Please enter a league name');
                    return false;
                }
                handleCreateLeague(name);
                return name;
            },
        });
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(selectedLeague.code);
            Swal.fire({
                icon: 'success',
                title: 'Copied!',
                text: 'League code copied to clipboard',
                timer: 2000
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to copy code', 'error');
        }
    };
    return (
        <div>
            <div className={styles.container}>
                <div className={styles.leagues}>
                    <div>
                        <label>Choose a league:</label>
                        <select 
                        value={selectedLeague?.id?.toString() || 'global'}
                        onChange={(e) => {
                            const selectedId = e.target.value;
                            if (selectedId === 'global') {
                                setSelectedLeague(null);
                            } else {
                                const league = leagues.find(l => l.id.toString() === selectedId);
                                setSelectedLeague(league || null);
                            }
                        }}
                    >
                        <option value="global">Global</option>
                        {leagues.map(league => (
                            <option key={league.id} value={league.id}>
                                {league.name}
                            </option>
                        ))}
                    </select>
                    {selectedLeague && (
                        <span className={styles.leagueCode} onClick={handleCopyCode}>
                            copy league code
                        </span>
                    )}
                    </div>
                    <div>
                        <label>Join league:</label>
                        <input 
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                        />
                        <button onClick={handleJoinLeague}>Join</button>
                    </div>
                    <div>
                        <label>Create a league:</label>
                        <button onClick={showSwal}>Create</button>
                    </div>
                </div>

                {/* Ranking Tables */}
                {[15, 30].map(duration => (
                    <div key={duration} className={styles.ranking}>
                        <table>
                            <thead className={styles.header}>
                                <tr>
                                <td colSpan={4}>
                                <FontAwesomeIcon icon={faCrown} />
                                {selectedLeague ? (
                                    <span className={styles.leagueHeader}>
                                        {selectedLeague.name} 

                                    </span>
                                ) : 'Global'} - {duration}s
                                </td>
                                </tr>
                                <tr>
                                    <th>Rank</th>
                                    <th>Name</th>
                                    <th>WPM</th>
                                </tr>
                            </thead>
                            <tbody>
                            {(isLoading && selectedLeague)  || (isGlobalLoading && !selectedLeague) ? (
                                <tr>
                                    <td colSpan={4} className={styles.loading}>
                                        Loading rankings...
                                    </td>
                                </tr>
                            ) : (
                                (selectedLeague ? leagueRankings[duration] : 
                                    (duration === 15 ? globalRankings15 : globalRankings30)
                                ).map((entry, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{entry.username}</td>
                                        <td>{(entry[`max_wpm_${duration}`] || 0).toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ranking;