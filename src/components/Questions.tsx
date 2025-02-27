import React from "react";
import { useNavigate } from "@tanstack/react-router";
import "../questions.css";

// ✅ 題目列表的資料類型
interface Question {
  id: number;
  name: string;
  iconUrl: string;
}

// ✅ 題目清單
const questionList: Question[] = [
  { id: 1, name: "刮刮樂", iconUrl: "/img/1.png" },
  { id: 2, name: "活動分組", iconUrl: "/img/2.png" },
];

const Questions: React.FC = () => {
  const navigate = useNavigate();

  // ✅ 點擊題目時，將 `q` 存入 `search`
  const handleQuestionClick = (id: number) => {
    navigate({ to: `/${id}` }); // 用 id 作為路由參數
    // navigate({ to: "/question", state: { id } as Record<string, unknown> });
  };

  return (
    <div className="questions-wrapper">
      {/* <div className="grid-container"> */}
      <div className="grid-container">
        {questionList.map((question) => (
          <div
            key={question.id}
            className="grid-item"
            onClick={() => handleQuestionClick(question.id)}
          >
            <img
              src={question.iconUrl}
              alt={question.name}
              className="grid-item-img"
            />
            <h3>{question.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );

};

export default Questions;
