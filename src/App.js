import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import PredictionForm from './components/PredictionForm';

function App() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get('${process.env.REACT_APP_API_URL}/api/matches');
                setMatches(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1 className="app-title">🏏 CricSage: Cricket Predictor</h1>
                {loading ? (
                    <p>Loading matches...</p>
                ) : error ? (
                    <p className="error">Error: {error}</p>
                ) : (
                    <PredictionForm matches={matches} />
                )}
                <footer className="app-footer">
                    <p>Powered by React & Flask | Cricket Data from cricketdata.org</p>
                </footer>
            </header>
        </div>
    );
}

export default App;
