import React, { useState } from "react";
import { Form, Input, Button, message, Card, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // ✅ Store error message
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // ✅ Handle Login
  const loginUser = async (values) => {
    console.log("📤 Sending login request:", values);
    setLoading(true);
    setError(null); // ✅ Reset error on new attempt

    axios.post("http://localhost:5001/api/users/login", values)
      .then(response => {
        console.log("✅ Login successful:", response.data);
        message.success("✅ Login successful!");

        // ✅ Store token & user in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);

        setUser(response.data.username);
        navigate("/"); // ✅ Redirect to Home Page
      })
      .catch(error => {
        console.error("❌ Login failed:", error.response?.data || error);
        setError(error.response?.data?.message || "Login failed."); // ✅ Show error on page
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
