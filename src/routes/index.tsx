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
            className="w-40 p-4 text-center shadow-md gap-4 bg-gray-50 flex flex-col justify-between rounded-lg hover:shadow-xl"
          >
            <img
              src={question.iconUrl}
              alt={question.name}
              className={cn("flex-1", question.id === 2 && "ml-3")} // question 2 的圖不在正中間，需要調整位置
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
