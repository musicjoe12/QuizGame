import React, { useState, useEffect } from 'react';

const ResultsDisplay = () => {
    const [result, setResult] = useState(null);  // State to store the result
    const [loading, setLoading] = useState(false); // State to manage loading status
    const [error, setError] = useState(null); // State to manage any errors

    // Fetch the result from the backend every 5 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchResult();
        }, 5000); // Polling every 5 seconds

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    // Function to fetch result from the API
    const fetchResult = async () => {
        setLoading(true);
        setError(null);  // Clear any previous error

        try {
            const response = await fetch('http://localhost:5000/api/result'); // Ensure correct endpoint
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Received result from Unity:', data.result);  // Log result for debugging

            // Update the result state
            setResult(data.result);
        } catch (error) {
            console.error('API request failed:', error);
            setError('Failed to fetch result. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Game Result</h1>
            {loading && <p>Loading...</p>}  {/* Show loading message */}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
            <p>{result ? `Result: ${result}` : 'Waiting for result...'}</p>
        </div>
    );
};

export default ResultsDisplay;
