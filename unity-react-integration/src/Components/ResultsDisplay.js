import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Input, Select, Checkbox, message } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
    const [draggedWord, setDraggedWord] = useState(null);
    const [multiSelectAnswers, setMultiSelectAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(10);
    const [questionVisible, setQuestionVisible] = useState(true);

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
            } else if (quiz && quiz.questions.length > 0) {
                setCurrentQuestionIndex(() => {
                    const randomIndex = Math.floor(Math.random() * quiz.questions.length);
                    return randomIndex;
                });
            }
            setTimeLeft(10);
            setQuestionVisible(true);
        };

        eventSource.onerror = (error) => {
            console.error('❌ SSE Connection Error:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [quizLoaded, quiz]);

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

    const handleAnswerClick = (selectedAnswer) => {
        if (!quiz) return;
        const currentQuestion = quiz.questions[currentQuestionIndex];
        const correctAnswer = currentQuestion.correct_answer;

        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: selectedAnswer
        }));

        if (Array.isArray(correctAnswer)) {
            if (JSON.stringify(selectedAnswer.sort()) === JSON.stringify(correctAnswer.sort())) {
                message.success("✅ Correct Answer!");
                setPoints(prevPoints => prevPoints + 10);
            } else {
                message.error("❌ Wrong Answer!");
            }
        } else if (selectedAnswer === correctAnswer) {
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

    const DragWord = ({ word }) => {
        const [{ isDragging }, drag] = useDrag(() => ({
            type: "WORD",
            item: { word },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }));

        return (
            <Button ref={drag} style={{ opacity: isDragging ? 0.5 : 1, margin: "5px" }}>
                {word}
            </Button>
        );
    };

    const DropBox = ({ onDrop }) => {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: "WORD",
            drop: (item) => onDrop(item.word),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }));

        return (
            <div ref={drop} className={`drop-box ${isOver ? "hovered" : ""}`}>
                {draggedWord || "Drop here"}
            </div>
        );
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="results-container">
                <h1>Game Result</h1>
                <p>{result ? `Result: ${result}` : 'Waiting for result...'}</p>
                <p>Points: {points}</p>
                <img src={boxImage} alt="Result Box" className={`result-image ${result === 'Result2' ? 'flip' : ''}`} />

                <div className="quiz-container">
                    {questionVisible && quiz && quiz.questions.length > 0 && currentQuestionIndex < quiz.questions.length ? (
                        (() => {
                            const currentQuestion = quiz.questions[currentQuestionIndex];
                            return (
                                <Card key={currentQuestionIndex} title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Question {currentQuestionIndex + 1} - {currentQuestion.difficulty.toUpperCase()}</span>
                                        <span>⏱️ {timeLeft}s</span>
                                    </div>
                                } style={{ width: 600, marginBottom: 20 }}>
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
                                                    <Button block onClick={() => handleAnswerClick("true")}>
                                                        True
                                                    </Button>
                                                </Col>
                                                <Col span={12}>
                                                    <Button block onClick={() => handleAnswerClick("false")}>
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
                                                <p>Drag the correct words into the box:</p>
                                                <Row gutter={16}>
                                                    {currentQuestion.choices.map((choice, i) => (
                                                        <Col span={6} key={i}>
                                                            <DragWord word={choice} />
                                                        </Col>
                                                    ))}
                                                </Row>
                                                <DropBox onDrop={(word) => setDraggedWord(word)} />
                                                <Button onClick={() => handleAnswerClick(draggedWord)}>Submit</Button>
                                            </>
                                        ) : currentQuestion.type === "multi_select" ? (
                                            <Checkbox.Group options={currentQuestion.choices} onChange={setMultiSelectAnswers} />
                                        ) : null}
                                    </Row>
                                </Card>
                            );
                        })()
                    ) : (
                        <p>{quiz ? "Waiting for next question..." : "Loading questions..."}</p>
                    )}
                </div>
            </div>
        </DndProvider>
    );
};

export default ResultsDisplay;
