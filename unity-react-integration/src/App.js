import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "antd";
import UnityGame from "./Components/UnityGame.js";
import ResultDisplay from "./Components/ResultsDisplay.js";
import Login from "./Components/Login.js";
import Register from "./Components/Registration.js";
import Navbar from "./Components/Navbar";
import Leaderboard from "./Components/Leaderboard.js"; 
import CreateQuiz from "./Components/CreateQuiz"; 

const { Content } = Layout;

const AppContent = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Determine if Unity should be visible
  const isGamePage = location.pathname === "/";

  return (
    <>
      {/* Navbar always visible above the Unity canvas */}
      <div className="navbar-wrapper">
        <Navbar user={user} setUser={setUser} />
      </div>

      {/* Unity Game - stays mounted but toggles visibility */}
      <div className="persistent-unity" style={{ display: isGamePage ? "block" : "none" }}>
        <UnityGame />
      </div>

      {/* Page Content */}
      <Layout>
        <Content style={{ padding: "50px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <Routes>
            {/* <Route path="/" element={<ResultDisplay />} /> */}
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
          </Routes>
        </Content>
      </Layout>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
