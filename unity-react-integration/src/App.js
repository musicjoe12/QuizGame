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
import ResultHistory from "./Components/ResultHistory.js";

const { Content } = Layout;

const AppContent = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sessionIdReady, setSessionIdReady] = useState(false);

  useEffect(() => {
    // 🔐 Set logged in user
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUser(storedUser);

    // 🔄 Listen for Unity's session ID call
    window.receiveSessionIdFromUnity = (id) => {
      console.log("🌐 Received sessionId from Unity:", id);
      sessionStorage.setItem("sessionId", id);
      setSessionIdReady(true);
    };

    // 🧠 Use previously stored sessionId if available (page refresh)
    const storedSession = sessionStorage.getItem("sessionId");
    if (storedSession) {
      console.log("📦 Session already exists in storage:", storedSession);
      setSessionIdReady(true);
    }
  }, []);

  const isGamePage = location.pathname === "/";

  return (
    <>
      {/* 🧭 Navbar always shown */}
      <div className="navbar-wrapper">
        <Navbar user={user} setUser={setUser} />
      </div>

      {/* 🕹 Unity always loaded, just hidden when not on "/" */}
      <div className="persistent-unity" style={{ display: isGamePage ? "block" : "none" }}>
        <UnityGame />
      </div>

      <Layout>
        <div className="app-content">
          <Routes>
            <Route
              path="/"
              element={
                sessionIdReady ? (
                  <>
                    <ResultDisplay />
                    <ResultHistory />
                  </>
                ) : (
                  <div style={{ color: "#fff", textAlign: "center", marginTop: "80px" }}>
                    🕐 Waiting for Unity session ID...
                  </div>
                )
              }
            />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
          </Routes>
        </div>
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
