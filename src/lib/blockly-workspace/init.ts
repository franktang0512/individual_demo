import * as Blockly from "blockly/core";
import * as ZhHant from "blockly/msg/zh-hant";
import { initializeBlockly } from "./blockly";
import { initializeScratch } from "./scratch";

export function initiateBlocklyWorkspace() {
  Blockly.setLocale(ZhHant);

  // Blockly.Msg["VARIABLES_SET"] = "將 %1 設為 %2";
  // Blockly.Msg["MATH_CHANGE_TITLE"] = "將 %1 的值加 %2";
  Blockly.Msg["VARIABLES_SET"] = "變數 %1 設為 %2";
  Blockly.Msg["MATH_CHANGE_TITLE"] = "變數 %1 改變 %2";
  // console.log(Blockly.Msg);

  initializeBlockly();
  initializeScratch();
}
