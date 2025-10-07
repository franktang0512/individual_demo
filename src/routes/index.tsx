import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import icon1 from "@/assets/icons/1.png";
import icon2 from "@/assets/icons/2.png";
import extra from "@/assets/icons/extra.png";
import inputguide from "@/assets/icons/inputguide.png";

interface Question {
  id: number;
  name: string;
  iconUrl: string;
}

const questionList: Question[] = [
  { id: 1, name: "可口便當", iconUrl: icon1 },
  { id: 2, name: "短片欣賞", iconUrl: icon2 },
  { id: 3, name: "空白題", iconUrl: extra },
];

function Index() {
  const [open, setOpen] = useState(false);

  // ESC 關閉
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[88rem] px-2 sm:px-4 py-2 md:py-3">
        <div className="flex flex-col items-center">

          {/* 三個題目卡片：等比例放大 1.15x（維持原來比例） */}
          <div className="-mt-6 md:-mt-8 mb-2 md:mb-3 grid grid-cols-3 gap-3 mx-auto">
            {questionList.map((q) => (
              <Link
                key={q.id}
                to="/$questionId"
                params={{ questionId: String(q.id) }}
                className="
                  relative bg-white rounded-[12px]
                  shadow-[0_3px_8px_rgba(0,0,0,0.08)]
                  text-center
                  w-[168px] sm:w-[176px]      /* 146px × 1.15 ≈ 168 */
                  h-[101px]                   /* 88px × 1.15 ≈ 101 */
                  pt-[30px]                   /* 26px × 1.15 ≈ 30 */
                  flex flex-col items-center justify-start
                  transition
                  hover:bg-cyan-100/70 hover:shadow-[0_8px_18px_rgba(0,0,0,0.18)]
                  focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/50
                  active:scale-[0.985]
                "
              >
                <img
                  src={q.iconUrl}
                  alt={q.name}
                  className="w-[64px] h-[64px] absolute -top-[23px] left-1/2 -translate-x-1/2 select-none pointer-events-none"
                  draggable={false}
                />
                <h3 className="text-[1.1rem] text-[#5A3E36] mt-[14px] font-semibold tracking-wide">
                  {q.name}
                </h3>
              </Link>
            ))}
          </div>

          {/* 輸入說明：滿版放大（維持你剛要的 full-bleed） */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="
              mt-1
              w-full
              -mx-2 sm:-mx-4 md:-mx-6 lg:-mx-8
              rounded-none sm:rounded-lg
              ring-0 sm:ring-1 sm:ring-black/5 hover:sm:ring-black/10
              transition
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60
              overflow-hidden
            "
            aria-label="放大檢視輸入說明圖片"
          >
            <img
              src={inputguide}
              alt="輸入說明"
              loading="lazy"
              decoding="async"
              className="block w-full h-auto object-contain max-h-[88vh]"
            />
          </button>
        </div>
      </div>

      {/* 放大檢視 Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-[98vw] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="關閉"
              onClick={() => setOpen(false)}
              className="
                absolute -top-2 -right-2 sm:-top-3 sm:-right-3
                h-8 w-8 rounded-full bg-white shadow
                grid place-items-center text-gray-700
                hover:scale-105 active:scale-95 transition
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60
              "
            >
              ✕
            </button>
            <img
              src={inputguide}
              alt="輸入說明（放大）"
              className="w-full h-auto rounded-lg shadow-xl select-none max-w-[98vw] max-h-[92vh]"
              draggable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
