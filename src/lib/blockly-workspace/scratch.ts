import * as Blockly from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";
import { colors } from "@/lib/colors";
import { ScratchFunctionBlock, ScratchFunctionParameter } from "../types";


// ✅ 創建變數欄位
function createVariableField(variable: Blockly.VariableModel) {
  const field = document.createElement("field");
  // console.log(field+"hahaha");
  const pattern = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/; // 不允許底線
  if (!pattern.test(variable.name)) {
    alert("變數名稱只能包含中英文字符和數字，並且不允許底線！");
    // return document.createElement("div"); // 返回一個空的 div 作為佔位符
    console.log(field);
    return field;
  }
  field.setAttribute("name", "VAR");
  field.setAttribute("id", variable.getId());
  field.setAttribute("variabletype", "");

  field.textContent = variable.name;
  return field;
}

export function variableFlyoutCallback(workspace: Blockly.WorkspaceSvg) {
  const xmlList = [];

  // 建立變數按鈕
  const button = document.createElement("button");
  button.setAttribute("text", "建立變數");
  button.setAttribute("callbackKey", "CREATE_SCRATCH_VARIABLE");
  xmlList.push(button);

  // 取得目前的變數列表
  const variables = workspace.getVariablesOfType("");

  if (variables.length > 0) {
    const pattern = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/; // 不允許底線

    for (let i = 0; i < variables.length; i++) {
      const variable = variables[i];

      // 檢查每個變數名稱是否符合規範
      if (!pattern.test(variable.name)) {
        workspace.deleteVariableById(variable.getId()); // 刪除不符合命名規範的變數
        // alert(`變數名稱 "${variable.name}" 不符合規範，已被刪除！`);
        alert(`請只使用中英文宣告變數名稱！`);
        continue; // 直接跳過這個變數，繼續處理下個變數
      }

      // 為符合規範的變數生成積木
      const getBlock = document.createElement("block");
      getBlock.setAttribute("type", "scratch_variables_get");

      const field = createVariableField(variable);
      if (field.textContent) {
        getBlock.appendChild(field);
        xmlList.push(getBlock);
      }

      // 只為「最後一個變數」生成「設為」與「改變」積木
      if (i === variables.length - 1) {
        ["scratch_variables_set", "scratch_variables_change"].forEach((type) => {
          const block = document.createElement("block");
          block.setAttribute("type", type);
          block.appendChild(createVariableField(variable));
          xmlList.push(block);
        });
      }
    }
  }

  return xmlList;
}



function createListField(listVar: Blockly.VariableModel) {
  const field = document.createElement("field");
  field.setAttribute("name", "LIST");
  field.setAttribute("id", listVar.getId());
  field.setAttribute("variabletype", "list");
  const name = document.createTextNode(listVar.name);
  field.appendChild(name);
  return field;
}

export function listFlyoutCallback(workspace: Blockly.WorkspaceSvg) {
  const xmlList = [];

  // 建立新清單按鈕
  const button = document.createElement("button");
  button.setAttribute("text", "建立新清單");
  button.setAttribute("callbackKey", "CREATE_SCRATCH_LIST");
  xmlList.push(button);

  // 取得目前的清單變數
  const lists = workspace.getVariablesOfType("list");
  const lastList = lists[lists.length - 1]; // 取得最後宣告的清單
  if (lists.length > 0) {
    const pattern = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/; // 不允許底線
    if (!pattern.test(lastList.name)) {

      workspace.deleteVariableById(lastList.getId()); // 刪除不符合命名規範的清單變數      
      lists.splice(lists.length - 1, 1);
      // alert(`清單名稱 "${list.name}" 不符合規範，已被刪除！`);
      alert(`請只使用中英文宣告清單名稱！`);
      // 直接跳過這個變數，繼續處理下個變數
    } else {
      for (const list of lists) {
        //檢查每個清單名稱是否符合規範
        // **為所有清單產生「取得清單值」積木**
        const getBlock = document.createElement("block");
        getBlock.setAttribute("type", "scratch_list_get");
        getBlock.appendChild(createListField(list));
        xmlList.push(getBlock);
      }

      // **只為「最後宣告的清單」生成其他積木**
      [
        "scratch_list_add",
        "scratch_list_get_item",
        "scratch_list_empty",
        "scratch_list_length",
        "scratch_list_insert",
        "scratch_list_set",
        "scratch_list_remove",
        "scratch_list_contain",
        "scratch_list_indexof",
      ].forEach((type) => {
        const block = document.createElement("block");
        block.setAttribute("type", type);
        block.appendChild(createListField(lastList));
        xmlList.push(block);
      });
    }
  }
  return xmlList;
}

function createList2DField(listVar: Blockly.VariableModel) {
  const field = document.createElement("field");
  field.setAttribute("name", "LIST");
  field.setAttribute("id", listVar.getId());
  field.setAttribute("variabletype", "list2d");
  const name = document.createTextNode(listVar.name);
  field.appendChild(name);
  return field;
}

export function list2DFlyoutCallback(workspace: Blockly.WorkspaceSvg) {
  const xmlList = [];

  // 建立新清單按鈕
  const button = document.createElement("button");
  button.setAttribute("text", "建立新二維清單");
  button.setAttribute("callbackKey", "CREATE_SCRATCH_LIST2D");
  xmlList.push(button);

  // 取得目前的清單變數
  const lists = workspace.getVariablesOfType("list2d");
  const lastList = lists[lists.length - 1]; // 取得最後宣告的清單
  if (lists.length > 0) {
    const pattern = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/; // 不允許底線
    if (!pattern.test(lastList.name)) {

      workspace.deleteVariableById(lastList.getId()); // 刪除不符合命名規範的清單變數      
      lists.splice(lists.length - 1, 1);
      // alert(`清單名稱 "${list.name}" 不符合規範，已被刪除！`);
      alert(`請只使用中英文宣告清單名稱！`);
      // 直接跳過這個變數，繼續處理下個變數
    } else {
      for (const list of lists) {
        //檢查每個清單名稱是否符合規範
        // **為所有清單產生「取得清單值」積木**
        const getBlock = document.createElement("block");
        getBlock.setAttribute("type", "scratch_list2d_get");
        getBlock.appendChild(createList2DField(list));
        xmlList.push(getBlock);
      }

      // **只為「最後宣告的清單」生成其他積木**
      [
        "scratch_list2d_setsize",
        //"scratch_list2d_add",
        "scratch_list2d_get_item",
        //"scratch_list2d_empty",
        //"scratch_list2d_length",
        //"scratch_list2d_insert",
        "scratch_list2d_set",
        //"scratch_list2d_remove",
        //"scratch_list2d_contain",
        //"scratch_list2d_indexof",
      ].forEach((type) => {
        const block = document.createElement("block");
        block.setAttribute("type", type);
        block.appendChild(createList2DField(lastList));
        xmlList.push(block);
      });
    }
  }
  return xmlList;
}

export function functionFlyoutCallback(workspace: Blockly.WorkspaceSvg) {
  const xmlList = [];

  // Button to create a new function
  const button = document.createElement("button");
  button.setAttribute("text", "建立函式");
  button.setAttribute("callbackKey", "CREATE_SCRATCH_FUNCTION");
  xmlList.push(button);

  const functionBlocks = workspace.getBlocksByType(
    "scratch_function_definition",
    false,
  ) as ScratchFunctionBlock[];

  for (const block of functionBlocks) {
    const callBlock = document.createElement("block");
    callBlock.setAttribute("type", "scratch_function_call");

    const mutation = block.mutationToDom();
    if (mutation) {
      callBlock.appendChild(mutation);
    }

    const name = block.getFieldValue("NAME");
    const field = document.createElement("field");
    field.setAttribute("name", "NAME");
    field.textContent = name;
    callBlock.appendChild(field);

    xmlList.push(callBlock);

    if (block.parameters_) {
      for (const param of block.parameters_) {
        if (param.type === "Label") continue;

        const paramBlock = document.createElement("block");
        paramBlock.setAttribute("type", "scratch_function_param");

        const mutation = document.createElement("mutation");
        mutation.setAttribute("name", param.name);
        mutation.setAttribute(
          "paramtype",
          param.type === "Boolean" ? "Boolean" : "NumberString",
        );
        paramBlock.appendChild(mutation);

        const field = document.createElement("field");
        field.setAttribute("name", "PARAM_NAME");
        field.textContent = param.name;
        paramBlock.appendChild(field);

        xmlList.push(paramBlock);
      }
    }

    // Add separator if this is not the last function
    if (functionBlocks.indexOf(block) < functionBlocks.length - 1) {
      const sep = document.createElement("sep");
      sep.setAttribute("gap", "80");
      xmlList.push(sep);
    }
  }

  return xmlList;
}



