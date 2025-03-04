import { useCallback, useMemo, useRef, useState } from "react";
import { Workspace } from "blockly";
import * as Blockly from "blockly/core";
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

initiateBlocklyWorkspace();

export function CodeEditor() {
  const workspaceRef = useRef<BlocklyWorkspaceRef>(null);
  const currentMode = useWorkspaceStore((state) => state.currentMode);
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const setCurrentMode = useWorkspaceStore((state) => state.setCurrentMode);
  const setGeneratedCode = useWorkspaceStore((state) => state.setGeneratedCode);
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

  const handleWorkspaceChange = useCallback(
    (workspace: Workspace) => {
      const code = javascriptGenerator.workspaceToCode(workspace);
      setGeneratedCode(code);

      // @ts-expect-error: Save generated code globally for debugging purposes
      window.generatedCode = code;
    },
    [setGeneratedCode]
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
    const userConfirmed = window.confirm("⚠️切換程式後，目前的程式積木將會被清除！是否確定切換？⚠️");
    if (!userConfirmed) return; // 使用者取消切換

    const workspace = workspaceRef.current?.getWorkspace();
    if (!workspace) return;

    // 1️⃣ **清理垃圾桶內的積木**
    workspace.clearUndo(); 
    workspace.getTopBlocks(false).forEach((block) => {
        if (block.isDeletable()) {
            block.dispose(true); // 確保刪除
        }
    });

    // 2️⃣ **切換模式**
    const newMode = currentMode === "Blockly" ? "Scratch" : "Blockly";
    setCurrentMode(newMode);

    // 3️⃣ **載入新模式的預設 Workspace（避免載入舊的）**
    const initialWorkspace = newMode === "Blockly" ? initialBlocklyWorkspace : initialScratchWorkspace;
    setWorkspace(newMode, initialWorkspace);
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
        // On scratch mode, register custom flyout and button for lists and functions
        workspace.registerToolboxCategoryCallback(
          "SCRATCH_LIST",
          listFlyoutCallback
        );
        workspace.registerButtonCallback("CREATE_SCRATCH_LIST", () => {
          Blockly.Variables.createVariableButtonHandler(
            workspace,
            undefined,
            "list"
          );
        });
        workspace.registerToolboxCategoryCallback(
          "SCRATCH_FUNCTION",
          functionFlyoutCallback
        );
        workspace.registerButtonCallback("CREATE_SCRATCH_FUNCTION", () => {
          setIsFunctionDialogOpen(true);
        });
      }
    },
    [currentMode]
  );

  const handleWorkspaceDispose = useCallback(
    (workspace: Blockly.WorkspaceSvg) => {
      workspace.removeToolboxCategoryCallback("SCRATCH_LIST");
      workspace.removeButtonCallback("CREATE_SCRATCH_LIST");
      workspace.removeToolboxCategoryCallback("SCRATCH_FUNCTION");
      workspace.removeButtonCallback("CREATE_SCRATCH_FUNCTION");
    },
    []
  );

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