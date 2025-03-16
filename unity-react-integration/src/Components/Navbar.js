import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import "../Css/Navbar.css";

const { Header } = Layout;

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(localStorage.getItem("role"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
    navigate("/login");
  };

  return (
    <>
      <div className="navbar-container"></div> {/* Invisible hover trigger */}
      <Header className="navbar">
        <Menu mode="horizontal" theme="dark" style={{ flex: 1 }} defaultSelectedKeys={["home"]}>
          <Menu.Item key="home">
            <Link to="/">🏠 Home</Link>
          </Menu.Item>
          {!user && (
            <>
              <Menu.Item key="login">
                <Link to="/login">🔑 Login</Link>
              </Menu.Item>
              <Menu.Item key="register">
                <Link to="/register">📝 Register</Link>
              </Menu.Item>
              <Menu.Item key="leaderboard">
                <Link to="/leaderboard">🏆 Leaderboard</Link>
              </Menu.Item>
            </>
          )}
          {user && role === "Staff" && (
            <Menu.Item key="createQuiz">
              <Link to="/create-quiz">📝 Create Quiz</Link>
            </Menu.Item>
          )}
        </Menu>

        {user && (
          <div className="navbar-user">
            <span>👤 {user}</span>
            <Button type="default" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </Header>
    </>
  );
};

export default Navbar;
