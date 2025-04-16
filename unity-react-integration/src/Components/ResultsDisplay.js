import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Grid, TextField, Typography, Box, } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import "../Css/ResultsDisplay.css";
import TopslotIndicators from './TopslotIndicators'; 
import stringSimilarity from "string-similarity";



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
    const [lastResultTimestamp, setLastResultTimestamp] = useState(() => {
        return localStorage.getItem("lastResultTimestamp") || null;
      });    
    const [availableQuizzes, setAvailableQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);

    const [sessionId] = useState(() => {
        return sessionStorage.getItem("sessionId");
      });
      
      useEffect(() => {
        window.receiveSessionIdFromUnity = (sessionId) => {
          console.log("🌐 React received session ID:", sessionId);
          sessionStorage.setItem("sessionId", sessionId);
        };
      }, []);
      useEffect(() => {
        if (!selectedQuizId) return;
        console.log("🛰️ Connecting to SSE with sessionId:", sessionId);
        console.log("🔗 URL:", `https://quizgame-backend-0k3d.onrender.com/api/result-stream?sessionId=${sessionId}`);
        const eventSource = new EventSource(`https://quizgame-backend-0k3d.onrender.com/api/result-stream?sessionId=${sessionId}`);
      
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
      }, [selectedQuizId, sessionId]);
      
      

    useEffect(() => {
        axios.get("https://quizgame-backend-0k3d.onrender.com/api/quizzes")
          .then((res) => {
            setAvailableQuizzes(res.data);
          })
          .catch((err) => {
            console.error("❌ Could not fetch quiz list:", err);
          });
      }, []);

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
        const { result, finalPoints = 0, timestamp } = wheelData;
      
        if (!MAIN_WHEEL_RESULTS.includes(result)) return;
      
        // ✅ Block old or duplicate timestamps
        const lastTimestamp = Number(localStorage.getItem("lastResultTimestamp"));
        if (!selectedQuizId || timestamp <= lastTimestamp) {
          console.log("⚠️ Ignoring duplicate or stale result.");
          return;
        }
      
        console.log("🎡 Valid New Result:", result, "Points:", finalPoints);
      
        setResult(result);
        setPendingBonusPoints(finalPoints);
        setLastResultTimestamp(timestamp);
        localStorage.setItem("lastResultTimestamp", timestamp);
      
        // ✅ fetch + show only when quiz is selected and timestamp is valid
        fetchQuiz(selectedQuizId);
      };
      

    useEffect(() => {
        if (quiz && quiz.questions?.length > 0) {
          console.log("✅ Quiz ready with questions. Showing question...");
          setQuizLoaded(true);
          showQuestion();
        }
      }, [quiz]);
      
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
        const userInput = selected.trim().toLowerCase();
        let isCorrect = false;
    
        if (currentQuestion.type === "fill_in_the_blank") {
            // Fuzzy match using string similarity
            if (Array.isArray(correctAnswer)) {
                // Support multiple valid answers
                isCorrect = correctAnswer.some(ans =>
                    stringSimilarity.compareTwoStrings(userInput, ans.toLowerCase().trim()) > 0.7
                );
            } else {
                // Single answer
                const similarity = stringSimilarity.compareTwoStrings(userInput, correctAnswer.toLowerCase().trim());
                isCorrect = similarity > 0.7; // Threshold can be adjusted
            }
        } else {
            // Strict match for multiple choice / true_false
            isCorrect = userInput === correctAnswer.toLowerCase();
        }
    
        if (isCorrect) {
            const pointsToAdd = pendingBonusPoints;
    
            setPoints(prev => {
                const newPoints = prev + pointsToAdd;
                localStorage.setItem("points", newPoints);
                return newPoints;
            });
    
            console.log("✅ Correct! Points awarded:", pointsToAdd);
    
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
        setPendingBonusPoints(0); // Reset bonus
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
                    {!selectedQuizId && (
  <Card sx={{ width: 500, margin: "20px auto", padding: 3 }}>
    <Typography variant="h6" gutterBottom>Select a Quiz:</Typography>
    <Grid container spacing={2}>
      {availableQuizzes.map((quiz) => (
        <Grid item xs={6} key={quiz._id}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setSelectedQuizId(quiz._id)}
          >
            {quiz.quizname}
          </Button>
        </Grid>
      ))}
    </Grid>
  </Card>
)}


                <TopslotIndicators result={normalizeResultKey(result)} topSlot={topSlotResult} />
                {questionVisible && quiz && quiz.questions.length > 0 && (
                    <Card className="question-card" sx={{ maxWidth: 600, margin: "20px auto", padding: 3 }}>
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
