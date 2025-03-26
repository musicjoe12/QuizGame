import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Grid, TextField, Typography, Box } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import "../Css/ResultsDisplay.css";
import TopslotIndicators from './TopslotIndicators'; // at the top


const MAIN_WHEEL_RESULTS = ["Result1", "Result2", "Result5", "Result10", "CoinToss", "Plinko"];

const ResultsDisplay = () => {
    const [result, setResult] = useState(null);
    const [points, setPoints] = useState(() => {
        const isLoggedIn = localStorage.getItem("userId");
        return isLoggedIn ? Number(localStorage.getItem("points")) || 0 : 0;
    });    const [quiz, setQuiz] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [inputAnswer, setInputAnswer] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizLoaded, setQuizLoaded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const [questionVisible, setQuestionVisible] = useState(false);
    const [pendingBonusPoints, setPendingBonusPoints] = useState(0);
    const [topSlotResult, setTopSlotResult] = useState(null);
    const [lastResultTimestamp, setLastResultTimestamp] = useState(null);


    useEffect(() => {
        const eventSource = new EventSource('http://localhost:5000/api/result-stream');

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('✅ New Result Received:', data);

                if (data.wheel) {
                    handleWheelResult(data.wheel);
                }
                if (data.topslot) {
                    setTopSlotResult(data.topslot); 
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
    }, [quizLoaded]);

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

    const handleWheelResult = (wheelData) => {
        const result = wheelData.result;
        const finalPoints = wheelData.finalPoints || 0;
        const timestamp = wheelData.timestamp;
    
        if (!MAIN_WHEEL_RESULTS.includes(result)) return;
    
        // ✅ Skip if we've already handled this result
        if (timestamp === lastResultTimestamp) {
            console.log("⚠️ Duplicate result ignored.");
            return;
        }
    
        console.log("🎡 New Result:", result, "Points:", finalPoints);
    
        setResult(result);
        setPendingBonusPoints(finalPoints);
        setLastResultTimestamp(timestamp); // ✅ Store latest timestamp
    
        if (!quizLoaded) {
            fetchQuiz("67a62bc5db2f59cfc4386b03").then(() => {
                setQuizLoaded(true);
                showQuestion();
            });
        } else {
            showQuestion();
        }
    };

    const showQuestion = () => {
        if (!quiz || quiz.questions.length === 0) return;
        const randomIndex = Math.floor(Math.random() * quiz.questions.length);
        setCurrentQuestionIndex(randomIndex);
        setQuestionVisible(true);
        setTimeLeft(10);
    };

    const handleAnswerClick = async (selected) => {
        if (!quiz) return;
        const currentQuestion = quiz.questions[currentQuestionIndex];
        const correctAnswer = currentQuestion.correct_answer;
        const isCorrect = selected.toLowerCase() === correctAnswer.toLowerCase();
    
        if (isCorrect) {
            const pointsToAdd = pendingBonusPoints;
            setPoints(prev => {
                const newPoints = prev + pointsToAdd;
                localStorage.setItem("points", newPoints); // ✅ Keep it in sync
                return newPoints;
              });
              
            console.log("✅ Correct! Points awarded:", pointsToAdd);
    
            // ✅ If user is logged in, update backend
            const userId = localStorage.getItem("userId");
            if (userId) {
                try {
                    await axios.put("http://localhost:5000/api/users/update-points", {
                        userId,
                        points: pointsToAdd
                    });
                    console.log("📤 Points updated in backend.");
                } catch (err) {
                    console.error("❌ Failed to update user points:", err);
                }
            }
        } else {
            console.log("❌ Incorrect answer.");
        }
    
        setQuestionVisible(false);
        setPendingBonusPoints(0); // reset
    };
    

    const handleInputSubmit = () => {
        handleAnswerClick(inputAnswer);
        setInputAnswer("");
    };
    const normalizeResultKey = (result) => {
        if (result === "Plinko") return "ResultPC";
        if (result === "CoinToss") return "ResultCF";
        return result;
    };
    
    return (
        <DndProvider backend={HTML5Backend}>
            <Box className="results-container">
                    <Box className="user-points-box">
                    <Typography variant="h6" className="points-label">
                        🪙 Points: {points}
                    </Typography>
                    {localStorage.getItem("username") && (
                        <Typography variant="subtitle2" className="username-label">
                        👤 Logged in as: {localStorage.getItem("username")}
                        </Typography>
                    )}
                    </Box>

                <TopslotIndicators result={normalizeResultKey(result)} topSlot={topSlotResult} />
                {questionVisible && quiz && quiz.questions.length > 0 && (
                    <Card sx={{ width: 600, margin: "20px auto", padding: 3 }}>
                        <Typography variant="h6">{quiz.questions[currentQuestionIndex].question}</Typography>
                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                            {quiz.questions[currentQuestionIndex].type === "multiple_choice" && (
                                quiz.questions[currentQuestionIndex].choices.map((choice, i) => (
                                    <Grid item xs={6} key={i}>
                                        <Button fullWidth variant="contained" onClick={() => handleAnswerClick(choice)}>
                                            {choice}
                                        </Button>
                                    </Grid>
                                ))
                            )}

                            {quiz.questions[currentQuestionIndex].type === "true_false" && (
                                <>
                                    <Grid item xs={6}>
                                        <Button fullWidth variant="contained" color="success" onClick={() => handleAnswerClick("true")}>
                                            True
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button fullWidth variant="contained" color="error" onClick={() => handleAnswerClick("false")}>
                                            False
                                        </Button>
                                    </Grid>
                                </>
                            )}

                            {quiz.questions[currentQuestionIndex].type === "fill_in_the_blank" && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Type your answer"
                                            value={inputAnswer}
                                            onChange={(e) => setInputAnswer(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button fullWidth variant="contained" onClick={handleInputSubmit}>
                                            Submit
                                        </Button>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Card>
                )}
            </Box>
        </DndProvider>
    );
};

export default ResultsDisplay;
