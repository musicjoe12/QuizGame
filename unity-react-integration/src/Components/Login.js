import React, { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await loginUser(values);
      message.success("✅ Login successful!");
      
      // Store token in local storage
      localStorage.setItem("token", response.data.token);
      
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      message.error("❌ Login failed. Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Login" style={{ width: 400, margin: "50px auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;
