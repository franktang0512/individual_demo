import { createFileRoute, Link } from "@tanstack/react-router";
import "../questions.css"
import icon1 from "@/assets/icons/1.png"
import icon2 from "@/assets/icons/2.png"
import blank_01 from "@/assets/icons/blank_01.png"

import { cn } from "@/lib/utils";

interface Question {
  id: number;
  name: string;
  iconUrl: string;
}

// 第一次示範賽前(20250412)題目清單
// const questionList: Question[] = [
//   { id: 1, name: "刮刮樂", iconUrl: icon1 },
//   { id: 2, name: "活動分組", iconUrl: icon2 },
// ];

//202507研習demo
const questionList: Question[] = [
  { id: 1, name: "可口便當", iconUrl: icon1 },
  { id: 2, name: "短片欣賞", iconUrl: icon2 },
  { id: 3, name: "空白題", iconUrl: blank_01 },
];

function Index() {
  return (
    <div className="questions-wrapper">
      <div className="grid-container">
        {questionList.map((question) => (
          <Link
            key={question.id}
            to="/$questionId"
            params={{ questionId: String(question.id) }}
            className="grid-item"
          >
            <img
              src={question.iconUrl}
              alt={question.name}
              className="grid-item-img"
            />
            <h3>{question.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}


export const Route = createFileRoute("/")({
  component: Index,
});
