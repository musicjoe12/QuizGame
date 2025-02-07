import React, { useState, useEffect } from "react";
import { Table, Card, message } from "antd";
import axios from "axios";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users/leaderboard")
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("❌ Failed to fetch leaderboard:", error);
        message.error("❌ Error loading leaderboard.");
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      title: "🏆 Rank",
      dataIndex: "rank",
      key: "rank",
      render: (text, record, index) => <strong style={{ fontSize: "18px" }}>{index + 1}</strong>, 
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <span style={{ fontSize: "18px" }}>{text}</span>, 
    },
    {
      title: "🎯 Points",
      dataIndex: "points",
      key: "points",
      sorter: (a, b) => b.points - a.points,
      render: (text) => <strong style={{ fontSize: "18px", color: "#1890ff" }}>{text}</strong>, 
    }
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100%" }}>
      <Card 
        title="🏆 Leaderboard" 
        style={{ width: "80%", maxWidth: "10000px", textAlign: "center", padding: "20px" }} 
      >
        <Table 
          dataSource={users} 
          columns={columns} 
          loading={loading} 
          rowKey="_id" 
          pagination={false} 
          size="large" 
        />
      </Card>
    </div>
  );
};

export default Leaderboard;
