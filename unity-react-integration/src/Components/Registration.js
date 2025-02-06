import React, { useState } from "react";
import { Form, Input, Button, message, Modal } from "antd";
import axios from "axios";

const Register = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // ✅ Fix: Ensure Axios properly sends data
  const registerUser = async (values) => {
    console.log("📤 Sending data to backend:", values);
    setLoading(true);

    axios.post("http://localhost:5001/api/users/register", values)
      .then(response => {
        console.log("✅ Registration successful:", response.data);
        message.success("✅ Registration successful!");

        setIsModalOpen(false);
        form.resetFields();
      })
      .catch(error => {
        console.error("❌ Registration failed:", error.response?.data || error);
        message.error(error.response?.data?.message || "❌ Registration failed.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Button type="default" onClick={() => { form.resetFields(); setIsModalOpen(true); }}>
        Register
      </Button>

      <Modal title="Register" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form layout="vertical" form={form} onFinish={registerUser}>
          <Form.Item label="Username" name="username" rules={[{ required: true, message: "Username is required!" }]}>
            <Input allowClear autoFocus type="text" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Valid email is required!" }]}>
            <Input allowClear />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 6, message: "Password must be at least 6 characters!" }]}>
            <Input.Password allowClear />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Register;
