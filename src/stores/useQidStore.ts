import { create } from "zustand";

interface QidStore {
    qid: string | null;
    setQid: (qid: string) => void;
}

export const useQidStore = create<QidStore>((set) => ({
    qid: sessionStorage.getItem("qid") || null, // 🚀 讀取 sessionStorage
    setQid: (qid) => {
        sessionStorage.setItem("qid", qid); // 🚀 存入 sessionStorage
        set({ qid });
    },
}));