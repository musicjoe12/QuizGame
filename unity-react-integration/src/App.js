import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button, Layout } from "antd";
import UnityGame from "./Components/UnityGame.js";
import ResultDisplay from "./Components/ResultsDisplay.js";
import Login from "./Components/Login.js";
import Register from "./Components/Registration.js";

const { Header, Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout>
        {/* Navbar with Login & Register Buttons */}
        <Header style={{ display: "flex", justifyContent: "center", gap: "20px", background: "#001529" }}>
          <Button type="link"><Link to="/">Home</Link></Button>
          <Button type="link"><Link to="/login">Login</Link></Button>
          <Button type="link"><Link to="/register">Register</Link></Button>
        </Header>

        {/* Page Content */}
        <Content style={{ padding: "50px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <Routes>
            <Route path="/" element={<UnityGame />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/results" element={<ResultDisplay />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