export function initializeScratch() {

  Blockly.Blocks["event_whenflagclicked"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("當")
        .appendField(new Blockly.FieldImage("img/flag.svg", 20, 20, "*"))
        .appendField("被點擊");
      this.setNextStatement(true, null);
      this.setColour("#FFBF00");
      this.setTooltip("當旗子被點擊時觸發");
      this.setHelpUrl("");
    },
  };

  // 轉換「當綠旗被點擊」積木成 JavaScript 程式碼
  javascriptGenerator.forBlock["event_whenflagclicked"] = function (block) {
    // 取得「當綠旗被點擊」後面連接的程式碼
    // const nextBlockCode = javascriptGenerator.statementToCode(block, "NEXT");

    // 產生 JavaScript 函式，確保程式從這裡開始執行
    return "\n var output_result_string ='';";
  };




  Blockly.Blocks["scratch_text"] = {
    init: function () {
      this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(""), "TEXT"); // 🔹 預設值 HAHA
      this.setOutput(true, ["Number", "String"]); // 🔹 允許數字 & 文字
      this.setColour("#FFFFFF"); // 🔹 設定為白色，符合 Scratch 風格
    },
    // style: { hidden: true } // 🔹 讓這個積木不顯示在 Toolbox
  };

  javascriptGenerator.forBlock["scratch_text"] = function (block) {
    const textValue = block.getFieldValue("TEXT") || "";
    return [`"${textValue}"`, Order.ATOMIC];
  };

  Blockly.Blocks["event_askandwait"] = {
    init: function () {
      this.appendValueInput("TEXT")
        .setCheck(null)
        .appendField("詢問");
      this.appendDummyInput()
        .appendField("並等待");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#5CB1D6");
      this.setTooltip("");
      this.setHelpUrl("");
    },
  };

  javascriptGenerator.forBlock["event_askandwait"] = function (block) {
    var value_question = javascriptGenerator.valueToCode(block, 'TEXT', Order.ATOMIC) || "''";

    // var code = `
    // system_input = window.prompt(${value_question}) ?? "";\n  
    // system_input = system_input.toString().trim();\n
    // if (!isNaN(system_input) && system_input !== "") {\n
    //     system_input = Number(system_input);\n
    // }\n
    // `;
    var code = `
    system_input = window.prompt(${value_question}) ?? "";\n
    system_input = system_input.toString();\n
    temp_input = system_input.toString().trim();
    if(temp_input === ""){
      if(system_input === " "){
        system_input = " "; 
      }else{
        system_input = "";
      }
    }else if (!isNaN(temp_input)) {  // 如果是數字字串，轉換為數字
        system_input = Number(temp_input);
    }else{
        system_input = temp_input;
    }
    `;
    return code;
  };


  // 定義積木：詢問的答案
  Blockly.Blocks["event_answer"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("詢問的答案");
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour("#5CB1D6");
      this.setTooltip("");
      this.setHelpUrl("");

    },
  };
  javascriptGenerator.forBlock["event_answer"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'system_input';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Order.ATOMIC];
  };



  Blockly.Blocks["event_say"] = {
    init: function () {
      this.appendValueInput("TEXT")
        .setCheck(null)
        .appendField("說出");
      this.appendDummyInput();
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour("#9966FF");
      this.setTooltip("");
      this.setHelpUrl("");
    },
  };
  javascriptGenerator.forBlock["event_say"] = function (block) {
    var msg = javascriptGenerator.valueToCode(block, 'TEXT', Order.NONE) || '\'\'';
    var code = 'output_result_string += ' + String(msg) + ';\n' + 'output_result_string += \'\\n\' ;\n'
    return code;
  };

  // 定義積木：沒有輸入資料
  Blockly.Blocks["event_noinput"] = {
    init: function () {
      this.appendDummyInput().appendField("沒有輸入資料");
      this.setOutput(true, "Boolean");
      this.setColour("#59C059");
      this.setTooltip("檢查是否沒有輸入資料");
      this.setHelpUrl("");
    },
  };

  javascriptGenerator.forBlock["event_noinput"] = function (block) {
    var code = "system_input=='NaN'";
    return [code, Order.ATOMIC];
  };

  // 定義積木：還有輸入資料
  Blockly.Blocks["event_hasinput"] = {
    init: function () {
      this.appendDummyInput().appendField("還有輸入資料");
      this.setOutput(true, "Boolean");
      this.setColour("#59C059");
      this.setTooltip("檢查是否還有輸入資料");
      this.setHelpUrl("");
    },
  };
  javascriptGenerator.forBlock["event_hasinput"] = function (block) {
    var code = "system_input!='NaN'";
    return [code, Order.ATOMIC];
  };

  [
    "scratch_param_player_x",
    "scratch_param_player_y",
    "scratch_param_coins_count",
    "scratch_param_max_x",
    "scratch_param_max_y",
  ].forEach((blockType) => {
    javascriptGenerator.forBlock[blockType] = function () {
      // Remove 'scratch_param_' and convert to camelCase
      const paramName = blockType
        .replace("scratch_param_", "")
        .replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      return [paramName + "()", Order.FUNCTION_CALL];
    };
  });
  [
    "scratch_param_coins_count_stone",
    "scratch_param_player_x_stone",
    "scratch_param_player_y_stone",
  ].forEach((blockType) => {
    javascriptGenerator.forBlock[blockType] = function () {
      return ""; // no code generation for these blocks
    };
  });

  Blockly.Blocks["scratch_string_join"] = {
    init: function () {

      this.appendValueInput("TEXT0")
        .setCheck(null)
        .appendField("字串組合");
      this.appendValueInput("TEXT1")
        .setCheck(null);
      this.setInputsInline(true);
      this.setOutput(true, "String");
      this.setColour("#36BF36");
      this.setTooltip("");
      this.setHelpUrl("");
    },
  };

  javascriptGenerator.forBlock["scratch_string_join"] = function (block) {

    var element0 = javascriptGenerator.valueToCode(block, "TEXT0", Order.ATOMIC) || '""';
    var element1 = javascriptGenerator.valueToCode(block, "TEXT1", Order.ATOMIC) || '""';

    var code = `String(${element0}) + String(${element1})`;
    return [code, Order.ADDITION];

  };

  Blockly.Blocks["scratch_string_char_at"] = {
    init: function () {
      this.appendValueInput("STRING").setCheck(null).appendField("字串");
      this.appendValueInput("INDEX").setCheck("Number").appendField("的第");
      this.appendDummyInput().appendField("字");
      this.setInputsInline(true);
      this.setOutput(true, "String");
      this.setStyle("calculation_blocks");
      this.setTooltip("取得字串中指定位置的字元");
    },
  };

  // javascriptGenerator.forBlock["scratch_string_char_at"] = function (block) {
  //   const string =
  //     javascriptGenerator.valueToCode(block, "STRING", Order.MEMBER) || "''";
  //   const index =
  //     javascriptGenerator.valueToCode(block, "INDEX", Order.ATOMIC) || "1";
  //   // Uses 1-based indexing
  //   return [`${string}.charAt(${index} - 1)`, Order.MEMBER];
  // };
  javascriptGenerator.forBlock["scratch_string_char_at"] = function (block) {
    const string =
      javascriptGenerator.valueToCode(block, "STRING", Order.MEMBER) || '""';
    const index =
      javascriptGenerator.valueToCode(block, "INDEX", Order.ATOMIC) || "1";

    return [`String(${string}).charAt(Number(${index}) - 1)`, Order.MEMBER];
  };

  Blockly.Blocks["scratch_string_contains"] = {
    init: function () {
      this.appendValueInput("STRING1").setCheck("String").appendField("字串");
      this.appendValueInput("STRING2").setCheck("String").appendField("包含");
      this.setInputsInline(true);
      this.setOutput(true, "Boolean");
      this.setStyle("calculation_blocks");
      this.setTooltip("檢查第一個字串是否包含第二個字串");
    },
  };

  javascriptGenerator.forBlock["scratch_string_contains"] = function (block) {
    const string1 =
      javascriptGenerator.valueToCode(block, "STRING1", Order.MEMBER) || "''";
    const string2 =
      javascriptGenerator.valueToCode(block, "STRING2", Order.ATOMIC) || "''";
    return [`${string1}.includes(${string2})`, Order.MEMBER];
  };

  Blockly.Blocks["scratch_if"] = {
    init: function () {
      this.appendValueInput("IF0").setCheck("Boolean").appendField("如果");
      this.appendDummyInput().appendField("那麼");
      this.appendStatementInput("DO0").setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("control_blocks");
      this.setTooltip("如果條件成立，則執行內部的程式區塊");
      this.setHelpUrl("");
    },
  };

  javascriptGenerator.forBlock["scratch_if"] = function (block) {
    const condition =
      javascriptGenerator.valueToCode(block, "IF0", Order.NONE) || "false";
    const statements = javascriptGenerator.statementToCode(block, "DO0");
    return `if (${condition}) {\n${statements}}\n`;
  };

  Blockly.Blocks["scratch_ifElse"] = {
    init: function () {
      this.appendValueInput("IF0").setCheck("Boolean").appendField("如果");
      this.appendDummyInput().appendField("那麼");
      this.appendStatementInput("DO0").setCheck(null);
      this.appendDummyInput().appendField("否則");
      this.appendStatementInput("ELSE").setCheck(null);
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("control_blocks");
      this.setTooltip(
        "如果條件成立，則執行第一個程式區塊，否則執行第二個程式區塊"
      );
      this.setHelpUrl("");
    },
  };

  javascriptGenerator.forBlock["scratch_ifElse"] = function (block) {
    const condition =
      javascriptGenerator.valueToCode(block, "IF0", Order.NONE) || "false";
    const statements = javascriptGenerator.statementToCode(block, "DO0");
    const elseStatements = javascriptGenerator.statementToCode(block, "ELSE");
    return `if (${condition}) {\n${statements}} else {\n${elseStatements}}\n`;
  };

  Blockly.Blocks["scratch_repeat_ext"] = {
    init: function () {
      this.appendValueInput("TIMES").setCheck("Number").appendField("重複");
      this.appendDummyInput().appendField("次");
      this.appendStatementInput("DO").setCheck(null);
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("control_blocks");
      this.setTooltip("重複執行指定次數的程式區塊");
      this.setHelpUrl("");
    },
  };

  javascriptGenerator.forBlock["scratch_repeat_ext"] = function (block) {
    const times =
      javascriptGenerator.valueToCode(block, "TIMES", Order.ATOMIC) || "0";
    const statements = javascriptGenerator.statementToCode(block, "DO");
    return `for (let __internalCount = 0; __internalCount < ${times}; __internalCount++) {\n${statements}}\n`;
  };

  Blockly.Blocks["scratch_while"] = {
    init: function () {
      this.appendValueInput("BOOL")
        .setCheck("Boolean")
        .appendField("重複")
        .appendField(
          new Blockly.FieldDropdown([
            ["當", "WHILE"],
            ["直到", "UNTIL"],
          ]),
          "MODE"
        );
      this.appendStatementInput("DO").setCheck(null);
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("control_blocks");
      this.setTooltip("當條件成立時重複執行程式區塊");
      this.setHelpUrl("");
    },
  };

  javascriptGenerator.forBlock["scratch_while"] = function (block) {
    const mode = block.getFieldValue("MODE");
    const condition =
      javascriptGenerator.valueToCode(block, "BOOL", Order.NONE) || "false";
    const statements = javascriptGenerator.statementToCode(block, "DO");

    if (mode === "UNTIL") {
      return `while (!(${condition})) {\n${statements}}\n`;
    } else {
      return `while (${condition}) {\n${statements}}\n`;
    }
  };

  Blockly.Blocks["scratch_whileUntil"] = {
    init: function () {
      this.appendValueInput("BOOL")
        .setCheck("Boolean")
        .appendField("重複")
        .appendField(
          new Blockly.FieldDropdown([
            ["直到", "UNTIL"],
            ["當", "WHILE"],
          ]),
          "MODE"
        );
      this.appendStatementInput("DO").setCheck(null);
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("control_blocks");
      this.setTooltip("直到條件成立時停止重複執行程式區塊");
      this.setHelpUrl("");
    },
  };

  javascriptGenerator.forBlock["scratch_whileUntil"] = function (block) {
    const mode = block.getFieldValue("MODE");
    const condition =
      javascriptGenerator.valueToCode(block, "BOOL", Order.NONE) || "false";
    const statements = javascriptGenerator.statementToCode(block, "DO");

    if (mode === "UNTIL") {
      return `while (!(${condition})) {\n${statements}}\n`;
    } else {
      return `while (${condition}) {\n${statements}}\n`;
    }
  };



  // javascriptGenerator.forBlock["controls_flow_statements"] = function (block) {
  //   const mode = block.getFieldValue("FLOW"); // 取得 BLOCK 設定的模式 (BREAK 或 CONTINUE)

  //   if (mode === "BREAK") {
  //     return "break;\n";
  //   } else if (mode === "CONTINUE") {
  //     return "continue;\n";
  //   }

  //   return "";
  // };

  Blockly.Blocks["scratch_controls_flow_statements"] = {
    init: function () {
      this.appendDummyInput().appendField(
        new Blockly.FieldDropdown([
          ["中斷循環", "BREAK"],
          ["繼續下一個循環", "CONTINUE"],
        ]),
        "FLOW",
      );
      this.setPreviousStatement(true, null);
      this.setNextStatement(false, null);
      this.setStyle("control_blocks");
      this.setTooltip("控制重複的執行流程");
    },
  };

  javascriptGenerator.forBlock["scratch_controls_flow_statements"] = function (
    block,
  ) {
    const flow = block.getFieldValue("FLOW");
    return flow === "BREAK" ? "break;\n" : "continue;\n";
  };




  Blockly.Blocks["scratch_math_arithmetic"] = {
    init: function () {
      this.appendValueInput("A")
        // .setCheck(["Number", "String"]);
        .setCheck("Number");
      this.appendValueInput("B")
        .setCheck("Number")
        .appendField(new Blockly.FieldDropdown([["+", "ADD"], ["-", "MINUS"], ["*", "MULTIPLY"], ["/", "DIVIDE"]]), "OP");
      this.setInputsInline(true);
      this.setOutput(true, "Number");
      this.setColour("#36BF36");
      this.setTooltip("");
      this.setHelpUrl("");
    },
  };



  javascriptGenerator.forBlock["scratch_math_arithmetic"] = function (block) {
    let a = javascriptGenerator.valueToCode(block, "A", Order.ATOMIC) || "0";
    let b = javascriptGenerator.valueToCode(block, "B", Order.ATOMIC) || "0";
    const operator = block.getFieldValue("OP");

    // **直接將 a, b 轉換為數字，若無法轉換則為 0**
    const numberA = `(isNaN(Number(${a})) ? 0 : Number(${a}))`;
    const numberB = `(isNaN(Number(${b})) ? 0 : Number(${b}))`;

    let code;
    switch (operator) {
      case "ADD":
        code = `${numberA} + ${numberB}`;
        break;
      case "MINUS":
        code = `${numberA} - ${numberB}`;
        break;
      case "MULTIPLY":
        code = `${numberA} * ${numberB}`;
        break;
      case "DIVIDE":
        code = `${numberB} !== 0 ? ${numberA} / ${numberB} : 0`;
        break;
      default:
        code = "0";
    }

    return [code, Order.ADDITION];
  };



  Blockly.Blocks["scratch_length"] = {
    init: function () {
      this.appendValueInput("VALUE")
        .setCheck(["String", "Array"])
        .appendField("取得");
      this.appendDummyInput().appendField("的長度");
      this.setInputsInline(true);
      this.setOutput(true, "Number");
      this.setStyle("calculation_blocks");
      this.setTooltip("計算字串或清單的長度");
      this.setHelpUrl("");
    },
  };

  // javascriptGenerator.forBlock["scratch_length"] = function (block) {
  //   // const value =
  //   //   javascriptGenerator.valueToCode(block, "VALUE", Order.MEMBER) || "''";
  //   // return [`${value}.length`, Order.MEMBER];
  //   var text = javascriptGenerator.valueToCode(block, 'VALUE',
  //     Order.MEMBER) || '\'\'';
  //   return [text + '.length', Order.MEMBER];
  // };

  javascriptGenerator.forBlock["scratch_length"] = function (block) {
    var value = javascriptGenerator.valueToCode(block, "VALUE", Order.MEMBER) || '""';

    return [`(Array.isArray(${value}) ? ${value}.length : String(${value}).length)`, Order.MEMBER];
  };


  // Blockly.Blocks["variables_set"] = {
  //   init: function () {
  //     // console.log("============================");
  //     // console.log(Blockly.Blocks);
  //     // console.log("============================");
  //     this.appendDummyInput()
  //       .appendField("變數")
  //       // .appendField(new Blockly.FieldVariable("變數名稱"), "VAR")
  //       .appendField(
  //         new Blockly.FieldVariable("變數名稱", undefined, [""]),

  //         "VAR")
  //       .appendField("設為");

  //     // ✅ 建立 shadow block
  //     let shadowBlock = document.createElement("shadow");
  //     shadowBlock.setAttribute("type", "scratch_text"); // 🔹 設定為數字輸入框
  //     let field = document.createElement("field");
  //     field.setAttribute("name", "NUM");
  //     field.textContent = "0"; // 🔹 預設值
  //     shadowBlock.appendChild(field);
  //     this.appendValueInput("VALUE")
  //       // .setCheck(null)
  //       // .setCheck(["Number", "String"])
  //       // ✅ 設定 shadow block，讓輸入框變成 Scratch 樣式
  //       .connection.setShadowDom(shadowBlock);

  //     this.setInputsInline(true);
  //     this.setPreviousStatement(true, null);
  //     this.setNextStatement(true, null);
  //     this.setColour("#FF9900");
  //     this.setTooltip("設定變數的值");
  //     this.setHelpUrl("");
  //   },
  // };



  // Blockly.Blocks["scratch_variables_set"] = {
  //   init: function () {
  //     this.appendDummyInput()
  //       .appendField("變數")
  //       .appendField(new Blockly.FieldVariable("變數名稱", undefined, [""]), "VAR")
  //       .appendField("設為");

  //     // ✅ 建立 shadow block
  //     let shadowBlock = document.createElement("shadow");
  //     shadowBlock.setAttribute("type", "scratch_text"); // ✅ 自定義 Scratch 文字輸入框
  //     let field = document.createElement("field");
  //     field.setAttribute("name", "TEXT"); // ✅ `scratch_text` 的正確 field 名稱應該是 TEXT
  //     field.textContent = "0"; // ✅ 預設為 0
  //     shadowBlock.appendChild(field);

  //     this.appendValueInput("VALUE")
  //       // .setCheck(["Number", "String"]) // ✅ 允許數字 & 文字
  //       .setCheck(null)
  //       .connection.setShadowDom(shadowBlock); // ✅ 設定 shadow block

  //     this.setInputsInline(true);
  //     this.setPreviousStatement(true, null);
  //     this.setNextStatement(true, null);
  //     this.setColour("#FF9900");
  //     this.setTooltip("設定變數的值");
  //     this.setHelpUrl("");
  //   },
  // };


  Blockly.Blocks["scratch_variables_set"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("變數")
        .appendField(new Blockly.FieldVariable("", undefined, [""]), "VAR")
        .appendField("設為");

      const shadowBlock = document.createElement("shadow");
      shadowBlock.setAttribute("type", "scratch_text");
      const field = document.createElement("field");
      field.setAttribute("name", "TEXT");
      field.textContent = "0";
      shadowBlock.appendChild(field);

      this.appendValueInput("VALUE")
        .setCheck(null)
        .connection.setShadowDom(shadowBlock);

      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("variable_blocks");
    },
  };

  // javascriptGenerator.forBlock["scratch_variables_set"] = function (block) {
  //   var argument0 = javascriptGenerator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || '0';
  //   var varName = javascriptGenerator.nameDB_?.getName(
  //     block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME
  //   );

  //   // ✅ 嘗試將 argument0 轉為數字，如果是純數字則轉型
  //   var code = `${varName} = (isNaN(${argument0}) ? ${argument0} : Number(${argument0}));\n`;

  //   return code;
  // };
  javascriptGenerator.forBlock["scratch_variables_set"] = function (block) {
    const varName = javascriptGenerator.nameDB_?.getName(
      block.getFieldValue("VAR"),
      Blockly.VARIABLE_CATEGORY_NAME,
    );
    const value =
      javascriptGenerator.valueToCode(block, "VALUE", Order.ASSIGNMENT) || "0";

    // If it's a string literal, check if it's numeric
    if (value.startsWith('"') || value.startsWith("'")) {
      const strValue = value.slice(1, -1);
      if (!isNaN(parseFloat(strValue))) {
        return `${varName} = ${Number(strValue)};\n`;
      }
    }

    return `${varName} = ${value};\n`;
  };


  //不知道為甚麼要用math_change來實作variables_change但就先這樣好了不然好煩
  // Blockly.Blocks["scratch_variables_change"] = {
  //   init: function () {
  //     this.appendDummyInput()
  //       .appendField("變數")
  //       .appendField(
  //         new Blockly.FieldVariable("變數名稱", undefined, [""]),
  //         "VAR")
  //       .appendField("改變");

  //     // ✅ 使用 appendValueInput 確保顯示白色橢圓輸入框
  //     let valueInput = this.appendValueInput("DELTA").setCheck(null);

  //     // ✅ 建立 shadow block
  //     let shadowBlock = document.createElement("shadow");
  //     shadowBlock.setAttribute("type", "math_number"); // 🔹 設定為數字輸入框
  //     let field = document.createElement("field");
  //     field.setAttribute("name", "NUM");
  //     field.textContent = "1"; // 🔹 預設值
  //     shadowBlock.appendChild(field);

  //     // ✅ 設定 shadow block，讓輸入框變成 Scratch 樣式
  //     valueInput.connection.setShadowDom(shadowBlock);

  //     this.setInputsInline(true);
  //     this.setPreviousStatement(true, null);
  //     this.setNextStatement(true, null);
  //     this.setColour("#FF9900"); // ✅ 設定 Scratch 變數積木顏色
  //     this.setTooltip("改變變數的值");
  //     this.setHelpUrl("");
  //   },
  // };
  Blockly.Blocks["scratch_variables_change"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("變數")
        .appendField(new Blockly.FieldVariable("", undefined, [""]), "VAR")
        .appendField("改變");

      const valueInput = this.appendValueInput("DELTA").setCheck(null);

      const shadowBlock = document.createElement("shadow");
      shadowBlock.setAttribute("type", "math_number");
      const field = document.createElement("field");
      field.setAttribute("name", "NUM");
      field.textContent = "1";
      shadowBlock.appendChild(field);

      valueInput.connection.setShadowDom(shadowBlock);

      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("variable_blocks");
    },
  };

  // javascriptGenerator.forBlock["scratch_variables_change"] = function (block) {
  //   var argument0 = javascriptGenerator.valueToCode(block, 'DELTA', Order.ADDITION) || '1';
  //   var varName = javascriptGenerator.nameDB_?.getName(
  //     block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  //   return varName + ' = (typeof ' + varName + ' == \'number\' ? ' + varName +
  //     ' : 0) + ' + argument0 + ';\n';
  // };
  javascriptGenerator.forBlock["scratch_variables_change"] = function (block) {
    const varName = javascriptGenerator.nameDB_?.getName(
      block.getFieldValue("VAR"),
      Blockly.VARIABLE_CATEGORY_NAME,
    );
    const delta =
      javascriptGenerator.valueToCode(block, "DELTA", Order.ADDITION) || "1";
    return `${varName} = (typeof ${varName} == 'number' ? ${varName} : 0) + ${delta};\n`;
  };


  Blockly.Blocks["scratch_variables_get"] = {
    init: function () {
      this.appendDummyInput()
        .appendField(
          new Blockly.FieldVariable("變數名稱", undefined, [""]),
          "VAR")
      this.setStyle("variable_blocks");
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setColour("#FF9900");
      // this.setColour("%{BKY_VARIABLES_HUE}");
      this.setTooltip("");
      this.setHelpUrl("");

    },
  };

  javascriptGenerator.forBlock["scratch_variables_get"] = function (block) {
    const varName = javascriptGenerator.nameDB_?.getName(
      block.getFieldValue("VAR"),
      Blockly.VARIABLE_CATEGORY_NAME,
    ) as string;
    return [varName, Order.ATOMIC];
  };


  // Get list (reporter)
  Blockly.Blocks["scratch_list_get"] = {
    init: function () {
      this.appendDummyInput().appendField(
        new Blockly.FieldVariable("", undefined, ["list"], "list"),
        "LIST"
      );
      this.setOutput(true, null);
      this.setStyle("list_blocks");
      this.setTooltip("取得清單");
    },
  };
  // Add JavaScript generators
  // javascriptGenerator.forBlock["scratch_list_get"] = function (block) {
  //   // var field = block.getField("LIST");
  //   // if (!field) {
  //   //   console.warn("Field 'LIST' not found on block:", block);
  //   //   return ["[]", Order.ATOMIC]; // 預設回傳空陣列，避免錯誤
  //   // }

  //   // var listName = javascriptGenerator.nameDB_!.getName(
  //   //   field.getText(),
  //   //   Blockly.Names.NameType.VARIABLE
  //   // );

  //   // // ✅ 確保變數已經被宣告過
  //   // var code = `${listName} = ${listName} || [];\n`;
  //   // return [`${code} ${listName}`, Order.ATOMIC];


  //   var field = block.getField("LIST");
  //   if (!field) {
  //     console.warn("Field 'LIST' not found on block:", block);
  //     return ["[]", Order.ATOMIC]; // 預設回傳空陣列，避免錯誤
  //   }

  //   var listName = javascriptGenerator.nameDB_!.getName(
  //     field.getText(),
  //     Blockly.Names.NameType.VARIABLE
  //   );

  //   return [`(${listName} = ${listName} || [], ${listName})`, Order.ATOMIC];
  // };
  javascriptGenerator.forBlock["scratch_list_get"] = function (block) {
    var field = block.getField("LIST");
    if (!field) {
      console.warn("Field 'LIST' not found on block:", block);
      return ["''", Order.ATOMIC]; // 預設回傳空字串，避免錯誤
    }

    var listName = javascriptGenerator.nameDB_!.getName(
      field.getText(),
      Blockly.Names.NameType.VARIABLE
    );

    // 確保 listName 是有效的陣列
    return [`(${listName} = ${listName} || [], ${listName}.map(String).join(''))`, Order.ATOMIC];
  };

  // Add item to list
  Blockly.Blocks["scratch_list_add"] = {
    init: function () {
      // ✅ 使用 appendValueInput 添加 ITEM（需要有 shadow block）
      let itemInput = this.appendValueInput("ITEM")
        .setCheck(null)
        .appendField("添加");

      // ✅ 設定 shadow block，預設為空字串
      let shadowBlock = document.createElement("shadow");
      shadowBlock.setAttribute("type", "scratch_text");
      let field = document.createElement("field");
      field.setAttribute("name", "TEXT");
      field.textContent = "thing"; // 🔹 預設值為 ""
      shadowBlock.appendChild(field);

      itemInput.connection.setShadowDom(shadowBlock);

      // ✅ 設定 LIST 變數
      this.appendDummyInput()
        .appendField("到")
        .appendField(
          new Blockly.FieldVariable("", undefined, ["list"], "list"),
          "LIST"
        );

      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("list_blocks");
      this.setTooltip("加入項目到清單末尾");
    },
  };

  // Get item at index
  Blockly.Blocks["scratch_list_get_item"] = {
    init: function () {
      this.appendDummyInput()
        // .appendField("取得")
        .appendField(
          new Blockly.FieldVariable("", undefined, ["list"], "list"),
          "LIST"
        );


      let valueInput = this.appendValueInput("INDEX").setCheck("Number").appendField("的第");
      // this.appendValueInput("INDEX").setCheck("Number").appendField("的第");

      // ✅ 使用 appendValueInput 確保顯示白色橢圓輸入框
      // let valueInput = this.appendValueInput("VALUE").setCheck(null);

      // ✅ 建立 shadow block
      let shadowBlock = document.createElement("shadow");
      shadowBlock.setAttribute("type", "math_number"); // 🔹 設定為數字輸入框
      let field = document.createElement("field");
      field.setAttribute("name", "NUM");
      field.textContent = "1"; // 🔹 預設值
      shadowBlock.appendChild(field);

      // ✅ 設定 shadow block，讓輸入框變成 Scratch 樣式
      valueInput.connection.setShadowDom(shadowBlock);
      this.appendDummyInput().appendField("項");
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setStyle("list_blocks");
      this.setTooltip("取得清單中指定位置的項目");
    },
  };
  javascriptGenerator.forBlock["scratch_list_get_item"] = function (block) {
    // const list = javascriptGenerator.nameDB_!.getName(
    //   block.getFieldValue("LIST"),
    //   "VARIABLE"
    // );
    // const index =
    //   javascriptGenerator.valueToCode(block, "INDEX", Order.ATOMIC) || "1";
    // // Scratch uses 1-based indexing, so we subtract 1
    // return [`${list}[${index} - 1]`, Order.MEMBER];
    const field = block.getField("LIST");
    if (!field) {
      console.warn("Field 'LIST' not found on block:", block);
      return ["undefined", Order.ATOMIC];
    }

    var listName = javascriptGenerator.nameDB_!.getName(
      field.getText(),
      Blockly.Names.NameType.VARIABLE
    );

    const index =
      javascriptGenerator.valueToCode(block, "INDEX", Order.ATOMIC) || "1";

    return [`(${listName} = ${listName} || [], ${listName}[${index} - 1])`, Order.MEMBER];



  };


  // javascriptGenerator.forBlock["scratch_list_add"] = function (block) {
  //   // const list = javascriptGenerator.nameDB_!.getName(
  //   //   block.getFieldValue("LIST"),
  //   //   "VARIABLE"
  //   // );
  //   // const item =
  //   //   javascriptGenerator.valueToCode(block, "ITEM", Order.NONE) || '""';
  //   // return `${list}.push(${item});\n`;


  //   const field = block.getField("LIST");
  //   if (!field) {
  //     console.warn("Field 'LIST' not found on block:", block);
  //     return "";
  //   }

  //   var listName = javascriptGenerator.nameDB_!.getName(
  //     field.getText(),
  //     Blockly.Names.NameType.VARIABLE
  //   );

  //   const item =
  //     javascriptGenerator.valueToCode(block, "ITEM", Order.NONE) || '""';

  //   return `${listName} = ${listName} || [];\n${listName}.push(${item});\n`;


  // };

  javascriptGenerator.forBlock["scratch_list_add"] = function (block) {
    const field = block.getField("LIST");
    if (!field) {
      console.warn("Field 'LIST' not found on block:", block);
      return "";
    }

    var listName = javascriptGenerator.nameDB_!.getName(
      field.getText(),
      Blockly.Names.NameType.VARIABLE
    );

    let itemCode =
      javascriptGenerator.valueToCode(block, "ITEM", Order.NONE) || '""';

    // 嘗試將 `itemCode` 轉換為數字
    const numberCheck = `!isNaN(parseFloat(${itemCode})) && isFinite(${itemCode})`;

    return `${listName} = ${listName} || [];\n` +
      `${listName}.push(${numberCheck} ? Number(${itemCode}) : ${itemCode});\n`;
  };


  Blockly.Blocks["scratch_list_empty"] = {
    init: function () {
      this.appendDummyInput()
        // .appendField("清空")
        .appendField("刪除")
        .appendField(
          new Blockly.FieldVariable("", undefined, ["list"], "list"),
          "LIST"
        )
        .appendField("的所有項目");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("list_blocks");
      this.setTooltip("清空清單中的所有項目");
    },
  };

  javascriptGenerator.forBlock["scratch_list_empty"] = function (block) {
    // const list = javascriptGenerator.nameDB_!.getName(
    //   block.getFieldValue("LIST"),
    //   "VARIABLE"
    // );
    // return `${list}.length = 0;\n`;
    const field = block.getField("LIST");
    if (!field) {
      console.warn("Field 'LIST' not found on block:", block);
      return "";
    }

    var listName = javascriptGenerator.nameDB_!.getName(
      field.getText(),
      Blockly.Names.NameType.VARIABLE
    );

    return `${listName} = ${listName} || [];\n${listName}.length = 0;\n`;
  };

  Blockly.Blocks["scratch_list_length"] = {
    init: function () {
      this.appendDummyInput()
        // .appendField("取得")
        .appendField("清單")
        .appendField(
          new Blockly.FieldVariable("", undefined, ["list"], "list"),
          "LIST"
        )
        .appendField("的長度");
      this.setInputsInline(true);
      this.setOutput(true, "Number");
      this.setStyle("list_blocks");
      this.setTooltip("取得清單的長度");
    },
  };

  javascriptGenerator.forBlock["scratch_list_length"] = function (block) {
    // const list = javascriptGenerator.nameDB_!.getName(
    //   block.getFieldValue("LIST"),
    //   "VARIABLE"
    // );
    // return [`${list}.length`, Order.MEMBER];

    const field = block.getField("LIST");
    if (!field) {
      console.warn("Field 'LIST' not found on block:", block);
      return ["0", Order.ATOMIC];
    }

    var listName = javascriptGenerator.nameDB_!.getName(
      field.getText(),
      Blockly.Names.NameType.VARIABLE
    );

    return [`(${listName} = ${listName} || []).length`, Order.MEMBER];
  };

  Blockly.Blocks["scratch_list_insert"] = {
    init: function () {
      let itemInput = this.appendValueInput("ITEM").setCheck(null).appendField("插入");

      // ✅ 設定 `ITEM` 的白色橢圓 Shadow Block（字串輸入框）
      let itemShadow = document.createElement("shadow");
      itemShadow.setAttribute("type", "scratch_text"); // 讓 ITEM 變成文字輸入框
      let itemField = document.createElement("field");
      itemField.setAttribute("name", "TEXT");
      itemField.textContent = "thing"; // 預設值
      itemShadow.appendChild(itemField);
      itemInput.connection.setShadowDom(itemShadow); // ✅ 讓 `ITEM` 變成 Scratch 樣式

      this.appendDummyInput()
        .appendField("到")
        .appendField(
          new Blockly.FieldVariable("", undefined, ["list"], "list"),
          "LIST"
        );

      let indexInput = this.appendValueInput("INDEX").setCheck("Number").appendField("的第");

      // ✅ 設定 `INDEX` 的白色橢圓 Shadow Block（數字輸入框）
      let indexShadow = document.createElement("shadow");
      indexShadow.setAttribute("type", "math_number");
      let indexField = document.createElement("field");
      indexField.setAttribute("name", "NUM");
      indexField.textContent = "1"; // 預設值
      indexShadow.appendChild(indexField);
      indexInput.connection.setShadowDom(indexShadow); // ✅ 讓 `INDEX` 變成 Scratch 樣式

      this.appendDummyInput().appendField("項");

      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("list_blocks");
      this.setTooltip("在指定位置插入項目");
    },
  };

  javascriptGenerator.forBlock["scratch_list_insert"] = function (block) {
    // const list = javascriptGenerator.nameDB_!.getName(
    //   block.getFieldValue("LIST"),
    //   "VARIABLE"
    // );
    // const index =
    //   javascriptGenerator.valueToCode(block, "INDEX", Order.ATOMIC) || "1";
    // const item =
    //   javascriptGenerator.valueToCode(block, "ITEM", Order.NONE) || '""';
    // // Scratch uses 1-based indexing
    // return `${list}.splice(${index} - 1, 0, ${item});\n`;
    const field = block.getField("LIST");
    if (!field) {
      console.warn("Field 'LIST' not found on block:", block);
      return "";
    }

    var listName = javascriptGenerator.nameDB_!.getName(
      field.getText(),
      Blockly.Names.NameType.VARIABLE
    );

    const index =
      javascriptGenerator.valueToCode(block, "INDEX", Order.ATOMIC) || "1";
    const item =
      javascriptGenerator.valueToCode(block, "ITEM", Order.NONE) || '""';

    return `${listName} = ${listName} || [];\n${listName}.splice(${index} - 1, 0, ${item});\n`;

  };

  Blockly.Blocks["scratch_list_set"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("替換")
        .appendField(
          new Blockly.FieldVariable("", undefined, ["list"], "list"),
          "LIST"
        );

      let indexInput = this.appendValueInput("INDEX").setCheck("Number").appendField("的第");

      // ✅ 設定 `INDEX` 的白色橢圓 Shadow Block（數字輸入框）
      let indexShadow = document.createElement("shadow");
      indexShadow.setAttribute("type", "math_number");
      let indexField = document.createElement("field");
      indexField.setAttribute("name", "NUM");
      indexField.textContent = "1"; // 預設值
      indexShadow.appendChild(indexField);
      indexInput.connection.setShadowDom(indexShadow); // ✅ 讓 `INDEX` 變成 Scratch 樣式

      let itemInput = this.appendValueInput("ITEM").setCheck(null).appendField("項為");

      // ✅ 設定 `ITEM` 的白色橢圓 Shadow Block（文字輸入框）
      let itemShadow = document.createElement("shadow");
      itemShadow.setAttribute("type", "scratch_text");
      let itemField = document.createElement("field");
      itemField.setAttribute("name", "TEXT");
      itemField.textContent = "新值"; // 預設值
      itemShadow.appendChild(itemField);
      itemInput.connection.setShadowDom(itemShadow); // ✅ 讓 `ITEM` 變成 Scratch 樣式

      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("list_blocks");
      this.setTooltip("修改指定位置的項目");
    },
  };

  javascriptGenerator.forBlock["scratch_list_set"] = function (block) {
    // const list = javascriptGenerator.nameDB_!.getName(
    //   block.getFieldValue("LIST"),
    //   "VARIABLE"
    // );
    // const index =
    //   javascriptGenerator.valueToCode(block, "INDEX", Order.ATOMIC) || "1";
    // const item =
    //   javascriptGenerator.valueToCode(block, "ITEM", Order.NONE) || '""';
    // // Scratch uses 1-based indexing
    // return `${list}[${index} - 1] = ${item};\n`;
    const field = block.getField("LIST");
    if (!field) {
      console.warn("Field 'LIST' not found on block:", block);
      return "";
    }

    var listName = javascriptGenerator.nameDB_!.getName(
      field.getText(),
      Blockly.Names.NameType.VARIABLE
    );

    const index =
      javascriptGenerator.valueToCode(block, "INDEX", Order.ATOMIC) || "1";
    const item =
      javascriptGenerator.valueToCode(block, "ITEM", Order.NONE) || '""';

    return `${listName} = ${listName} || [];\n${listName}[${index} - 1] = ${item};\n`;

  };

  Blockly.Blocks["scratch_list_remove"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("刪除")
        .appendField(
          new Blockly.FieldVariable("", undefined, ["list"], "list"),
          "LIST"
        );

      // ✅ 加入 index 輸入框
      let indexInput = this.appendValueInput("INDEX")
        .setCheck("Number")
        .appendField("的第");

      // ✅ 建立 shadow block，預設值為 1（符合 Scratch 標準）
      let shadowBlock = document.createElement("shadow");
      shadowBlock.setAttribute("type", "math_number");
      let field = document.createElement("field");
      field.setAttribute("name", "NUM");
      field.textContent = "1"; // 🔹 預設為 1，而不是 0
      shadowBlock.appendChild(field);

      indexInput.connection.setShadowDom(shadowBlock); // ✅ 設定 shadow block

      this.appendDummyInput().appendField("項");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("list_blocks");
      this.setTooltip("刪除指定位置的項目");
    },
  };

  javascriptGenerator.forBlock["scratch_list_remove"] = function (block) {
    // const list = javascriptGenerator.nameDB_!.getName(
    //   block.getFieldValue("LIST"),
    //   "VARIABLE"
    // );
    // const index =
    //   javascriptGenerator.valueToCode(block, "INDEX", Order.ATOMIC) || "1";
    // // Scratch uses 1-based indexing
    // return `${list}.splice(${index} - 1, 1);\n`;




    const field = block.getField("LIST");
    if (!field) {
      console.warn("Field 'LIST' not found on block:", block);
      return "";
    }

    var listName = javascriptGenerator.nameDB_!.getName(
      field.getText(),
      Blockly.Names.NameType.VARIABLE
    );

    const index =
      javascriptGenerator.valueToCode(block, "INDEX", Order.ATOMIC) || "1";

    return `${listName} = ${listName} || [];\n${listName}.splice(${index} - 1, 1);\n`;

  };


  Blockly.Blocks["scratch_list_contain"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("清單") // ✅ 顯示標題
        .appendField(
          new Blockly.FieldVariable("myList", undefined, ["list"], "list"), // ✅ 只能選擇「清單」變數
          "LIST"
        )
        .appendField("包含");

      let itemInput = this.appendValueInput("ITEM").setCheck(null); // ✅ 可輸入任何類型的數據

      // ✅ 設定 `ITEM` 的白色橢圓 Shadow Block（文字輸入框）
      let itemShadow = document.createElement("shadow");
      itemShadow.setAttribute("type", "scratch_text");
      let itemField = document.createElement("field");
      itemField.setAttribute("name", "TEXT");
      itemField.textContent = "thing"; // 預設值
      itemShadow.appendChild(itemField);
      itemInput.connection.setShadowDom(itemShadow); // ✅ 讓 `ITEM` 變成 Scratch 樣式

      this.appendDummyInput().appendField("?"); // ✅ 加上問號

      this.setInputsInline(true); // ✅ 保持 Scratch 樣式
      this.setOutput(true, "Boolean"); // ✅ 返回布林值
      this.setStyle("list_blocks"); // ✅ 設定 Scratch 列表風格
      this.setTooltip("檢查清單是否包含指定的元素");
    },
  };


  javascriptGenerator.forBlock["scratch_list_contain"] = function (block) {
    const field = block.getField("LIST");
    if (!field) {
      console.warn("Field 'LIST' not found on block:", block);
      return ["false", Order.ATOMIC]; // 預設返回 false
    }

    var listName = javascriptGenerator.nameDB_?.getName(
      field.getText(),
      Blockly.Names.NameType.VARIABLE
    ) || "undefined_list";

    let item = javascriptGenerator.valueToCode(block, "ITEM", Order.ATOMIC) || '""';

    return [
      `(${listName} = ${listName} || [], 
      ${listName}.some(x => isNaN(x) ? String(x).trim() === String(${item}).trim() : Number(x) === Number(${item})))`,
      Order.ATOMIC
    ];
  };


  Blockly.Blocks["scratch_list_indexof"] = {
    init: function () {


      let itemInput = this.appendValueInput("ITEM").setCheck(null).appendField("");

      // ✅ 設定 `ITEM` 的白色橢圓 Shadow Block（文字輸入框）
      let itemShadow = document.createElement("shadow");
      itemShadow.setAttribute("type", "scratch_text");
      let itemField = document.createElement("field");
      itemField.setAttribute("name", "TEXT");
      itemField.textContent = "thing"; // 預設值
      itemShadow.appendChild(itemField);
      itemInput.connection.setShadowDom(itemShadow); // ✅ 讓 `ITEM` 變成 Scratch 樣式


      // this.appendValueInput("ITEM") // 🔹 可輸入要查找的值
      // .setCheck(null); // ✅ 允許所有類型（數字、文字），這樣就會是 Scratch 樣式的橢圓形白色框

      this.appendDummyInput()
        .appendField("在") // "在 [列表] 裡的項目編號"
        .appendField(
          new Blockly.FieldVariable("myList", undefined, ["list"], "list"), // 限制變數類型為「列表」
          "LIST"
        )
        .appendField("裡的項目編號");

      this.setInputsInline(true); // ✅ 保持 Scratch 樣式
      this.setOutput(true, "Number"); // ✅ 返回數字類型
      this.setStyle("list_blocks"); // ✅ 設定 Scratch 列表風格
      this.setTooltip("取得指定值在列表中的位置");
    },
  };


  javascriptGenerator.forBlock["scratch_list_indexof"] = function (block) {
    const listName = javascriptGenerator.nameDB_?.getName(
      block.getFieldValue("LIST"),
      Blockly.Names.NameType.VARIABLE
    ) || "undefined_list";

    let item = javascriptGenerator.valueToCode(block, "ITEM", Order.ATOMIC) || '""';

    return [
      `(${listName} = ${listName} || [], 
        ${listName}.map(x => isNaN(x) ? String(x).trim() : Number(x))
        .indexOf(isNaN(${item}) ? String(${item}).trim() : Number(${item})) + 1 || 0)`,
      Order.ATOMIC
    ];
  };



  // 二維清單積木設計

  Blockly.Blocks["scratch_list2d_setsize"] = {

    init: function () {
      this.appendDummyInput()
        .appendField("設定")
        .appendField(
          new Blockly.FieldVariable("", undefined, ["list2d"], "list2d"),
          "LIST"
        );

      let indexInput = this.appendValueInput("INDEX").setCheck("Number").appendField("的列大小為");

      // ✅ 設定 `INDEX` 的白色橢圓 Shadow Block（數字輸入框）
      let indexShadow = document.createElement("shadow");
      indexShadow.setAttribute("type", "math_number");
      let indexField = document.createElement("field");
      indexField.setAttribute("name", "NUM");
      indexField.textContent = "1"; // 預設值
      indexShadow.appendChild(indexField);
      indexInput.connection.setShadowDom(indexShadow); // ✅ 讓 `INDEX` 變成 Scratch 樣式

      let itemInput = this.appendValueInput("ITEM").setCheck(null).appendField(",欄大小為");

      // ✅ 設定 `ITEM` 的白色橢圓 Shadow Block（文字輸入框）
      let itemShadow = document.createElement("shadow");
      itemShadow.setAttribute("type", "scratch_text");
      let itemField = document.createElement("field");
      itemField.setAttribute("name", "TEXT");
      itemField.textContent = "1"; // 預設值
      itemShadow.appendChild(itemField);
      itemInput.connection.setShadowDom(itemShadow); // ✅ 讓 `ITEM` 變成 Scratch 樣式


      let inititemInput = this.appendValueInput("INIT").setCheck(null).appendField(",元素初始為");

      let inititemShadow = document.createElement("shadow");
      inititemShadow.setAttribute("type", "scratch_text");
      let inititemField = document.createElement("field");
      inititemField.setAttribute("name", "TEXT");
      inititemField.textContent = "0";
      inititemShadow.appendChild(inititemField); // ✅ 修正這行
      inititemInput.connection.setShadowDom(inititemShadow);


      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("list_blocks");
      this.setTooltip("修改指定位置的項目");
    },

  };
  javascriptGenerator.forBlock["scratch_list2d_setsize"] = function (block) {
    const listName = javascriptGenerator.nameDB_.getName(
      block.getFieldValue("LIST"),
      Blockly.Names.NameType.VARIABLE
    );
    const rows = javascriptGenerator.valueToCode(block, "INDEX", Order.ATOMIC) || "1";
    const cols = javascriptGenerator.valueToCode(block, "ITEM", Order.ATOMIC) || "1";
    const init = javascriptGenerator.valueToCode(block, "INIT", Order.ATOMIC) || "0";

    return `${listName} = Array.from({ length: ${rows} }, () => Array.from({ length: ${cols} }, () => ${init}));\n`;
  };

  Blockly.Blocks["scratch_list2d_get"] = {
    init: function () {
      this.appendDummyInput().appendField(
        new Blockly.FieldVariable("", undefined, ["list2d"], "list2d"),
        "LIST"
      );
      this.setOutput(true, null);
      this.setStyle("list_blocks");
      this.setTooltip("取得清單");
    },
  };
  javascriptGenerator.forBlock["scratch_list2d_get"] = function (block) {
    const listName = javascriptGenerator.nameDB_.getName(
      block.getFieldValue("LIST"),
      Blockly.Names.NameType.VARIABLE
    );
    return [listName, Order.ATOMIC];
  };

  // Add item to list
  // Get item at index
  Blockly.Blocks["scratch_list2d_get_item"] = {
    init: function () {
      this.appendDummyInput()
        .appendField(
          new Blockly.FieldVariable("", undefined, ["list2d"], "list2d"),
          "LIST"
        );

      // 第 [row]
      let rowInput = this.appendValueInput("ROW").setCheck("Number").appendField("第");
      let rowShadow = document.createElement("shadow");
      rowShadow.setAttribute("type", "math_number");
      let rowField = document.createElement("field");
      rowField.setAttribute("name", "NUM");
      rowField.textContent = "1";
      rowShadow.appendChild(rowField);
      rowInput.connection.setShadowDom(rowShadow);

      // [col]
      let colInput = this.appendValueInput("COL").setCheck("Number").appendField("列,第");
      let colShadow = document.createElement("shadow");
      colShadow.setAttribute("type", "math_number");
      let colField = document.createElement("field");
      colField.setAttribute("name", "NUM");
      colField.textContent = "1";
      colShadow.appendChild(colField);
      colInput.connection.setShadowDom(colShadow);

      // 項（結尾詞）
      this.appendDummyInput().appendField("欄項");

      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setStyle("list_blocks");
      this.setTooltip("取得 2D 清單中指定位置的項目");
    },
  };
  javascriptGenerator.forBlock["scratch_list2d_get_item"] = function (block) {
    const listName = javascriptGenerator.nameDB_.getName(
      block.getFieldValue("LIST"),
      Blockly.Names.NameType.VARIABLE
    );
    const row = javascriptGenerator.valueToCode(block, "ROW", Order.ATOMIC) || "1";
    const col = javascriptGenerator.valueToCode(block, "COL", Order.ATOMIC) || "1";

    return [`${listName}[${row} - 1][${col} - 1]`, Order.MEMBER];
  };

  Blockly.Blocks["scratch_list2d_set"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("替換")
        .appendField(
          new Blockly.FieldVariable("", undefined, ["list2d"], "list2d"),
          "LIST"
        );

      // 第 [row]
      let rowInput = this.appendValueInput("ROW").setCheck("Number").appendField("第");
      let rowShadow = document.createElement("shadow");
      rowShadow.setAttribute("type", "math_number");
      let rowField = document.createElement("field");
      rowField.setAttribute("name", "NUM");
      rowField.textContent = "1";
      rowShadow.appendChild(rowField);
      rowInput.connection.setShadowDom(rowShadow);

      // [col]
      let colInput = this.appendValueInput("COL").setCheck("Number").appendField("列,第");
      let colShadow = document.createElement("shadow");
      colShadow.setAttribute("type", "math_number");
      let colField = document.createElement("field");
      colField.setAttribute("name", "NUM");
      colField.textContent = "1";
      colShadow.appendChild(colField);
      colInput.connection.setShadowDom(colShadow);

      // 項為 [value]
      let itemInput = this.appendValueInput("ITEM").setCheck(null).appendField("欄項為");
      let itemShadow = document.createElement("shadow");
      itemShadow.setAttribute("type", "scratch_text");
      let itemField = document.createElement("field");
      itemField.setAttribute("name", "TEXT");
      itemField.textContent = "新值";
      itemShadow.appendChild(itemField);
      itemInput.connection.setShadowDom(itemShadow);

      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("list_blocks");
      this.setTooltip("修改 2D 清單中指定位置的項目");
    },
  };

  javascriptGenerator.forBlock["scratch_list2d_set"] = function (block) {
    const field = block.getField("LIST");
    if (!field) {
      console.warn("Field 'LIST' not found on block:", block);
      return "";
    }

    const listName = javascriptGenerator.nameDB_.getName(
      field.getText(),
      Blockly.Names.NameType.VARIABLE
    );

    const row = javascriptGenerator.valueToCode(block, "ROW", Order.ATOMIC) || "1";
    const col = javascriptGenerator.valueToCode(block, "COL", Order.ATOMIC) || "1";
    const value = javascriptGenerator.valueToCode(block, "ITEM", Order.NONE) || "0";

    return `${listName}[${row} - 1][${col} - 1] = ${value};\n`;
  };




  // @ts-expect-error properties to be added to Blockly.Block to make it a ScratchFunctionBlock
  const functionMixin: ScratchFunctionBlock = {
    parameters_: [] as ScratchFunctionParameter[],

    addParameter: function (
      name: string,
      type: ScratchFunctionParameter["type"],
    ) {
      const stackInput = this.getInput("STACK");
      const stackConnection = stackInput?.connection;
      const stackTarget = stackConnection?.targetBlock();
      if (stackInput) {
        this.removeInput("STACK");
      }

      if (!this.parameters_) this.parameters_ = [];
      this.parameters_.push({ name, type });

      if (type === "Label") {
        this.appendDummyInput(name).appendField(name);
      } else {
        const input = this.appendValueInput(name).setCheck(
          type === "NumberString" ? ["Number", "String"] : "Boolean",
        );

        const workspace = this.workspace;
        const paramBlock = workspace.newBlock("scratch_function_param");
        paramBlock.setShadow(true); // workaround to duplicated scratch_function_param blocks on deserialization and copy
        paramBlock.setMovable(false);
        paramBlock.setFieldValue(name, "PARAM_NAME");
        paramBlock.initSvg();
        paramBlock.render();

        input.connection!.connect(paramBlock.outputConnection);
      }

      if (stackInput) {
        this.appendStatementInput("STACK").setCheck(null);
        if (
          stackTarget &&
          !stackTarget.disposed &&
          stackTarget.previousConnection
        ) {
          this.getInput("STACK")?.connection?.connect(
            stackTarget.previousConnection,
          );
        }
      }
    },

    mutationToDom: function () {
      const container = Blockly.utils.xml.createElement("mutation");
      const name = this.getField("NAME")?.getValue() || "";
      container.setAttribute("name", name);

      this.parameters_.forEach((param) => {
        const xmlParam = Blockly.utils.xml.createElement("arg");
        xmlParam.setAttribute("name", param.name);
        xmlParam.setAttribute("type", param.type);
        container.appendChild(xmlParam);
      });

      return container;
    },

    domToMutation: function (xmlElement: Element) {
      if (!this.parameters_) this.parameters_ = [];

      const name = xmlElement.getAttribute("name") || "";
      const nameField = this.getField("NAME");
      if (nameField) {
        nameField.setValue(name);
      }

      const inputs = this.inputList.slice();
      for (const input of inputs) {
        if (!["HEADER", "STACK"].includes(input.name)) {
          this.removeInput(input.name);
        }
      }

      for (let i = 0, childNode; (childNode = xmlElement.childNodes[i]); i++) {
        if (childNode.nodeName.toLowerCase() === "arg") {
          childNode = childNode as Element;
          const paramName = childNode.getAttribute("name");
          const paramType = childNode.getAttribute(
            "type",
          ) as ScratchFunctionParameter["type"];
          if (paramName && paramType) {
            this.addParameter(paramName, paramType);
          }
        }
      }
    },
  };
  Blockly.Blocks["scratch_function_create"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("定義")
        .appendField(new Blockly.FieldLabel("新積木"), "NAME");
      this.setStyle("procedure_blocks");
      this.setInputsInline(true);
      this.parameters_ = [];
    },
    ...functionMixin,
  };

  Blockly.Blocks["scratch_function_definition"] = {
    init: function () {
      this.appendDummyInput("HEADER")
        .appendField("定義")
        .appendField(new Blockly.FieldLabel(" "), "NAME");
      this.appendStatementInput("STACK").setCheck(null);
      this.setStyle("procedure_blocks");
      this.setInputsInline(true);
      this.parameters_ = [];
    },
    ...functionMixin,
  };

  javascriptGenerator.forBlock["scratch_function_definition"] = function (
    block,
  ) {
    const funcName = block.getFieldValue("NAME");
    const branch = javascriptGenerator.statementToCode(block, "STACK");
    // @ts-expect-error block is actually of type FunctionBlock
    const params = (block.parameters_ as ScratchFunctionParameter[])
      .filter((param) => param.type !== "Label")
      .map((param) => param.name)
      .join(", ");
    return `function ${funcName}(${params}) {\n${branch}}\n`;
  };

  Blockly.Blocks["scratch_function_call"] = {
    init: function () {
      this.appendDummyInput("HEADER").appendField(
        new Blockly.FieldLabel(" "),
        "NAME",
      );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle("procedure_blocks");
      this.setInputsInline(true);
      this.parameters_ = [];
    },
    ...functionMixin,

    addParameter: function (
      name: string,
      type: ScratchFunctionParameter["type"],
    ) {
      if (!this.parameters_) this.parameters_ = [];
      this.parameters_.push({ name, type });

      this.appendDummyInput("DUMMY_TEXT").appendField(name + ":");
      if (type !== "Label") {
        this.appendValueInput(name).setCheck(
          type === "NumberString" ? ["Number", "String"] : "Boolean",
        );
      }
    },
  };

  javascriptGenerator.forBlock["scratch_function_call"] = function (block) {
    const funcName = block.getFieldValue("NAME");
    // @ts-expect-error block is actually of type FunctionBlock
    const values = (block.parameters_ as ScratchFunctionParameter[])
      .filter((param) => param.type !== "Label")
      .map(
        (param) =>
          javascriptGenerator.valueToCode(block, param.name, Order.NONE) ||
          "null",
      );
    return `${funcName}(${values.join(", ")});\n`;
  };

  Blockly.Blocks["scratch_function_param"] = {
    init: function () {
      this.appendDummyInput().appendField(
        new Blockly.FieldLabel(""),
        "PARAM_NAME",
      );
      this.setOutput(true, null);
      this.setStyle("procedure_parameter_blocks");
    },

    mutationToDom: function () {
      const container = Blockly.utils.xml.createElement("mutation");
      container.setAttribute("name", this.getFieldValue("PARAM_NAME"));
      container.setAttribute(
        "paramtype",
        this.outputConnection?.check_?.[0] || "",
      );
      return container;
    },

    domToMutation: function (xmlElement: Element) {
      const name = xmlElement.getAttribute("name");
      const paramType = xmlElement.getAttribute("paramtype");
      if (name) {
        this.setFieldValue(name, "PARAM_NAME");
      }
      if (paramType) {
        this.setOutput(true, paramType);
      }
    },
  };

  javascriptGenerator.forBlock["scratch_function_param"] = function (block) {
    return [block.getFieldValue("PARAM_NAME"), Order.ATOMIC];
  };


  Blockly.Blocks["scratch_logic_compare"] = {
    init: function () {
      // this.appendValueInput("A").setCheck(["Number", "String"]);
      this.appendValueInput("A").setCheck(null);
      this.appendValueInput("B")
        // .setCheck(["Number", "String"])
        .setCheck(null)
        .appendField(
          new Blockly.FieldDropdown([
            ["=", "EQ"],
            ["≠", "NEQ"],
            ["<", "LT"],
            [">", "GT"],
            ["≤", "LTE"],
            ["≥", "GTE"],
          ]),
          "OP",
        );

      this.setInputsInline(true);
      this.setOutput(true, "Boolean");
      this.setStyle("calculation_blocks");
    },
  };
  // javascriptGenerator.forBlock["scratch_logic_compare"] = function (block) {
  //   const operator = block.getFieldValue("OP");
  //   const order = Order.RELATIONAL;
  //   let A = javascriptGenerator.valueToCode(block, "A", order) || "0";
  //   let B = javascriptGenerator.valueToCode(block, "B", order) || "0";

  //   const operators: { [key: string]: string } = {
  //     EQ: "===",
  //     NEQ: "!==",
  //     LT: "<",
  //     GT: ">",
  //     LTE: "<=",
  //     GTE: ">=",
  //   };

  //   const isLiteralString = (v: string): boolean =>
  //     typeof v === "string" && (v.startsWith('"') || v.startsWith("'"));

  //   // 決定比較方式：
  //   let code = "";

  //   if (!isLiteralString(A) && !isLiteralString(B)) {
  //     // 都不是字串字面值，進行數值比較
  //     A = `Number(${A})`;
  //     B = `Number(${B})`;
  //     code = `${A} ${operators[operator]} ${B}`;
  //   } else {
  //     // 任一是字串，則都轉成字串比較
  //     A = `String(${A})`;
  //     B = `String(${B})`;
  //     code = `${A} ${operators[operator]=="==="?"==":operators[operator]} ${B}`;
  //   }


  //   return [code, order];
  // };
  javascriptGenerator.forBlock["scratch_logic_compare"] = function (block) {
    const operator = block.getFieldValue("OP");
    const order = Order.RELATIONAL;

    // 取得 A 和 B 的值
    let A = javascriptGenerator.valueToCode(block, "A", order) || "0";
    let B = javascriptGenerator.valueToCode(block, "B", order) || "0";

    const operators: { [key: string]: string } = {
      EQ: "===",
      NEQ: "!==",
      LT: "<",
      GT: ">",
      LTE: "<=",
      GTE: ">=",
    };

    // 檢查是否能轉換為數字
    //const isNumeric = (value: string): boolean => !isNaN(parseFloat(value));

    // 判斷 A 和 B 是否可以被轉換為數字
    //const isANumeric = isNumeric(A);
    //const isBNumeric = isNumeric(B);

    let code = "";

    code += `(Number.isNaN(Number(${A})) || Number.isNaN(Number(${B}))?String(${A}) ${operators[operator]} String(${B}):Number(${A}) ${operators[operator]} Number(${B}))`;

    //code += `(Number.isNaN(Number(${A}))? String(${A}):Number(${A})) ${operators[operator]} (!Number(${B})? String(${B}):Number(${B}))`;
    //code = `Number(${A}) ${operators[operator]} Number(${B})`;

    //code = `${A} ${operators[operator]} ${B}`;

    //code += `}catch(e){`;

    //AA = `String(${A})`;
    //BB = `String(${B})`;
    //code += `String(${A}) ${operators[operator] === "===" ? "===" : operators[operator]} String(${B})`;
    //if (isANumeric && isBNumeric) {
    //  A = `Number(A)`;
    //  B = `Number(B)`;
    //  code = `${A} ${operators[operator]} ${B}`;
    //} else {
    //  // 否則，進行字串比較
    //  A = `String(${A})`;
    //  B = `String(${B})`;
    //  code = `${A} ${operators[operator] === "===" ? "===" : operators[operator]} ${B}`;
    //}
    // console.log(code);
    // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    return [code, order];
  };


  // javascriptGenerator.forBlock["scratch_logic_compare"] = function (block) {
  //   const operator = block.getFieldValue("OP");
  //   const order = Order.RELATIONAL;
  //   let argument0: string | number =
  //     javascriptGenerator.valueToCode(block, "A", order) || "0";
  //   let argument1: string | number =
  //     javascriptGenerator.valueToCode(block, "B", order) || "0";

  //   const operators: { [key: string]: string } = {
  //     EQ: "===",
  //     NEQ: "!==",
  //     LT: "<",
  //     GT: ">",
  //     LTE: "<=",
  //     GTE: ">=",
  //   };

  //   function isNumericString(str: string) {
  //     if (!str.startsWith('"') && !str.startsWith("'")) return false;
  //     const value = str.slice(1, -1);
  //     return !isNaN(parseFloat(value));
  //   }

  //   const isArg0String = argument0.startsWith('"') || argument0.startsWith("'");
  //   const isArg1String = argument1.startsWith('"') || argument1.startsWith("'");

  //   // If both are string literals, check if they're both numbers
  //   if (isArg0String && isArg1String) {
  //     if (isNumericString(argument0) && isNumericString(argument1)) {
  //       // Convert both to numbers
  //       argument0 = parseFloat(argument0.slice(1, -1));
  //       argument1 = parseFloat(argument1.slice(1, -1));
  //     }
  //   } else if (isArg0String || isArg1String) {
  //     // If only one is a string literal and it's not numeric, convert both to strings
  //     if (
  //       (isArg0String && !isNumericString(argument0)) ||
  //       (isArg1String && !isNumericString(argument1))
  //     ) {
  //       if (!isArg0String) {
  //         argument0 = `String(${argument0})`;
  //       }
  //       if (!isArg1String) {
  //         argument1 = `String(${argument1})`;
  //       }
  //     } else {
  //       // One is a numeric string and one is a number, convert to numbers
  //       if (isArg0String) argument0 = argument0.slice(1, -1);
  //       if (isArg1String) argument1 = argument1.slice(1, -1);
  //     }
  //   }

  //   const code = `${argument0} ${operators[operator]} ${argument1}`;
  //   return [code, order];
  // };

  // const functionMixin: ScratchFunctionBlock = {
  //   parameters_: [] as ScratchFunctionParameter[],

  //   addParameter: function (
  //     name: string,
  //     type: ScratchFunctionParameter["type"]
  //   ) {
  //     const stackInput = this.getInput("STACK");
  //     const stackConnection = stackInput?.connection;
  //     const stackTarget = stackConnection?.targetBlock();
  //     if (stackInput) {
  //       this.removeInput("STACK");
  //     }

  //     if (!this.parameters_) this.parameters_ = [];
  //     this.parameters_.push({ name, type });

  //     if (type === "Label") {
  //       this.appendDummyInput(name).appendField(name);
  //     } else {
  //       const input = this.appendValueInput(name).setCheck(
  //         type === "NumberString" ? ["Number", "String"] : "Boolean"
  //       );

  //       // const workspace = this.workspace;
  //       // const paramBlock = workspace.newBlock("scratch_function_param");
  //       // // paramBlock.setShadow(true); // alternative workaround to duplicated scratch_function_param blocks on deserialization
  //       // paramBlock.setMovable(false);
  //       // paramBlock.setFieldValue(name, "PARAM_NAME");
  //       // paramBlock.initSvg();
  //       // paramBlock.render();

  //       // input.connection!.connect(paramBlock.outputConnection);
  //     }

  //     if (stackInput) {
  //       this.appendStatementInput("STACK").setCheck(null);
  //       if (
  //         stackTarget &&
  //         !stackTarget.disposed &&
  //         stackTarget.previousConnection
  //       ) {
  //         this.getInput("STACK")?.connection?.connect(
  //           stackTarget.previousConnection
  //         );
  //       }
  //     }
  //   },

  //   mutationToDom: function () {
  //     const container = Blockly.utils.xml.createElement("mutation");
  //     const name = this.getField("NAME")?.getValue() || "";
  //     container.setAttribute("name", name);

  //     this.parameters_.forEach((param) => {
  //       const xmlParam = Blockly.utils.xml.createElement("arg");
  //       xmlParam.setAttribute("name", param.name);
  //       xmlParam.setAttribute("type", param.type);
  //       container.appendChild(xmlParam);
  //     });

  //     return container;
  //   },

  //   domToMutation: function (xmlElement: Element) {
  //     if (!this.parameters_) this.parameters_ = [];

  //     const name = xmlElement.getAttribute("name") || "";
  //     const nameField = this.getField("NAME");
  //     if (nameField) {
  //       nameField.setValue(name);
  //     }

  //     const inputs = this.inputList.slice();
  //     for (const input of inputs) {
  //       if (!["HEADER", "STACK"].includes(input.name)) {
  //         this.removeInput(input.name);
  //       }
  //     }

  //     for (let i = 0, childNode; (childNode = xmlElement.childNodes[i]); i++) {
  //       if (childNode.nodeName.toLowerCase() === "arg") {
  //         childNode = childNode as Element;
  //         const paramName = childNode.getAttribute("name");
  //         const paramType = childNode.getAttribute(
  //           "type"
  //         ) as ScratchFunctionParameter["type"];
  //         if (paramName && paramType) {
  //           this.addParameter(paramName, paramType);
  //         }
  //       }
  //     }
  //   },
  // };

  // Blockly.Blocks["scratch_function_create"] = {
  //   init: function () {
  //     this.appendDummyInput()
  //       .appendField("定義")
  //       .appendField(new Blockly.FieldLabel("新積木"), "NAME");
  //     this.setStyle("procedure_blocks");
  //     this.setInputsInline(true);
  //     this.parameters_ = [];
  //   },
  //   ...functionMixin,
  // };

  // Blockly.Blocks["scratch_function_definition"] = {
  //   init: function () {
  //     this.appendDummyInput("HEADER")
  //       .appendField("定義")
  //       .appendField(new Blockly.FieldLabel(" "), "NAME");
  //     this.appendStatementInput("STACK").setCheck(null);
  //     this.setStyle("procedure_blocks");
  //     this.setInputsInline(true);
  //     this.parameters_ = [];
  //   },
  //   ...functionMixin,
  // };

  // javascriptGenerator.forBlock["scratch_function_definition"] = function (
  //   block
  // ) {
  //   const funcName = block.getFieldValue("NAME");
  //   const branch = javascriptGenerator.statementToCode(block, "STACK");
  //   // @ts-expect-error block is actually of type FunctionBlock
  //   const params = (block.parameters_ as ScratchFunctionParameter[])
  //     .filter((param) => param.type !== "Label")
  //     .map((param) => param.name)
  //     .join(", ");
  //   return `function ${funcName}(${params}) {\n${branch}}\n`;
  // };

  // Blockly.Blocks["scratch_function_call"] = {
  //   init: function () {
  //     this.appendDummyInput("HEADER").appendField(
  //       new Blockly.FieldLabel(" "),
  //       "NAME"
  //     );
  //     this.setPreviousStatement(true, null);
  //     this.setNextStatement(true, null);
  //     this.setStyle("procedure_blocks");
  //     this.setInputsInline(true);
  //     this.parameters_ = [];
  //   },
  //   ...functionMixin,

  //   addParameter: function (
  //     name: string,
  //     type: ScratchFunctionParameter["type"]
  //   ) {
  //     if (!this.parameters_) this.parameters_ = [];
  //     this.parameters_.push({ name, type });

  //     this.appendDummyInput("DUMMY_TEXT").appendField(name + ":");
  //     if (type !== "Label") {
  //       this.appendValueInput(name).setCheck(
  //         type === "NumberString" ? ["Number", "String"] : "Boolean"
  //       );
  //     }
  //   },
  // };

  // javascriptGenerator.forBlock["scratch_function_call"] = function (block) {
  //   const funcName = block.getFieldValue("NAME");
  //   // @ts-expect-error block is actually of type FunctionBlock
  //   const values = (block.parameters_ as ScratchFunctionParameter[])
  //     .filter((param) => param.type !== "Label")
  //     .map(
  //       (param) =>
  //         javascriptGenerator.valueToCode(block, param.name, Order.NONE) ||
  //         "null"
  //     );
  //   return `${funcName}(${values.join(", ")});\n`;
  // };

  // Blockly.Blocks["scratch_function_param"] = {
  //   init: function () {
  //     this.appendDummyInput().appendField(
  //       new Blockly.FieldLabel(""),
  //       "PARAM_NAME"
  //     );
  //     this.setOutput(true, null);
  //     this.setStyle("procedure_parameter_blocks");

  //     this.setOnChange((event: Blockly.Events.Abstract) => {
  //       if (
  //         event.type === Blockly.Events.BLOCK_MOVE ||
  //         event.type === Blockly.Events.BLOCK_CREATE
  //       ) {
  //         this.checkContext();
  //       }
  //     });
  //   },

  //   checkContext: function () {
  //     if (this.isInFlyout) return;

  //     const parent = this.getParent();
  //     if (!parent) return;

  //     const paramName = this.getFieldValue("PARAM_NAME");
  //     const workspace = this.workspace;
  //     const functionBlocks: ScratchFunctionBlock[] = workspace.getBlocksByType(
  //       "scratch_function_definition"
  //     );

  //     const ownerFunction = functionBlocks.find((block) =>
  //       block.parameters_.some((param) => param.name === paramName)
  //     );
  //     if (!ownerFunction) return;

  //     const ownerFunctionName = ownerFunction.getFieldValue("NAME");
  //     // eslint-disable-next-line @typescript-eslint/no-this-alias
  //     let currentBlock: Blockly.Block | null = this;
  //     let isInCorrectContext = false;
  //     let currentFunctionName: string | null = null;

  //     while (currentBlock) {
  //       if (currentBlock.type === "scratch_function_definition") {
  //         isInCorrectContext = currentBlock.id === ownerFunction.id;
  //         if (!isInCorrectContext) {
  //           currentFunctionName = currentBlock.getFieldValue("NAME");
  //         }
  //         break;
  //       }
  //       currentBlock = currentBlock.getParent();
  //     }

  //     this.setDisabledReason(!isInCorrectContext, "incorrect_context");
  //     this.setWarningText(
  //       isInCorrectContext ? null : "這個參數只能在它所屬的函式中使用"
  //     );

  //     if (isInCorrectContext) {
  //       this.setWarningText(null);
  //     } else if (currentFunctionName) {
  //       this.setWarningText(
  //         `此參數屬於函式 "${ownerFunctionName}"，不能在函式 "${currentFunctionName}" 裡使用`
  //       );
  //     } else {
  //       this.setWarningText(`此參數只能函式 "${ownerFunctionName} 裡使用`);
  //     }

  //     // If the block is disabled and connected, disconnect it
  //     if (!isInCorrectContext && this.outputConnection?.targetConnection) {
  //       this.outputConnection.disconnect();
  //     }
  //   },

  //   mutationToDom: function () {
  //     const container = Blockly.utils.xml.createElement("mutation");
  //     container.setAttribute("name", this.getFieldValue("PARAM_NAME"));
  //     container.setAttribute(
  //       "paramtype",
  //       this.outputConnection?.check_?.[0] || ""
  //     );
  //     return container;
  //   },

  //   domToMutation: function (xmlElement: Element) {
  //     const name = xmlElement.getAttribute("name");
  //     const paramType = xmlElement.getAttribute("paramtype");
  //     if (name) {
  //       this.setFieldValue(name, "PARAM_NAME");
  //     }
  //     if (paramType) {
  //       this.setOutput(true, paramType);
  //     }
  //   },
  // };

  // javascriptGenerator.forBlock["scratch_function_param"] = function (block) {
  //   return [block.getFieldValue("PARAM_NAME"), Order.ATOMIC];
  // };
}

