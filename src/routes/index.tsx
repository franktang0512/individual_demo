import { createFileRoute, Link } from "@tanstack/react-router";
import "../questions.css"
import icon1 from "@/assets/icons/1.png"
import icon2 from "@/assets/icons/2.png"
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  name: string;
  iconUrl: string;
}

// ✅ 題目清單
const questionList: Question[] = [
  { id: 1, name: "刮刮樂", iconUrl: icon1 },
  { id: 2, name: "活動分組", iconUrl: icon2 },
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
