import React, { useState } from "react";
import { Form, Input, Button, message, Card, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // ✅ Store error message
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const loginUser = async (values) => {
    console.log("📤 Sending login request:", values);
    setLoading(true);
    setError(null);

    axios.post("http://localhost:5000/api/users/login", values)
      .then(response => {
        console.log("✅ Login successful:", response.data);
        message.success("✅ Login successful!");

        // Store items
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", response.data.role); // ✅ Store role
        localStorage.setItem("points", response.data.points);
        setUser(response.data.username);
        navigate("/");
      })
      .catch(error => {
        console.error("❌ Login failed:", error.response?.data || error);
        setError(error.response?.data?.message || "Login failed.");
      })
      .finally(() => {
        setLoading(false);
      });
};


  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Card title="Login" style={{ width: 400 }}>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />} {/* ✅ Show Error Message */}
        <Form layout="vertical" form={form} onFinish={loginUser}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Valid email is required!" }]}>
            <Input allowClear />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Password is required!" }]}>
            <Input.Password allowClear />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