// Colors based on Scratch's color palette
// https://github.com/scratchfoundation/scratch-blocks/wiki/Colors
export const scratchTheme = Blockly.Theme.defineTheme("scratch", {
  name: "scratch",
  base: Blockly.Themes.Classic,
  blockStyles: {
    event_category: {
      colourPrimary: "#5CB1D6", // 事件
      colourSecondary: "#4AA8C4",
      colourTertiary: "#4098B0",
    },
    // event_category: { colour: "#5CB1D6" },
    // loop => control
    control_blocks: {
      colourPrimary: "#FFAB19",
      colourSecondary: "#EC9C13",
      colourTertiary: "#CC9900",
    },
    loop_blocks: {
      colourPrimary: "#FFAB19",
      colourSecondary: "#EC9C13",
      colourTertiary: "#CC9900",
    },

    // math, logic => calculation
    calculation_blocks: {
      colourPrimary: "#59C059",
      colourSecondary: "#46B946",
      colourTertiary: "#389438",
    },
    math_blocks: {
      colourPrimary: "#59C059",
      colourSecondary: "#46B946",
      colourTertiary: "#389438",
    },
    logic_blocks: {
      colourPrimary: "#59C059",
      colourSecondary: "#46B946",
      colourTertiary: "#389438",
    },

    variable_blocks: {
      colourPrimary: "#FF8C1A",
      colourSecondary: "#FF8000",
      colourTertiary: "#DB6E00",
    },

    // Slightly deeper orange than variable
    list_blocks: {
      colourPrimary: "#FD6723",
      colourSecondary: colors.orange[600],
      colourTertiary: colors.orange[700],
    },

    procedure_blocks: {
      colourPrimary: "#FF6680",
      colourSecondary: "#FF4D6A",
      colourTertiary: "#FF3355",
    },

    procedure_parameter_blocks: {
      colourPrimary: "#FF3355",
      colourSecondary: "#FF3355",
      colourTertiary: "#FF3355",
    },
  },
  categoryStyles: {
    event_category: { colour: "#5CB1D6" },
    exclusive_category: { colour: colors.red[500] },
    control_category: { colour: "#FFAB19" },
    calculation_category: { colour: "#59C059" },
    list_category: { colour: "#FD6723" },
    variable_category: { colour: "#FF8C1A" },
    procedure_category: { colour: "FF6680" },
  },
  componentStyles: {
    workspaceBackgroundColour: colors.gray[50],
    toolboxBackgroundColour: colors.gray[200],
    toolboxForegroundColour: colors.gray[900],
    flyoutBackgroundColour: colors.gray[100],
    flyoutForegroundColour: colors.gray[900],
    flyoutOpacity: 0.9,
    scrollbarColour: colors.gray[300],
    insertionMarkerColour: colors.gray[500],
    insertionMarkerOpacity: 0.3,
    scrollbarOpacity: 0.4,
  },
  fontStyle: {
    weight: "bold",
  },
  startHats: true,
});

