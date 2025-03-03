import React, { useState } from 'react';
import axios from 'axios';

const PredictionForm = ({ matches }) => {
    const [loadingId, setLoadingId] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);

    const handlePredict = async (matchId) => {
        setLoadingId(matchId);
        setError(null);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/predict/${matchId}`);
            if (!response.data.prediction) {
                throw new Error('Invalid prediction data received');
            }
            setPrediction({
                ...response.data.prediction,
                matchId
            });
        } catch (error) {
            const errorMsg = error.response?.data?.error || 
                            error.message || 
                            'Prediction failed. Please try again.';
            setError(errorMsg);
            setPrediction(null);
        }
        setLoadingId(null);
    };

    return (
        <div className="prediction-container">
            <h2>Upcoming Matches</h2>
            
            {error && <div className="error">{error}</div>}

            <div className="matches-list">
                {matches.map(match => (
                    <div key={match.id} className="match-card">
                        <div className="match-info">
                            <h3>{match.teams?.join(' vs ') || 'Teams TBA'}</h3>
                            <p>📅 {new Date(match.date).toLocaleDateString()}</p>
                            <p>🏟️ {match.venue}</p>
                        </div>
                        <button 
                            onClick={() => handlePredict(match.id)}
                            disabled={loadingId === match.id}
                        >
                            {loadingId === match.id ? 'Predicting...' : 'Predict'}
                        </button>
                    </div>
                ))}
            </div>

            {prediction && (
                <div className="prediction-result">
                    <h3>{prediction.isLive ? 'Live Match Prediction' : 'Pre-Match Prediction'}</h3>

                    <div className="prediction-meta">
                        <p>Status: {prediction.status}</p>
                        {prediction.scorePrediction && (
                            <p>Predicted Score Range: {prediction.scorePrediction}</p>
                        )}
                    </div>

                    {prediction.winProbability && (
                        <div className="win-probability">
                            <h4>Win Probability:</h4>
                            {Object.entries(prediction.winProbability).map(([team, prob]) => (
                                <div key={team} className="probability-bar">
                                    <span className="team">{team}</span>
                                    <div className="bar-container">
                                        <div 
                                            className="bar" 
                                            style={{ width: `${parseInt(prob)}%` }}
                                        ></div>
                                        <span className="percentage">{prob}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {prediction.keyPlayers.length > 0 && (
                        <div className="key-players">
                            <h4>Players to Watch:</h4>
                            <div className="players-grid">
                                {prediction.keyPlayers.map((player, index) => (
                                    <div key={index} className="player-card">
                                        <h5>{player.name}</h5>
                                        <p>Role: {player.role}</p>
                                        <p>Performance Score: {player.performanceScore}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PredictionForm;
