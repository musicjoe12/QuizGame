import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResultsDisplay.css'; // Import the CSS file
import boxImage from '../Images/no 2 box.png'; // Adjust the path to your image

const ResultsDisplay = () => {
    const [result, setResult] = useState(null); 
    const [points, setPoints] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(fetchResult, 5000); 

        return () => clearInterval(intervalId); 
    }, []);

    const fetchResult = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/result');

            if (response.status === 200) {
                console.log('✅ Received result from server:', response.data.result);
                setResult(response.data.result);
                if (response.data.result === 'correct') {
                    setPoints(points + response.data.points); // Assuming the API returns points
                }
            } else if (response.status === 204) {
                console.log('⚠️ No new result available');
                setResult(null); 
            }
        } catch (error) {
            console.error('❌ API request failed:', error);
        }
    };

    return (
        <div className="results-container">
            <h1>Game Result</h1>
            <p>{result ? `Result: ${result}` : 'Waiting for result...'}</p>
            <p>Points: {points}</p>
            <img 
                src={boxImage} 
                alt="Result Box" 
                className={`result-image ${result === 'Result2' ? 'flip' : ''}`} 
            />
        </div>
    );
};

export default ResultsDisplay;