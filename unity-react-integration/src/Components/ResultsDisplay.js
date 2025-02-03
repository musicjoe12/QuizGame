import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResultsDisplay = () => {
    const [result, setResult] = useState(null); 

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
            } else if (response.status === 204) {
                console.log('⚠️ No new result available');
                setResult(null); 
            }
        } catch (error) {
            console.error('❌ API request failed:', error);
        }
    };

    return (
        <div>
            <h1>Game Result</h1>
            <p>{result ? `Result: ${result}` : 'Waiting for result...'}</p>
        </div>
    );
};

export default ResultsDisplay;
