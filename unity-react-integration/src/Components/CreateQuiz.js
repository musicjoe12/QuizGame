import React from "react";
import { Card, Form, Input, Button, message } from "antd";
import axios from "axios";

const CreateQuiz = () => {
  const [form] = Form.useForm();

  const createQuiz = async (values) => {
    console.log("📤 Sending quiz data:", values);
    
    axios.post("http://localhost:5001/api/quizzes/create", values)
      .then(response => {
        console.log("✅ Quiz created successfully:", response.data);
        message.success("✅ Quiz Created!");
        form.resetFields();
      })
      .catch(error => {
        console.error("❌ Error creating quiz:", error);
        message.error("❌ Failed to create quiz.");
      });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Card title="📝 Create Quiz" style={{ width: 600 }}>
        <Form layout="vertical" form={form} onFinish={createQuiz}>
          <Form.Item label="Quiz Title" name="title" rules={[{ required: true, message: "Title is required!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: "Description is required!" }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Quiz
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateQuiz;
