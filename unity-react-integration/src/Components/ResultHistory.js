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
    const [sessionId] = useState(() => sessionStorage.getItem("sessionId"));

    useEffect(() => {
        const eventSource = new EventSource(`https://quizgame-backend-0k3d.onrender.com/api/result-stream?sessionId=${sessionId}`);
    
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("📡 SSE Received:", data);
    
                // Only process if this message has a wheel result
                if (data.wheel && data.wheel.result) {
                    const rawResult = data.wheel.result;
    
                    const match = rawResult.match(/\d+/); // Match number in "Result5"
                    if (!match) return;
    
                    const numericResult = parseInt(match[0], 10);
                    if (!resultImages[numericResult]) return;
    
                    setResults((prev) => {
                        const newResults = [numericResult, ...prev];
                        return newResults.slice(0, 18); // Keep latest 18
                    });
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
            {results.map((res, i) => (
                <div key={i} className="result-item">
                    {res ? (
                        <img src={resultImages[res]} alt={`Result ${res}`} />
                    ) : (
                        <div className="placeholder" />
                    )}
                </div>
            ))}
        </div>
    );
};

export default ResultHistory;
