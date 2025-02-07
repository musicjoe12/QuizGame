import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Input, Select, message } from 'antd';
import "../Css/ResultsDisplay.css";
import boxImage from '../Images/no 2 box.png';

const { Option } = Select;

const ResultsDisplay = () => {
    const [result, setResult] = useState(null);
    const [points, setPoints] = useState(0);
    const [quiz, setQuiz] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizLoaded, setQuizLoaded] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:5000/api/result-stream');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('✅ New Result Received:', data.result);

            setResult(data.result);

            if (data.result === 'correct') {
                setPoints(prevPoints => prevPoints + data.points);
            }

            if (!quizLoaded) {
                fetchQuiz("67a62bc5db2f59cfc4386b03");
                setQuizLoaded(true);
            } else {
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

    const handleInputSubmit = () => {
        handleAnswerClick(inputValue.trim());
        setInputValue("");
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
                                    ) : currentQuestion.type === "true_false" ? (
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
                                    ) : currentQuestion.type === "fill_in_the_blank" ? (
                                        <>
                                            <Input 
                                                placeholder="Type your answer..." 
                                                value={inputValue} 
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onPressEnter={handleInputSubmit}
                                            />
                                            <Button onClick={handleInputSubmit} style={{ marginTop: 10 }}>Submit</Button>
                                        </>
                                    ) : currentQuestion.type === "drag_and_drop" ? (
                                        <>
                                            <p>Drag and drop the correct words into the blanks:</p>
                                            <Row gutter={16}>
                                                {currentQuestion.choices.map((choice, i) => (
                                                    <Col span={12} key={i}>
                                                        <Button
                                                            type={selectedAnswers[currentQuestionIndex] === choice ? "primary" : "default"}
                                                            block
                                                            onClick={() => handleAnswerClick(choice)}
                                                        >
                                                            {choice}
                                                        </Button>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </>
                                    ) : currentQuestion.type === "matching" ? (
                                        <>
                                            <p>Match each term to its correct value:</p>
                                            {Object.entries(currentQuestion.pairs).map(([key, value], i) => (
                                                <Row key={i} gutter={16} style={{ marginBottom: 10 }}>
                                                    <Col span={12}>
                                                        <p>{key}</p>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Select 
                                                            placeholder="Select a match"
                                                            onChange={(val) => handleAnswerClick({ [key]: val })}
                                                        >
                                                            {Object.values(currentQuestion.pairs).map((option, index) => (
                                                                <Option key={index} value={option}>{option}</Option>
                                                            ))}
                                                        </Select>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </>
                                    ) : null}
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
