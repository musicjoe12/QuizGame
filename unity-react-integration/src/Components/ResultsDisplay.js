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
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizLoaded, setQuizLoaded] = useState(false);

    useEffect(() => {
        // ✅ Listen for results from Unity API using SSE
        const eventSource = new EventSource('http://localhost:5000/api/result-stream');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('✅ New Result Received:', data.result);

            setResult(data.result);

            if (data.result === 'correct') {
                setPoints(prevPoints => prevPoints + data.points);
            }

            // ✅ Fetch quiz only once
            if (!quizLoaded) {
                fetchQuiz("67a612d9db2f59cfc4386aff");
                setQuizLoaded(true);
            } else {
                // ✅ Move to the next question when new result is received
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            }
        };

        eventSource.onerror = (error) => {
            console.error('❌ SSE Connection Error:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [quizLoaded]);

    const fetchQuiz = async (quizId) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/quizzes/${quizId}`);
            if (response.status === 200) {
                console.log("✅ Quiz fetched:", response.data);
                setQuiz(response.data);
            }
        } catch (error) {
            console.error("❌ Failed to fetch quiz:", error);
        }
    };

    const handleAnswerClick = (selectedAnswer) => {
        if (!quiz) return;
        const currentQuestion = quiz.questions[currentQuestionIndex];
        const correctAnswer = currentQuestion.correct_answer;

        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: selectedAnswer
        }));

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

            <div className="quiz-container">
                {quiz && quiz.questions.length > 0 && currentQuestionIndex < quiz.questions.length ? (
                    (() => {
                        const currentQuestion = quiz.questions[currentQuestionIndex];
                        return (
                            <Card key={currentQuestionIndex} title={`Question ${currentQuestionIndex + 1} - ${currentQuestion.difficulty.toUpperCase()}`} style={{ width: 600, marginBottom: 20 }}>
                                <p style={{ fontSize: "18px" }}>{currentQuestion.question}</p>

                                <Row gutter={16}>
                                    {currentQuestion.type === "multiple_choice" ? (
                                        currentQuestion.choices.map((choice, i) => (
                                            <Col span={12} key={i}>
                                                <Button
                                                    type={selectedAnswers[currentQuestionIndex] === choice ? "primary" : "default"}
                                                    block
                                                    onClick={() => handleAnswerClick(choice)}
                                                >
                                                    {choice}
                                                </Button>
                                            </Col>
                                        ))
                                    ) : (
                                        <>
                                            <Col span={12}>
                                                <Button
                                                    type={selectedAnswers[currentQuestionIndex] === "true" ? "primary" : "default"}
                                                    block
                                                    onClick={() => handleAnswerClick("true")}
                                                >
                                                    True
                                                </Button>
                                            </Col>
                                            <Col span={12}>
                                                <Button
                                                    type={selectedAnswers[currentQuestionIndex] === "false" ? "primary" : "default"}
                                                    block
                                                    onClick={() => handleAnswerClick("false")}
                                                >
                                                    False
                                                </Button>
                                            </Col>
                                        </>
                                    )}
                                </Row>
                            </Card>
                        );
                    })()
                ) : (
                    <p>{quiz ? "Quiz completed! 🎉" : "Loading questions..."}</p>
                )}
            </div>
        </div>
    );
};

export default ResultsDisplay;
