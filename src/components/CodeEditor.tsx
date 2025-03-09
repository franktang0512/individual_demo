import { useCallback, useMemo, useRef, useState } from "react";
import { useEffect } from 'react';
import { Workspace } from "blockly";
// import * as Blockly from "blockly/core";

import * as Blockly from "blockly";
import { useWorkspaceStore } from "@/stores/workspace";
import {
  BlocklyWorkspace,
  BlocklyWorkspaceRef,
} from "@/components/BlocklyWorkspace";
import {
  blocklyTheme,
  blocklyToolboxConfig,
  initialBlocklyWorkspace,
} from "@/lib/blockly-workspace/blockly";
import {
  scratchTheme,
  scratchToolboxConfig,
  initialScratchWorkspace,
  variableFlyoutCallback,
  listFlyoutCallback,
  functionFlyoutCallback,
} from "@/lib/blockly-workspace/scratch";
import { initiateBlocklyWorkspace } from "@/lib/blockly-workspace/init";
import { javascriptGenerator } from "blockly/javascript";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { colors } from "@/lib/colors";
import { ScratchFunctionCreationDialog } from "./ScratchFunctionCreationDialog";
import type {
  ScratchFunctionBlock,
  ScratchFunctionBlockJson,
} from "@/lib/types";

// initiateBlocklyWorkspace();

