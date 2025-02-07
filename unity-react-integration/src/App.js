import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import UnityGame from "./Components/UnityGame.js";
import ResultDisplay from "./Components/ResultsDisplay.js";
import Login from "./Components/Login.js";
import Register from "./Components/Registration.js";
import Navbar from "./Components/Navbar";
import Leaderboard from "./Components/Leaderboard.js"; 
import CreateQuiz from "./Components/CreateQuiz"; 



const { Content } = Layout;

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <Router>
      <Layout>
        <Navbar user={user} setUser={setUser} />

        <Content style={{ padding: "50px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <Routes>
          <Route 
              path="/" 
              element={
                <div style={{ width: "100%", textAlign: "center" }}>
                  <UnityGame />
                  <ResultDisplay />
                </div>
              } />
            <Route path="/" element={<ResultDisplay />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<Leaderboard />} /> 
            <Route path="/create-quiz" element={<CreateQuiz />} /> 
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
