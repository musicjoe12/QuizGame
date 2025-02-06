import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Button } from "antd";

const { Header } = Layout;

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#001529", padding: "0 20px" }}>
      {/* Menu Items */}
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
              <Link to="/leaderboard"> Leaderboard</Link>
            </Menu.Item> 
          </>
        )}
      </Menu>

      {/* ✅ Show Username & Logout if Logged In */}
      {user ? (
        <div style={{ color: "white", display: "flex", alignItems: "center", gap: "10px" }}>
          <span>👤 {user}</span>
          <Button type="default" onClick={handleLogout}>Logout</Button>
        </div>
      ) : null}
    </Header>
  );
};

export default Navbar;
