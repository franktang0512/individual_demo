import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceState {
  blocklyWorkspace: object | null;
  scratchWorkspace: object | null;
  currentMode: "Blockly" | "Scratch";
  generatedCode: string;
  generatedXMLCode: string;
  recordXMLCode: string;
  shouldLoadXML: boolean; // ✅ 加入 shouldLoadXML

  setWorkspace: (mode: "Blockly" | "Scratch", workspace: object) => void;
  setCurrentMode: (mode: "Blockly" | "Scratch") => void;
  setGeneratedCode: (code: string) => void;
  setGeneratedXMLCode: (code: string) => void;
  setRecordXMLCode: (code: string) => void;
  setShouldLoadXML: (shouldLoad: boolean) => void; // ✅ 新增 setter
  resetWorkspaces: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      blocklyWorkspace: null,
      scratchWorkspace: null,
      currentMode: "Blockly",
      generatedCode: "",
      generatedXMLCode: "",
      recordXMLCode: "",
      shouldLoadXML: false, // ✅ 預設 false，避免誤觸

      setWorkspace: (mode, workspace) =>
        set((_state) => ({
          ...(mode === "Blockly"
            ? { blocklyWorkspace: workspace }
            : { scratchWorkspace: workspace }),
        })),

      setCurrentMode: (mode) => set({ currentMode: mode }),

      setGeneratedCode: (code) => set({ generatedCode: code }),

      setGeneratedXMLCode: (code) => set({ generatedXMLCode: code }),

      setRecordXMLCode: (code) => set({ recordXMLCode: code }),

      setShouldLoadXML: (shouldLoad) => set({ shouldLoadXML: shouldLoad }), // ✅ 設定 shouldLoadXML

      resetWorkspaces: () =>
        set({
          blocklyWorkspace: null,
          scratchWorkspace: null,
          generatedCode: "",
          generatedXMLCode: "",
          recordXMLCode: "",
          shouldLoadXML: false, // ✅ 清除 shouldLoadXML，避免意外載入
        }),
    }),
    {
      name: "workspace-storage-v1.1",
      partialize: (state) => ({
        blocklyWorkspace: state.blocklyWorkspace,
        scratchWorkspace: state.scratchWorkspace,
        currentMode: state.currentMode,
      }),
    }
  )
);
