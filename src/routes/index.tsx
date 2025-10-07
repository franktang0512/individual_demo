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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="flex flex-col items-center">

          {/* 三個題目卡片（略縮小 + 整塊往上提） */}
          <div
            className="
              -mt-4 md:-mt-8                 /* 往上提 */
              mb-4 md:mb-6                   /* 與下方圖片保留距離 */
              grid grid-cols-2 md:grid-cols-3
              gap-3 sm:gap-4 mx-auto
            "
          >
            {questionList.map((q) => (
              <Link
                key={q.id}
                to="/$questionId"
                params={{ questionId: String(q.id) }}
                className="
                  relative bg-white rounded-[12px]
                  shadow-[0_3px_8px_rgba(0,0,0,0.08)]
                  text-center w-[146px] sm:w-[158px] h-[88px]
                  pt-[26px] flex flex-col items-center justify-start
                  transition
                  hover:bg-cyan-100/70 hover:shadow-[0_8px_18px_rgba(0,0,0,0.18)]
                  focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/50
                  active:scale-[0.98]
                "
              >
                <img
                  src={q.iconUrl}
                  alt={q.name}
                  className="w-14 h-14 absolute -top-5 left-1/2 -translate-x-1/2 select-none pointer-events-none"
                  draggable={false}
                />
                <h3 className="text-[0.95rem] sm:text-[1.05rem] text-[#5A3E36] mt-3 font-semibold tracking-wide">
                  {q.name}
                </h3>
              </Link>
            ))}
          </div>

          {/* 輸入說明圖片：固定在題目下方（正的上邊距）＋可放大 */}
          <button
  type="button"
  onClick={() => setOpen(true)}
  className="
    mt-0 md:mt-0
    w-[92%] md:w-[80%] lg:w-[70%]   /* ✅ 用百分比控制寬度 */
    mx-auto                         /* ✅ 置中 */
    rounded-xl
    ring-1 ring-black/5 hover:ring-black/10
    transition
    focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/50
    overflow-hidden
  "
  aria-label="放大檢視輸入說明圖片"
>
  <img
    src={inputguide}
    alt="輸入說明"
    loading="lazy"
    decoding="async"
    className="w-full h-auto object-contain max-h-72 sm:max-h-80"
  />
</button>
        </div>
      </div>

      {/* 放大檢視 Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="關閉"
              onClick={() => setOpen(false)}
              className="
                absolute -top-3 -right-3 sm:-top-4 sm:-right-4
                h-10 w-10 rounded-full bg-white shadow
                grid place-items-center text-gray-700
                hover:scale-105 active:scale-95 transition
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/50
              "
            >
              ✕
            </button>
            <img
              src={inputguide}
              alt="輸入說明（放大）"
              className="w-full h-auto rounded-xl shadow-xl select-none"
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
