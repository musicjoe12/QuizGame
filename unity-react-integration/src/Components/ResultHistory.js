import React, { useState, useEffect } from 'react';
import '../Css/ResultHistory.css';

import img1 from '../Images/1.png';
import img2 from '../Images/2.png';
import img5 from '../Images/5.png';
import img10 from '../Images/10.png';

const resultImages = {
    1: img1,
    2: img2,
    5: img5,
    10: img10
};

const ResultHistory = () => {
    const [results, setResults] = useState(Array(18).fill(null));

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:5000/api/result-stream');

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const rawResult = data.result;

                // Extract the numeric part from the result (e.g., "Result2" -> "2")
                const match = rawResult.match(/\d+/);
                if (match) {
                    const numericResult = parseInt(match[0], 10);
                    if (resultImages[numericResult]) {
                        setResults((prev) => {
                            const newResults = [...prev];
                            newResults.pop();
                            newResults.unshift(numericResult);
                            return newResults;
                        });
                    } else {
                        console.warn(`⚠️ No image found for result: ${numericResult}`);
                    }
                } else {
                    console.warn(`⚠️ Unexpected result format: ${rawResult}`);
                }
            } catch (error) {
                console.error('❌ Failed to parse SSE result:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('❌ SSE Connection Error:', error);
            eventSource.close();
        };

        return () => eventSource.close();
    }, []);

    return (
        <div className="result-history-grid">
            {results.map((result, index) => (
                <div key={index} className="result-item">
                    {result !== null ? (
                        <img src={resultImages[result]} alt={`Result ${result}`} />
                    ) : (
                        <div className="placeholder"></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ResultHistory;
