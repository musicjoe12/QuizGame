import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, message } from 'antd';
import './ResultsDisplay.css';
import boxImage from '../Images/no 2 box.png';

const ResultsDisplay = () => {
    const [result, setResult] = useState(null);
    const [points, setPoints] = useState(0);
    const [quiz, setQuiz] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [quizLoaded, setQuizLoaded] = useState(false); // ✅ Prevent multiple quiz fetches

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/result'); // ✅ Unity API on 5000
                
                if (response.status === 200) {
                    console.log('✅ Received result:', response.data.result);
                    setResult(response.data.result);

                    if (response.data.result === 'correct') {
                        setPoints(prevPoints => prevPoints + response.data.points);
                    }

                    // ✅ Fetch Quiz when the first result is received (only once)
                    if (!quizLoaded) {
                        fetchQuiz("67a612d9db2f59cfc4386aff"); // ✅ Replace with actual MongoDB Quiz ID
                        setQuizLoaded(true);
                    }
                } else if (response.status === 204) {
                    console.log('⚠️ No new result available');
                    setResult(null);
                }
            } catch (error) {
                console.error('❌ API request failed:', error);
            }
        };

        // ✅ Poll every second for results from Unity API (port 5000)
        const intervalId = setInterval(fetchResult, 1000);
        return () => clearInterval(intervalId);
    }, [quizLoaded]); // ✅ Runs only when quiz hasn't loaded yet

    // ✅ Fetch Quiz Data from Quiz API (Port 5001)
    const fetchQuiz = async (quizId) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/quizzes/${quizId}`); // ✅ Quiz API on 5001
            if (response.status === 200) {
                console.log("✅ Quiz fetched:", response.data);
                setQuiz(response.data);
            }
        } catch (error) {
            console.error("❌ Failed to fetch quiz:", error);
        }
    };

    // ✅ Handle Answer Selection
    const handleAnswerClick = (questionIndex, selectedAnswer) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: selectedAnswer
        }));

        const correctAnswer = quiz.questions[questionIndex].correct_answer;
        if (selectedAnswer === correctAnswer) {
            message.success("✅ Correct Answer!");
            setPoints(prevPoints => prevPoints + 10);
        } else {
            message.error("❌ Wrong Answer!");
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

            {/* ✅ Display Questions */}
            <div className="quiz-container">
                {quiz ? (
                    quiz.questions.map((q, index) => (
                        <Card key={index} title={`Question ${index + 1} - ${q.difficulty.toUpperCase()}`} style={{ width: 600, marginBottom: 20 }}>
                            <p style={{ fontSize: "18px" }}>{q.question}</p>

                            <Row gutter={16}>
                                {q.type === "multiple_choice" ? (
                                    q.choices.map((choice, i) => (
                                        <Col span={12} key={i}>
                                            <Button
                                                type={selectedAnswers[index] === choice ? "primary" : "default"}
                                                block
                                                onClick={() => handleAnswerClick(index, choice)}
                                            >
                                                {choice}
                                            </Button>
                                        </Col>
                                    ))
                                ) : (
                                    <>
                                        <Col span={12}>
                                            <Button
                                                type={selectedAnswers[index] === "true" ? "primary" : "default"}
                                                block
                                                onClick={() => handleAnswerClick(index, "true")}
                                            >
                                                True
                                            </Button>
                                        </Col>
                                        <Col span={12}>
                                            <Button
                                                type={selectedAnswers[index] === "false" ? "primary" : "default"}
                                                block
                                                onClick={() => handleAnswerClick(index, "false")}
                                            >
                                                False
                                            </Button>
                                        </Col>
                                    </>
                                )}
                            </Row>
                        </Card>
                    ))
                ) : (
                    <p>Loading questions...</p>
                )}
            </div>
        </div>
    );
};

export default ResultsDisplay;
