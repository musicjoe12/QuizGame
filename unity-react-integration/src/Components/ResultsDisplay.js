import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Input, message } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import "../Css/ResultsDisplay.css";

import twoBar from '../Images/2bar.png';
import oneBar from '../Images/1bar.png';
import fiveBar from '../Images/5bar.png';
import tenBar from '../Images/10bar.png';
import cointossBar from '../Images/cointossBar.png';
import plinkoBar from '../Images/plinkoBar.png';

const resultImages = {
    Result1: oneBar,
    Result2: twoBar,
    Result5: fiveBar,
    Result10: tenBar,
    ResultCF: cointossBar,
    ResultPC: plinkoBar
};

// ✅ Define Main Wheel Results & Bonus Triggers
const MAIN_WHEEL_RESULTS = ["Result1", "Result2", "Result5", "Result10"];
const BONUS_GAMES = ["ResultPC", "ResultCF"];
const BONUS_RESULTS = ["Plinko", "CoinToss"]; // These send final points

const ResultsDisplay = () => {
    const [result, setResult] = useState(null);
    const [points, setPoints] = useState(0);
    const [quiz, setQuiz] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizLoaded, setQuizLoaded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const [questionVisible, setQuestionVisible] = useState(false);
    const [bonusActive, setBonusActive] = useState(false);
    const [pendingBonusPoints, setPendingBonusPoints] = useState(0);
    const [bonusQuestionAnsweredCorrectly, setBonusQuestionAnsweredCorrectly] = useState(false);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:5000/api/result-stream');

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('✅ New Result Received:', data);

                // ✅ Extract data correctly
                if (data.wheel) {
                    handleWheelResult(data.wheel);
                }
                if (data.bonusStart) {
                    handleBonusStart(data.bonusStart);
                }
                if (data.bonus) {
                    handleBonusResult(data.bonus);
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
    }, [quizLoaded, bonusActive]);

    useEffect(() => {
        if (timeLeft > 0 && questionVisible) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setQuestionVisible(false);
        }
    }, [timeLeft, questionVisible]);

    const fetchQuiz = async (quizId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/quizzes/${quizId}`);
            if (response.status === 200) {
                console.log("✅ Quiz fetched:", response.data);
                setQuiz(response.data);
            }
        } catch (error) {
            console.error("❌ Failed to fetch quiz:", error);
        }
    };

    // ✅ Handle Normal Wheel Results (1, 2, 5, 10)
    const handleWheelResult = (wheelData) => {
        const result = wheelData.result;
        const finalPoints = wheelData.finalPoints || 0;
        console.log("🎡 Wheel Landed On:", result, "Final Points:", finalPoints);
    
        if (!MAIN_WHEEL_RESULTS.includes(result)) return;
    
        setResult(result);
        setPendingBonusPoints(finalPoints);
    
        // ✅ Ensure the quiz is loaded before showing the question
        if (!quizLoaded) {
            console.log("📥 Loading Quiz...");
            fetchQuiz("67a62bc5db2f59cfc4386b03").then(() => {
                setQuizLoaded(true);
                console.log("✅ Quiz Loaded! Showing Question...");
                showQuestion();
            });
        } else {
            console.log("🔵 Quiz Already Loaded. Showing Question Now...");
            showQuestion();
        }
    };
    

    // ✅ Handle Bonus Start (Plinko, Coin Toss Starts)
    const handleBonusStart = (bonusStartData) => {
        console.log("🎰 Bonus Game Started:", bonusStartData.result);

        if (!BONUS_GAMES.includes(bonusStartData.result)) return;

        setBonusActive(true);
        setPendingBonusPoints(0);
        setBonusQuestionAnsweredCorrectly(false);

        // ✅ Show question before the bonus starts
        showQuestion();

        // ✅ Hide question after 7 seconds when bonus starts
        setTimeout(() => {
            setQuestionVisible(false);
        }, 7000);
    };

    // ✅ Handle Bonus Completion (Apply Points Only If Correct)
    const handleBonusResult = (bonusResultData) => {
        console.log("🔥 Bonus Completed:", bonusResultData.result, "Points:", bonusResultData.points);

        if (!BONUS_RESULTS.includes(bonusResultData.result)) return;

        if (bonusQuestionAnsweredCorrectly) {
            setPoints(prevPoints => prevPoints + bonusResultData.points);
            console.log("✅ Bonus Points Applied:", bonusResultData.points);
        } else {
            console.log("❌ Bonus Points NOT Applied: Question was incorrect");
        }

        // ✅ Reset Bonus State
        setBonusActive(false);
        setPendingBonusPoints(0);
    };

    const showQuestion = () => {
        if (!quiz) {
            console.log("❌ No quiz available. Skipping question.");
            return;
        }
    
        if (quiz.questions.length > 0) {
            const randomIndex = Math.floor(Math.random() * quiz.questions.length);
            setCurrentQuestionIndex(randomIndex);
            setQuestionVisible(true);
            setTimeLeft(10);
            console.log("📢 Showing Question:", quiz.questions[randomIndex].question);
        } else {
            console.log("❌ Quiz has no questions.");
        }
    };
    

    const handleAnswerClick = (selected) => {
        if (!quiz) return;
        const currentQuestion = quiz.questions[currentQuestionIndex];
        const correctAnswer = currentQuestion.correct_answer;

        setSelectedAnswer(selected);

        if (selected === correctAnswer) {
            message.success("✅ Correct Answer!");

            if (bonusActive) {
                setBonusQuestionAnsweredCorrectly(true);
            } else {
                setPoints(prevPoints => prevPoints + pendingBonusPoints);
            }
        } else {
            message.error("❌ Wrong Answer!");
        }

        setQuestionVisible(false);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="results-container">
                <div className="points">
                    <p>Points: {points}</p>
                </div>

                <div className="result-grid">
                    {Object.keys(resultImages).map((key) => (
                        <img 
                            key={key} 
                            src={resultImages[key]} 
                            alt={`Result ${key}`} 
                            className={`result-image ${result === key ? 'flip' : ''}`} 
                        />
                    ))}
                </div>

                {questionVisible && quiz && quiz.questions.length > 0 ? (
                    (() => {
                        const currentQuestion = quiz.questions[currentQuestionIndex];
                        return (
                            <Card key={currentQuestionIndex} title={`Question - ${currentQuestion.difficulty.toUpperCase()}`} style={{ width: 600, marginBottom: 20 }}>
                                <p style={{ fontSize: "18px" }}>{currentQuestion.question}</p>
                                <Row gutter={16}>
                                    {currentQuestion.choices.map((choice, i) => (
                                        <Col span={12} key={i}>
                                            <Button
                                                type={selectedAnswer === choice ? "primary" : "default"}
                                                block
                                                onClick={() => handleAnswerClick(choice)}
                                            >
                                                {choice}
                                            </Button>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        );
                    })()
                ) : (
                    <p>{quiz ? "Waiting for next question..." : "Loading questions..."}</p>
                )}
            </div>
        </DndProvider>
    );
};

export default ResultsDisplay;
