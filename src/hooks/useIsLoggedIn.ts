// hooks/useIsLoggedIn.ts
export const useIsLoggedIn = (): boolean => {
    const token = localStorage.getItem('authToken'); // 檢查 LocalStorage 中是否有 authToken
    return !!token; // 如果有 token，表示用戶已登入
  };