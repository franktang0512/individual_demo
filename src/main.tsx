import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";  // 引入 App 元件
import "./index.css";

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />  {/* 渲染 App */}
    </StrictMode>
  );
}