export function CodeEditor() {
  const workspaceRef = useRef<BlocklyWorkspaceRef>(null);
  const currentMode = useWorkspaceStore((state) => state.currentMode);
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const setCurrentMode = useWorkspaceStore((state) => state.setCurrentMode);
  const setGeneratedCode = useWorkspaceStore((state) => state.setGeneratedCode);
  const setGeneratedXMLCode = useWorkspaceStore((state) => state.setGeneratedXMLCode);
  
  const setRecordXMLCode = useWorkspaceStore((state) => state.setRecordXMLCode);
  const lastanswerXML = useWorkspaceStore((state) => state.generatedXMLCode); // ✅ 取得 lastanswerXML
  
  const recordXML = useWorkspaceStore((state) => state.recordXMLCode); // ✅ 應該取的是 XML 資料
  const [isFunctionDialogOpen, setIsFunctionDialogOpen] = useState(false);

  const handleCreateFunction = useCallback(
    (blockJson: ScratchFunctionBlockJson) => {
      const workspace = workspaceRef.current?.getWorkspace();
      if (!workspace) return;

      try {
        const definitionBlock = workspace.newBlock(
          "scratch_function_definition"
        ) as ScratchFunctionBlock;

        // Set the name
        definitionBlock.setFieldValue(blockJson.fields.NAME, "NAME");

        // Add parameters
        if (blockJson.parameters_) {
          blockJson.parameters_.forEach((param) => {
            definitionBlock.addParameter(param.name, param.type);
          });
        }

        // Initialize and position the block
        definitionBlock.initSvg();
        definitionBlock.render();

        // Position in view
        const metrics = workspace.getMetrics();
        const xy = workspace.getOriginOffsetInPixels();
        definitionBlock.moveBy(
          xy.x + (metrics?.viewWidth || 0) / 3,
          xy.y + (metrics?.viewHeight || 0) / 4
        );

        workspace.refreshToolboxSelection();
      } catch (error) {
        console.error("Error creating function:", error);
      }
    },
    []
  );
  useEffect(() => {
    initiateBlocklyWorkspace(); // ✅ 根據模式載入對應的環境
  }, [currentMode]); // 🔥 當 `currentMode` 變更時，重新初始化 Blockly 或 Scratch
  // ✅ 這個函數讓 `RecordTab.tsx` 可以直接載入 XML
  const loadXMLToWorkspace = useCallback((xmlString: string) => {
    if (!xmlString || !workspaceRef.current) return;
  
    // console.log("🚀 透過 RecordTab 載入 XML 到 Blockly:", xmlString);
    try {
      const workspace = workspaceRef.current.getWorkspace();
      if (workspace) {
        workspace.clear(); // ✅ 清除舊積木
        const xmlDom = Blockly.utils.xml.textToDom(xmlString);
  
        // console.log("==========in codeeditor=======");
        // console.log(xmlDom);
        // console.log("==========in codeeditor=======");
  
        Blockly.Xml.domToWorkspace(xmlDom, workspace); // ✅ 避免累加載入
        workspace.render();  // 🔥 **強制 Blockly 重新渲染**
        workspace.resize();  // 🔥 **確保 UI 更新**
        workspace.markFocused(); // 🔥 **讓 Blockly UI 確認已載入新 XML**
      }
    } catch (error) {
      console.error("❌ 解析 XML 失敗:", error);
    }
  }, []);


  const handleWorkspaceChange = useCallback(
    (workspace: Workspace) => {
      const code = javascriptGenerator.workspaceToCode(workspace);
      
      setGeneratedCode(code);

      const xmlDom = Blockly.Xml.workspaceToDom(workspace); // 轉成 DOM 物件
      // const xmlText = Blockly.Xml.domToText(xmlDom); // 轉成 XML 字串
      const xmlText = Blockly.Xml.domToPrettyText(xmlDom); // 轉成 XML 字串
      
      setGeneratedXMLCode(xmlText); // 存到 Zustand
      

      // @ts-expect-error: Save generated code globally for debugging purposes
      window.generatedCode = code;
    },
    [setGeneratedCode,setGeneratedXMLCode]
  );

  const handleJsonChange = useCallback(
    (workspaceJson: object) => {
      if (Object.keys(workspaceJson).length > 0) {
        if (currentMode === "Scratch") {
          /**
           * Workaround to duplicated scratch_function_param blocks on deserialization.
           * Basically we just don't serialize the function parameters
           */
          // @ts-expect-error: it exists for sure (Blockly v11.2.0)
          for (const block of Object.values(workspaceJson.blocks.blocks)) {
            // @ts-expect-error: it exists for sure
            if (block.type === "scratch_function_definition") {
              // @ts-expect-error: it exists for sure
              for (const [key, value] of Object.entries(block.inputs)) {
                // prettier-ignore
                // @ts-expect-error: it exists for sure
                if (value && value.block && value.block.type === "scratch_function_param") {
                  // @ts-expect-error: it exists for sure
                  delete block.inputs[key];
                }
              }
            }
          }
        }
        setWorkspace(currentMode, workspaceJson);
      }
    },
    [currentMode, setWorkspace]
  );

  const toggleEditorMode = () => {
    setCurrentMode(currentMode === "Blockly" ? "Scratch" : "Blockly");
  };

  const getInitialWorkspace = useCallback((mode: "Blockly" | "Scratch") => {
    const state = useWorkspaceStore.getState();
    const savedWorkspace =
      mode === "Blockly" ? state.blocklyWorkspace : state.scratchWorkspace;

    if (savedWorkspace && Object.keys(savedWorkspace).length > 0) {
      return savedWorkspace;
    }

    return mode === "Blockly"
      ? initialBlocklyWorkspace
      : initialScratchWorkspace;
  }, []);

  const workspaceConfiguration: Blockly.BlocklyOptions = useMemo(
    () => ({
      theme: currentMode === "Scratch" ? scratchTheme : blocklyTheme,
      renderer: currentMode === "Scratch" ? "zelos" : "geras",
      grid: {
        spacing: 20,
        length: 3,
        colour: colors.gray[300],
        snap: true,
      },
      trashcan: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      move: {
        scrollbars: true,
        drag: true,
        wheel: true,
      },
      readOnly: false,
    }),
    [currentMode]
  );

  const toolboxConfiguration = useMemo(
    () =>
      currentMode === "Scratch" ? scratchToolboxConfig : blocklyToolboxConfig,
    [currentMode]
  );

  const handleWorkspaceInject = useCallback(
    (workspace: Blockly.WorkspaceSvg) => {
      if (currentMode === "Scratch") {
        // On scratch mode, register custom flyout and button for variables, lists and functions
        workspace.registerToolboxCategoryCallback(
          "SCRATCH_VARIABLE",
          variableFlyoutCallback,
        );
        workspace.registerButtonCallback("CREATE_SCRATCH_VARIABLE", () => {
          Blockly.Variables.createVariableButtonHandler(
            workspace,
            undefined,
            "",
          );
        });
        workspace.registerToolboxCategoryCallback(
          "SCRATCH_LIST",
          listFlyoutCallback,
        );
        workspace.registerButtonCallback("CREATE_SCRATCH_LIST", () => {
          Blockly.Variables.createVariableButtonHandler(
            workspace,
            undefined,
            "list",
          );
        });
        workspace.registerToolboxCategoryCallback(
          "SCRATCH_FUNCTION",
          functionFlyoutCallback,
        );
        workspace.registerButtonCallback("CREATE_SCRATCH_FUNCTION", () => {
          setIsFunctionDialogOpen(true);
        });
      }
    },
    [currentMode],
  );

const handleWorkspaceDispose = useCallback(
    (workspace: Blockly.WorkspaceSvg) => {
      workspace.removeToolboxCategoryCallback("SCRATCH_VARIABLE");
      workspace.removeButtonCallback("CREATE_SCRATCH_VARIABLE");
      workspace.removeToolboxCategoryCallback("SCRATCH_LIST");
      workspace.removeButtonCallback("CREATE_SCRATCH_LIST");
      workspace.removeToolboxCategoryCallback("SCRATCH_FUNCTION");
      workspace.removeButtonCallback("CREATE_SCRATCH_FUNCTION");
    },
    [],
  );


  useEffect(() => {
    if (!recordXML || !workspaceRef.current) return;

    // console.log("🚀 透過 RecordTab 載入新的 XML");

    try {
      const workspace = workspaceRef.current.getWorkspace();
      if (workspace) {
        workspace.clear(); // ✅ 清除當前積木，確保載入乾淨
        setWorkspace("Blockly", {}); // ✅ 清空記錄，防止干擾
        setWorkspace("Scratch", {});

        const xmlDom = Blockly.utils.xml.textToDom(recordXML);
        // console.log("這是code街道的",recordXML);
        Blockly.Xml.domToWorkspace(xmlDom, workspace);
        
      }
    } catch (error) {
      console.error("❌ 解析 recordXML 失敗:", error);
    }
  }, [recordXML]); // ✅ **只有點選 RecordTab 按鈕時才執行**


    useEffect(() => {
    return () => {
      // console.log("🚀 離開 Question 頁面，清除 CodeEditor 狀態");
  
      const workspace = workspaceRef.current?.getWorkspace();
      if (workspace) {
        workspace.clear(); // ✅ 清除 Blockly 畫布
      }
  
      // ✅ 清空存儲的 XML 和代碼，防止返回時載入
      // setGeneratedCode("");
      // setGeneratedXMLCode("");
      // setRecordXMLCode("");
      setWorkspace("Blockly", {});
      setWorkspace("Scratch", {});
  
      // console.log("✅ Blockly 狀態已清除");
    };
  }, []);

  useEffect(() => {
    if (!lastanswerXML || !workspaceRef.current) return;

    // console.log("🚀 載入 lastanswerXML 到 Blockly");


    try {
      const workspace = workspaceRef.current.getWorkspace();
      // console.log("1");

      if (workspace) {
        // console.log("2");
        workspace.clear(); // ✅ 先清除舊工作區



        setWorkspace("Blockly", {}); // ⚡ 設為空物件，防止切換時恢復
        setWorkspace("Scratch", {}); // ⚡ 也清空 Scratch，確保不會被載入
        // console.log("3");
        const xmlDom = Blockly.utils.xml.textToDom(lastanswerXML);
        // console.log("4");
        Blockly.Xml.domToWorkspace(xmlDom, workspace); // ✅ 載入新的 XML
        // console.log("5");
        // 重新產生 JavaScript 程式碼
        // const generatedCode = Blockly.JavaScript.workspaceToCode(workspace);
        // console.log(generatedCode);
        // setGeneratedCode(generatedCode);
      }
    } catch (error) {
      console.error("❌ 解析 XML 失敗:", error);
    }
  }, []/*[lastanswerXML]*/); // 🔥 監聽 lastanswerXML 變化




  return (
    <div className="relative h-full w-full">
      <Button
        className="absolute right-4 top-4 z-50 w-28 rounded-full bg-gray-300 bg-opacity-50 px-4 py-2 hover:bg-gray-400 hover:text-gray-950"
        onClick={toggleEditorMode}
      >
        <div className="flex items-center gap-2 text-gray-800">
          <span>{currentMode}</span>
          <RefreshCw />
        </div>
      </Button>
      <BlocklyWorkspace
        key={currentMode}
        ref={workspaceRef}
        className="h-full w-full p-0"
        toolboxConfiguration={toolboxConfiguration}
        workspaceConfiguration={workspaceConfiguration}
        initialJson={getInitialWorkspace(currentMode)}
        onWorkspaceChange={handleWorkspaceChange}
        onJsonChange={handleJsonChange}
        onInject={handleWorkspaceInject}
        onDispose={handleWorkspaceDispose}
      />
      <ScratchFunctionCreationDialog
        isOpen={isFunctionDialogOpen}
        onOpenChange={setIsFunctionDialogOpen}
        onConfirm={handleCreateFunction}
      />
    </div>
  );
}
