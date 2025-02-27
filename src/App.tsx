import { routeTree } from "./routeTree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { useState } from "react";
import "./index.css";

// ✅ 建立 Router
const router = createRouter({ routeTree, basepath: "/individual/" });

// 📦 聲明 Router 型別
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 登入狀態

  return (
    <RouterProvider router={router} context={{ isLoggedIn, setIsLoggedIn }} />
  );
};

export default App;
