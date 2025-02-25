
// src/routes/questions.tsx
import { createFileRoute } from '@tanstack/react-router'
import Questions from '../components/Questions'; // 引入 Login 組件
export const Route = createFileRoute('/questions')({
  component: Questions,
});