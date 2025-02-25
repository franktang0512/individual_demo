import { useLocation } from '@tanstack/react-router';
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";


export const Route = createRootRoute({
  component: () => {
    const location = useLocation();  // 使用 useLocation 來獲取當前路徑
    const [studentName, setStudentName] = useState<string>(localStorage.getItem("studentName") || "");

    // 假設學生姓名是這樣取得的
    // const studentName = "franksssssssssssss";

    useEffect(() => {
      const handleStorageChange = () => {
        setStudentName(localStorage.getItem("studentName") || "未登入");
      };

      window.addEventListener("storage", handleStorageChange);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }, []);

    return (
      <div id="app-wrapper" className="mx-auto flex h-dvh max-h-[1200px] max-w-[2000px] flex-col">
        {/* 根據路徑顯示 header，僅在 / 頁面顯示 */}
        {(location.pathname === '/' || location.pathname === '/question') && (
          <>
            <header id="app-header" className="flex justify-center items-center px-12 py-6 relative">
              {/* 左側標題 */}
              <div className="absolute left-12 flex items-center gap-2">
                <h1 className="text-xl font-semibold">全國資訊科技示範賽</h1>
                <Separator orientation="vertical" className="mx-2 h-6 bg-gray-300" />
                <span className="text-xl font-semibold text-cyan-400">個人賽 練習題</span>
              </div>

              {/* ✅ 讓按鈕絕對置中 */}
              <div className="flex justify-center">
                <Link
                  to="/questions"
                  className="rounded-full bg-white px-6 py-3 text-gray-700 transition duration-300 ease-in-out flex items-center shadow-sm hover:shadow-lg"
                >
                  {/* 圖示 */}
                  <img
                    src="img/TaskListIcon.png"
                    alt="Task List Icon"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="font-bold">任務列表</span>
                </Link>
              </div>

              {/* 右側顯示學生姓名 */}
              <div className="absolute right-12 flex items-center gap-6">
                {studentName && (
                  <div className="text-lg text-gray-700">{studentName}</div>
                )}
              </div>
            </header>
            <main id="app-main" className="grow px-8">
              <Outlet />
            </main>
          </>


        )}
        {(location.pathname === '/questions') && (
          <>
            <header id="app-header" className="flex justify-between items-center px-12 py-6">
              {/* 左側標題 */}
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">全國資訊科技示範賽</h1>
                <Separator orientation="vertical" className="mx-2 h-6 bg-gray-300" />
                <span className="text-xl font-semibold text-cyan-400">個人賽 練習題</span>
              </div>

              {/* 右側顯示學生姓名和計時器 */}
              <div className="flex items-center gap-6">
                {studentName && (
                  <div className="text-lg text-gray-700">{studentName}</div>
                )}

                {/* <div className="text-lg text-gray-700">
                剩餘時間: {formatTime(timer)}
              </div> */}
              </div>
            </header>
            <main id="app-main" className="grow px-8">
              <Outlet />
            </main>
          </>


        )}
        <Toaster />
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="flex h-full grow items-center justify-center bg-amber-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <div className="mb-8 mt-4">
          <div className="mx-auto h-1 w-16 bg-gray-400"></div>
        </div>
        <h2 className="mb-4 text-3xl font-semibold text-gray-700">
          頁面未找到
        </h2>
        <p className="mb-8 text-lg text-gray-600">
          抱歉，您要查看的頁面不存在。
        </p>
        <Link
          to="/"
          className="rounded-full bg-cyan-400 px-6 py-3 text-white transition duration-300 ease-in-out hover:bg-cyan-500"
        >
          返回首頁
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => {
    console.error(error);
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-800">錯誤</h1>
          <div className="mb-8 mt-4">
            <div className="mx-auto h-1 w-16 bg-gray-400"></div>
          </div>
          <h2 className="mb-4 text-3xl font-semibold text-gray-700">
            發生了意外錯誤
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            我們正在努力修復這個問題。
          </p>
          <Link
            to="/"
            className="rounded-full bg-cyan-400 px-6 py-3 text-white transition duration-300 ease-in-out hover:bg-cyan-500"
          >
            返回首頁
          </Link>
        </div>
      </div>
    );
  },
});











