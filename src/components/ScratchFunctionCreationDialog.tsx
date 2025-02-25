import { useRef, useState } from "react";
import * as Blockly from "blockly/core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { BlocklyWorkspace } from "./BlocklyWorkspace";
import { scratchTheme } from "@/lib/blockly-workspace/scratch";
import { colors } from "@/lib/colors";
import {
  ScratchFunctionBlock,
  ScratchFunctionBlockJson,
  ScratchFunctionParameter,
} from "@/lib/types";
import { X } from "lucide-react";

interface FunctionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (functionBlock: ScratchFunctionBlockJson) => void;
}

const functionToolboxConfiguration = {
  kind: "categoryToolbox",
  contents: [],
};

export function ScratchFunctionCreationDialog({
  isOpen,
  onOpenChange,
  onConfirm,
}: FunctionDialogProps) {
  const functionWorkspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [functionName, setFunctionName] = useState("新積木");
  const [parameters, setParameters] = useState<ScratchFunctionParameter[]>([]);

  const handleFunctionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFunctionName(newName);

    const workspace = functionWorkspaceRef.current;
    if (workspace) {
      const functionBlock = workspace.getBlocksByType(
        "scratch_function_create"
      )[0];
      if (functionBlock) {
        functionBlock.setFieldValue(newName, "NAME");
      }
    }
  };

  const validateAndAddArgument = (
    paramName: string | null,
    type: ScratchFunctionParameter["type"]
  ) => {
    if (paramName === null || paramName === undefined) return false;

    paramName = paramName.trim();

    if (paramName === "") {
      alert("參數名稱不能為空白");
      return false;
    }

    if (parameters.some((param) => param.name === paramName)) {
      alert("參數名稱重複");
      return false;
    }

    const workspace = functionWorkspaceRef.current;
    if (!workspace) return false;

    const functionBlock = workspace.getBlocksByType(
      "scratch_function_create"
    )[0] as ScratchFunctionBlock;
    if (functionBlock) {
      functionBlock.addParameter(paramName, type);
      setParameters((prev) => [...prev, { name: paramName, type }]);
      return true;
    }

    return false;
  };

  const handleAddNumberStringInput = () => {
    Blockly.dialog.prompt("輸入參數名稱:", "", (newName) => {
      validateAndAddArgument(newName, "NumberString");
    });
  };

  const handleAddBooleanInput = () => {
    Blockly.dialog.prompt("輸入參數名稱:", "", (newName) => {
      validateAndAddArgument(newName, "Boolean");
    });
  };

  const handleAddTextLabel = () => {
    Blockly.dialog.prompt("輸入說明文字:", "", (newName) => {
      validateAndAddArgument(newName, "Label");
    });
  };

  const handleDeleteParameter = (paramName: string) => {
    setParameters((prev) => prev.filter((param) => param.name !== paramName));
  };

  const handleConfirm = () => {
    const workspace = functionWorkspaceRef.current;
    if (!workspace) return;

    const functionBlock = workspace.getBlocksByType(
      "scratch_function_create"
    )[0] as ScratchFunctionBlock;
    if (!functionBlock) return;

    const name = functionBlock.getFieldValue("NAME");
    if (!name || name.trim() === "") {
      alert("請輸入積木名稱");
      return;
    }

    const blockJson: ScratchFunctionBlockJson = {
      type: "scratch_function_definition",
      fields: {
        NAME: name,
      },
      parameters_: functionBlock.parameters_,
    };

    onConfirm(blockJson);
    closeDialog();
  };

  const closeDialog = () => {
    setParameters([]);
    setFunctionName("新積木");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        overlay={false}
        showCloseButton={false}
        className="max-w-3xl gap-0 p-0 shadow-2xl"
      >
        <DialogHeader className="rounded-t-lg bg-gray-300 p-4">
          <DialogTitle className="text-center text-2xl">
            建立一個積木
          </DialogTitle>
          <DialogDescription className="hidden">建立函式積木</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <label className="text-xl font-medium">積木名稱</label>
            <Input
              className="py-6 text-3xl"
              value={functionName}
              onChange={handleFunctionNameChange}
              placeholder="輸入積木名稱"
            />
          </div>

          <div>
            <h3 className="mb-2 text-xl font-medium">參數列表</h3>
            <ul className="flex flex-wrap gap-2">
              {parameters.map((param) => (
                <li key={param.name}>
                  <button
                    className={`inline-flex items-center gap-1 bg-gray-300 px-4 py-2 text-xs text-gray-800 transition-colors hover:bg-gray-800 hover:text-gray-200 ${
                      param.type === "NumberString"
                        ? "rounded-full"
                        : param.type === "Label"
                          ? "rounded-sm"
                          : ""
                    }`}
                    style={
                      param.type === "Boolean"
                        ? {
                            clipPath:
                              "polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)",
                          }
                        : undefined
                    }
                    onClick={() => handleDeleteParameter(param.name)}
                  >
                    <span className="max-w-[60px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {param.name}
                    </span>
                    <X size={12} className="shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-48 rounded border">
            <div className="absolute inset-0 z-[60]">
              <BlocklyWorkspace
                toolboxConfiguration={functionToolboxConfiguration}
                workspaceConfiguration={{
                  readOnly: false,
                  theme: scratchTheme,
                  renderer: "zelos",
                  grid: {
                    spacing: 20,
                    length: 3,
                    colour: colors.gray[300],
                    snap: true,
                  },
                  trashcan: false,
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
                }}
                onInject={(workspace) => {
                  functionWorkspaceRef.current = workspace;

                  const functionBlock = workspace.newBlock(
                    "scratch_function_create"
                  ) as ScratchFunctionBlock;
                  functionBlock.setFieldValue(functionName, "NAME");

                  parameters.forEach((param) => {
                    functionBlock.addParameter(param.name, param.type);
                    functionBlock.initSvg(); // record input slot's shape
                  });

                  functionBlock.initSvg();
                  functionBlock.render();

                  workspace.scrollCenter();
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Button
              className="flex flex-col gap-2 bg-gray-300 py-16 text-gray-800 hover:bg-gray-800 hover:text-gray-200"
              onClick={handleAddNumberStringInput}
            >
              <span className="text-xl">添加輸入方塊</span>
              <span className="text-lg">數字或文字</span>
            </Button>
            <Button
              className="flex flex-col gap-2 bg-gray-300 py-16 text-gray-800 hover:bg-gray-800 hover:text-gray-200"
              onClick={handleAddBooleanInput}
            >
              <span className="text-xl">添加輸入方塊</span>
              <span className="text-lg">布林值</span>
            </Button>
            <Button
              className="bg-gray-300 py-16 text-gray-800 hover:bg-gray-800 hover:text-gray-200"
              onClick={handleAddTextLabel}
            >
              <span className="text-xl">添加說明文字</span>
            </Button>
          </div>
        </div>

        <DialogFooter className="p-4">
          <Button
            variant="outline"
            className="text-lg"
            size="lg"
            onClick={closeDialog}
          >
            取消
          </Button>
          <Button
            className="bg-gray-300 text-xl text-gray-800 hover:bg-gray-800 hover:text-gray-200"
            size="lg"
            onClick={handleConfirm}
          >
            確定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
