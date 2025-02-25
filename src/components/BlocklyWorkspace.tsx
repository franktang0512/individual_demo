import * as Blockly from "blockly/core";
import { WorkspaceSvg } from "blockly";
import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import "blockly/blocks";
import "blockly/javascript";

export interface BlocklyWorkspaceProps {
  initialXml?: string;
  initialJson?: object;
  toolboxConfiguration?: Blockly.utils.toolbox.ToolboxDefinition;
  workspaceConfiguration: Blockly.BlocklyOptions;
  className?: string;
  onWorkspaceChange?: (workspace: WorkspaceSvg) => void;
  onXmlChange?: (xml: string) => void;
  onJsonChange?: (workspaceJson: object) => void;
  onImportError?: (error: unknown) => void;
  onInject?: (workspace: WorkspaceSvg) => void;
  onDispose?: (workspace: WorkspaceSvg) => void;
}

export interface BlocklyWorkspaceRef {
  getWorkspace: () => WorkspaceSvg | null;
  getXml: () => string | null;
  getJson: () => object | null;
}

function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debouncedFn = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };

  const cancel = () => {
    clearTimeout(timeoutId);
  };

  return [debouncedFn, cancel] as const;
}

export const BlocklyWorkspace = forwardRef<
  BlocklyWorkspaceRef,
  BlocklyWorkspaceProps
>(
  (
    {
      initialXml,
      initialJson,
      toolboxConfiguration,
      workspaceConfiguration,
      className,
      onWorkspaceChange,
      onXmlChange,
      onJsonChange,
      onImportError,
      onInject,
      onDispose,
    },
    ref
  ) => {
    const editorDivRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<WorkspaceSvg | null>(null);
    const didInitialImport = useRef(false);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      getWorkspace: () => workspaceRef.current,
      getXml: () => {
        if (!workspaceRef.current) return null;
        return Blockly.Xml.domToText(
          Blockly.Xml.workspaceToDom(workspaceRef.current)
        );
      },
      getJson: () => {
        if (!workspaceRef.current) return null;
        return Blockly.serialization.workspaces.save(workspaceRef.current);
      },
    }));

    // Initialize workspace
    useEffect(() => {
      if (!editorDivRef.current) return;

      const workspace = Blockly.inject(editorDivRef.current, {
        ...workspaceConfiguration,
        toolbox: toolboxConfiguration,
      });

      workspaceRef.current = workspace;
      didInitialImport.current = false;

      onInject?.(workspace);

      // Notify about workspace changes
      const handleWorkspaceChange = () => {
        onWorkspaceChange?.(workspace);
      };
      workspace.addChangeListener(handleWorkspaceChange);

      return () => {
        workspace.removeChangeListener(handleWorkspaceChange);
        workspace.dispose();
        onDispose?.(workspace);
        workspaceRef.current = null;
      };
    }, [
      onDispose,
      onInject,
      onWorkspaceChange,
      toolboxConfiguration,
      workspaceConfiguration,
    ]);

    // Ensure workspace fills parent container on resize
    useEffect(() => {
      const blocklyDiv = editorDivRef.current;
      const blocklyArea = blocklyDiv?.parentElement;
      const workspace = workspaceRef.current;
      if (!blocklyDiv || !blocklyArea || !workspace) return;

      const handleResize = () => {
        const width = blocklyArea.offsetWidth;
        const height = blocklyArea.offsetHeight;

        blocklyDiv.style.width = width + "px";
        blocklyDiv.style.height = height + "px";
        blocklyDiv.style.position = "absolute";

        Blockly.svgResize(workspace);
      };

      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });

      resizeObserver.observe(blocklyArea);

      // Initial resize
      handleResize();

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    useEffect(() => {
      const workspace = workspaceRef.current;
      if (
        workspace &&
        toolboxConfiguration &&
        !workspaceConfiguration?.readOnly
      ) {
        workspace.updateToolbox(toolboxConfiguration);
      }
    }, [toolboxConfiguration, workspaceConfiguration?.readOnly]);

    // Handle workspace changes
    useEffect(() => {
      const workspace = workspaceRef.current;
      if (!workspace) return;

      const [handleChange, cancelDebounce] = debounce(() => {
        const currentXml = Blockly.Xml.domToText(
          Blockly.Xml.workspaceToDom(workspace)
        );
        const currentJson = Blockly.serialization.workspaces.save(workspace);

        onXmlChange?.(currentXml);
        onJsonChange?.(currentJson);
      }, 200);

      workspace.addChangeListener(handleChange);

      return () => {
        workspace.removeChangeListener(handleChange);
        cancelDebounce();
      };
    }, [onXmlChange, onJsonChange]);

    // Import initial XML or JSON
    useEffect(() => {
      const workspace = workspaceRef.current;
      if (!workspace || didInitialImport.current) return;

      try {
        if (initialXml) {
          if (workspace.getAllBlocks(false).length === 0) {
            Blockly.Xml.domToWorkspace(
              Blockly.utils.xml.textToDom(initialXml),
              workspace
            );
          }
        } else if (initialJson) {
          Blockly.serialization.workspaces.load(initialJson, workspace);
        }
        didInitialImport.current = true;
      } catch (error) {
        onImportError?.(error);
      }
    }, [initialXml, initialJson, onImportError]);

    return <div ref={editorDivRef} className={className} />;
  }
);

BlocklyWorkspace.displayName = "BlocklyWorkspace";

export default BlocklyWorkspace;
