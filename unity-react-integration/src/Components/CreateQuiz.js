import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  message,
  Divider,
  Space,
  Row,
  Col,
  InputNumber,
  Pagination,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "../Css/CreateQuiz.css"; // ⬅️ CSS file that controls scroll & layout

const { Option } = Select;

const CreateQuiz = () => {
  const [form] = Form.useForm();
  const [questionForm] = Form.useForm();
  const [questions, setQuestions] = useState([]);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [questionEditIndex, setQuestionEditIndex] = useState(null);
  const [aiTopic, setAiTopic] = useState("");
const [loadingAI, setLoadingAI] = useState(false);
const [aiQuestionCount, setAiQuestionCount] = useState(5); 
const [aiForm] = Form.useForm();
const [aiLoading, setAiLoading] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 4;




  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/quizzes");
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to load quizzes", err);
    }
  };

  const handleAddQuestion = (values) => {
    const newQ = {
      ...values,
      choices:
        values.type === "multiple_choice"
          ? [values.choiceA, values.choiceB, values.choiceC, values.choiceD]
          : undefined,
    };
  
    const updatedQuestions = [...questions];
  
    if (questionEditIndex !== null) {
      updatedQuestions[questionEditIndex] = newQ;
      setQuestionEditIndex(null);
    } else {
      updatedQuestions.push(newQ);
    }
  
    setQuestions(updatedQuestions);
    questionForm.resetFields();
  };

  const handleSubmitQuiz = async (values) => {
    const payload = {
      quizname: values.title,
      description: values.description,
      category: values.category,
      questions,
    };

    try {
      if (editingQuizId) {
        await axios.put(`http://localhost:5000/api/quizzes/${editingQuizId}`, payload);
        message.success("✅ Quiz updated!");
      } else {
        await axios.post("http://localhost:5000/api/quizzes/create", payload);
        message.success("✅ Quiz created!");
      }

      form.resetFields();
      questionForm.resetFields();
      setQuestions([]);
      setEditingQuizId(null);
      fetchQuizzes();
    } catch (err) {
      console.error("❌ Quiz save error:", err);
      message.error("❌ Failed to save quiz.");
    }
  };

  const handleEditQuiz = (quiz) => {
    form.setFieldsValue({
      title: quiz.quizname,
      description: quiz.description,
      category: quiz.category,
    });
    setQuestions(quiz.questions);
    setEditingQuizId(quiz._id);
  };

  const handleDeleteQuiz = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/quizzes/${id}`);
      message.success("🗑️ Quiz deleted");
      fetchQuizzes();
    } catch (err) {
      message.error("❌ Could not delete quiz");
    }
  };
  const handleAIGenerate = async (values) => {
    const { topic, count } = values;
    setAiLoading(true);
  
    try {
      const res = await axios.post("http://localhost:5000/api/ai/generate-questions", {
        topic,
        count,
      });
  
      const generated = res.data;
  
      setQuestions((prev) => [...prev, ...generated]); // assuming setQuestions exists
      message.success("✅ Questions generated!");
      aiForm.resetFields();
    } catch (err) {
      console.error("❌ AI generation failed", err);
      message.error("❌ Failed to generate questions.");
    } finally {
      setAiLoading(false);
    }
  };
  const filteredQuizzes = quizzes.filter((q) =>
  q.quizname.toLowerCase().includes(searchTerm.toLowerCase())
);

const paginatedQuizzes = filteredQuizzes.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

  

  return (
    <div className="create-quiz-page-wrapper">
      <Card
  title={
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span>📚 Existing Quizzes</span>
      {editingQuizId && (
        <Button
          type="default"
          size="small"
          onClick={() => {
            form.resetFields();
            questionForm.resetFields();
            setQuestions([]);
            setEditingQuizId(null);
          }}
        >
          🔙 Back to Create New
        </Button>
      )}
    </div>
  }
  style={{ marginBottom: 24 }}
>
  <Input
    placeholder="🔍 Search quizzes..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1); // reset pagination on new search
    }}
    style={{ marginBottom: 16 }}
  />

  {filteredQuizzes.length === 0 ? (
    <p>No quizzes found.</p>
  ) : (
    <>
      <Row gutter={[16, 16]}>
        {paginatedQuizzes.map((q) => (
          <Col key={q._id} xs={24} sm={12} md={8} lg={6}>
            <Card
              title={<strong>{q.quizname}</strong>}
              extra={<span style={{ fontStyle: "italic" }}>{q.category}</span>}
              size="small"
              actions={[
                <Button type="link" onClick={() => handleEditQuiz(q)}>
                  ✏️ Edit
                </Button>,
                <Button danger type="link" onClick={() => handleDeleteQuiz(q._id)}>
                  🗑️ Delete
                </Button>,
              ]}
            />
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredQuizzes.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  )}
</Card>

      <Card
  title="🤖 Generate Questions with AI"
  style={{ marginBottom: 24 }}
>
  <Form
    layout="inline"
    form={aiForm}
    onFinish={handleAIGenerate}
    style={{ flexWrap: "wrap", gap: 12 }}
  >
    <Form.Item
      name="topic"
      rules={[{ required: true, message: "Topic required" }]}
    >
      <Input
        placeholder="e.g. Space, Biology, History..."
        style={{ minWidth: 250 }}
      />
    </Form.Item>

    <Form.Item
      name="count"
      initialValue={3}
      rules={[{ required: true }]}
    >
      <InputNumber min={1} max={10} style={{ width: 80 }} />
    </Form.Item>

    <Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        loading={aiLoading}
        icon={<PlusOutlined />}
      >
        Generate
      </Button>
    </Form.Item>
  </Form>
</Card>



      <div className="create-quiz-layout">
        {/* Quiz Info */}
        <Card title="🧠 Quiz Info" style={{ width: 300 }}>
          <Form form={form} layout="vertical" onFinish={handleSubmitQuiz}>
            <Form.Item label="Quiz Title" name="title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item label="Category" name="category" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {editingQuizId ? "Update Quiz" : "Create Quiz"}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Question Builder */}
        <Card title="➕ Add a Question" style={{ flex: 1 }}>
          <Form form={questionForm} layout="vertical" onFinish={handleAddQuestion}>
            <Form.Item label="Question Text" name="question" rules={[{ required: true }]}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Question Type" name="type" rules={[{ required: true }]}>
              <Select placeholder="Select type">
                <Option value="multiple_choice">Multiple Choice</Option>
                <Option value="true_false">True / False</Option>
                <Option value="fill_in_the_blank">Fill in the Blank</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Difficulty" name="difficulty" rules={[{ required: true }]}>
              <Select placeholder="Select difficulty">
                <Option value="easy">Easy</Option>
                <Option value="medium">Medium</Option>
                <Option value="hard">Hard</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Correct Answer" name="correct_answer" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            {/* Conditional MCQ */}
            <Form.Item shouldUpdate noStyle>
              {() => {
                const type = questionForm.getFieldValue("type");
                return type === "multiple_choice" ? (
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Form.Item name="choiceA" label="Choice A" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="choiceB" label="Choice B" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="choiceC" label="Choice C" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="choiceD" label="Choice D" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Space>
                ) : null;
              }}
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit" icon={<PlusOutlined />} block>
                Add Question
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Question Preview */}
        <Card title="📝 Questions" style={{ width: 300 }}>
          {questions.length === 0 ? (
            <p>No questions yet.</p>
          ) : (
            questions.map((q, i) => (
              <Card
                size="small"
                key={i}
                style={{ marginBottom: 8 }}
                title={<b>Q{i + 1}:</b>}
                extra={
                  <Space>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        questionForm.setFieldsValue({
                          ...q,
                          choiceA: q.choices?.[0],
                          choiceB: q.choices?.[1],
                          choiceC: q.choices?.[2],
                          choiceD: q.choices?.[3],
                        });
                        setQuestionEditIndex(i); 
                      }}
                    >
                      ✏️
                    </Button>
                    <Button
                      danger
                      type="link"
                      size="small"
                      onClick={() => {
                        const updated = [...questions];
                        updated.splice(i, 1);
                        setQuestions(updated);
                      }}
                    >
                      🗑️
                    </Button>
                  </Space>
                }
              >
                <div>{q.question}</div>
                <div style={{ fontStyle: "italic", color: "#555" }}>
                  {q.type} • {q.difficulty}
                </div>
              </Card>
            ))
          )}
        </Card>
      </div>
    </div>
  );
};

export default CreateQuiz;