export const scratchToolboxConfig = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "事件",
      categorystyle: "event_category",
      contents: [
        { kind: "block", type: "event_whenflagclicked" },
        {
          kind: "block",
          type: "event_askandwait",
          inputs: {
            TEXT: {
              shadow: {
                type: "scratch_text",
                fields: {
                  NUM: "你的名字是?",
                },
              },
              // shadow: {

              // },
            },
          },

        },
        { kind: "block", type: "event_answer" },
        {
          kind: "block",
          type: "event_say",
          inputs: {
            TEXT: {
              shadow: {
                type: "scratch_text",
                fields: {
                  TEXT: "",
                },
              },
            },

            // TEXT: {}, // 確保輸入框為空，無預設值
          },
        },
        // { kind: "block", type: "event_noinput" },
        // { kind: "block", type: "event_hasinput" },

      ],
    },
    {
      kind: "category",
      name: "控制",
      categorystyle: "control_category",
      contents: [
        {
          kind: "block",
          type: "scratch_if",
        },
        {
          kind: "block",
          type: "scratch_ifElse",
        },
        {
          kind: "block",
          type: "scratch_repeat_ext",
          inputs: {
            TIMES: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: "10",
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "scratch_while",
        },
        {
          kind: "block",
          type: "scratch_whileUntil",
        },
        {
          kind: "block",
          type: "scratch_controls_flow_statements",
        },
      ],
    },
    {
      kind: "category",
      name: "運算",
      categorystyle: "calculation_category",
      contents: [
        {
          kind: "block",
          type: "logic_boolean",
        },
        {
          kind: "block",
          // type: "logic_compare",
          type: "scratch_logic_compare",
          inputs: {
            A: {
              shadow: {
                type: "scratch_text",
                fields: {
                  // NUM: "0",
                  TEXT: "0",
                },
              },
            },
            B: {
              shadow: {
                type: "scratch_text",
                fields: {
                  // NUM: "0",
                  TEXT: "0",
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "logic_operation",
        },
        {
          kind: "block",
          type: "logic_negate",
        },
        // {
        //   kind: "block",
        //   type: "math_number",
        // },
        {
          kind: "block",
          type: "scratch_math_arithmetic",
          inputs: {
            A: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: "",
                },
              },
            },
            B: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: "",
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_single",
          inputs: {
            NUM: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: "9",
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_round",
          inputs: {
            NUM: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: "3.1",
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_modulo",
          inputs: {
            DIVIDEND: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: "64",
                },
              },
            },
            DIVISOR: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: "10",
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_random_int",
          inputs: {
            FROM: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: "1",
                },
              },
            },
            TO: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: "100",
                },
              },
            },
          },
        },
        // {
        //   kind: "block",
        //   type: "scratch_text",
        //   fields: {
        //     TEXT: "abc",
        //   },
        // },
        {
          kind: "block",
          type: "scratch_string_join",
          inputs: {
            TEXT0: {
              shadow: {
                type: "scratch_text",
                fields: {
                  TEXT: "abc",
                },
              },
            },
            TEXT1: {
              shadow: {
                type: "scratch_text",
                fields: {
                  TEXT: "def",
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "scratch_string_char_at",
          inputs: {
            STRING: {
              shadow: {
                type: "scratch_text",
                fields: {
                  TEXT: "abc",
                },
              },
            },
            INDEX: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: "1",
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "scratch_string_contains",
          inputs: {
            STRING1: {
              shadow: {
                type: "scratch_text",
                fields: {
                  TEXT: "hello",
                },
              },
            },
            STRING2: {
              shadow: {
                type: "scratch_text",
                fields: {
                  TEXT: "el",
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "scratch_length",
          inputs: {
            VALUE: {
              shadow: {
                type: "scratch_text",
                fields: {
                  TEXT: "abc",
                },
              },
            },
          },
        },
      ],
    },
    {
      kind: "category",
      name: "變數",
      custom: "SCRATCH_VARIABLE",
      categorystyle: "variable_category",
      // contents: [
      //   {
      //     kind: "block",
      //     type: "variables_set",
      //     inputs: {
      //       VALUE: {
      //         shadow: {
      //           type: "scratch_text",
      //           fields: {
      //             TEXT: "0",
      //           },
      //         },
      //       },
      //     },
      //   },
      //   {
      //     kind: "block",
      //     type: "math_change",
      //     inputs: {
      //       VALUE: {
      //         shadow: {
      //           type: "scratch_text",
      //           fields: {
      //             TEXT: "1",
      //           },
      //         },
      //       },
      //     },
      //   },
      // ],
    },
    {
      kind: "category",
      name: "清單",
      custom: "SCRATCH_LIST",
      categorystyle: "list_category",
      contents: [
        {
          kind: "block",
          type: "lists_create_empty",
        },
        {
          kind: "block",
          type: "lists_create_with",
        },
        {
          kind: "block",
          type: "lists_repeat",
        },
        {
          kind: "block",
          type: "lists_length",
        },
        {
          kind: "block",
          type: "lists_isEmpty",
        },
        {
          kind: "block",
          type: "lists_indexOf",
        },
        {
          kind: "block",
          type: "lists_getIndex",
        },
        {
          kind: "block",
          type: "lists_setIndex",
        },
        {
          kind: "block",
          type: "lists_getSublist",
        },
        {
          kind: "block",
          type: "lists_sort",
        },
        {
          kind: "block",
          type: "lists_split",
        },
        {
          kind: "block",
          type: "lists_reverse",
        },
      ],
    },
    // {
    //   kind: "category",
    //   name: "二維清單",
    //   custom: "SCRATCH_LIST2D",
    //   categorystyle: "list_category",
    //   contents: [
    //     //{
    //     //  kind: "block",
    //     //  type: "lists2d_create_empty",
    //     //},
    //     //{
    //     //  kind: "block",
    //     //  type: "lists2d_create_with",
    //     //},
    //     //{
    //     //  kind: "block",
    //     //  type: "lists2d_repeat",
    //     //},
    //     //{
    //     //  kind: "block",
    //     //  type: "lists2d_length",
    //     //},
    //     //{
    //     //  kind: "block",
    //     //  type: "lists2d_isEmpty",
    //     //},
    //     //{
    //     //  kind: "block",
    //     //  type: "lists2d_indexOf",
    //     //},
    //     //{
    //     //  kind: "block",
    //     //  type: "lists2d_getIndex",
    //     //},
    //     //{
    //     //  kind: "block",
    //     //  type: "lists2d_setIndex",
    //     //},
    //     //{
    //     //  kind: "block",
    //     //  type: "lists2d_getSublist",
    //     //},
    //     //{
    //     //  kind: "block",
    //     //  type: "lists2d_sort",
    //     //},
    //     //{
    //     //  kind: "block",
    //     //  type: "lists2d_split",
    //     //},
    //     //{
    //     //  kind: "block",
    //     //  type: "lists2d_reverse",
    //     //},
    //   ],
    // },
    {
      kind: "category",
      name: "函式",
      custom: "SCRATCH_FUNCTION",
      categorystyle: "procedure_category",
    },
  ],
};

export const initialScratchWorkspace = {
  blocks: {
    blocks: [
      // {
      //   type: "scratch_move_function",
      //   id: "scratch_move_function",
      //   x: 250,
      //   y: 150,
      //   inputs: {
      //     CURRENT_X: {
      //       block: {
      //         type: "scratch_param_player_x_stone",
      //         id: "scratch_param_player_x_stone",
      //       },
      //     },
      //     CURRENT_Y: {
      //       block: {
      //         type: "scratch_param_player_y_stone",
      //         id: "scratch_param_player_y_stone",
      //       },
      //     },
      //     COINS: {
      //       block: {
      //         type: "scratch_param_coins_count_stone",
      //         id: "scratch_param_coins_count_stone",
      //       },
      //     },
      //   },
      // },
    ],
  },
};
