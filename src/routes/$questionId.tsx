import { createFileRoute } from '@tanstack/react-router'
import { CodeEditor } from '@/components/CodeEditor'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNavigate } from '@tanstack/react-router'; // 確保使用的是正確的 useNavigate
import { useState, useEffect, useRef, useMemo } from 'react';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import type { ImperativePanelGroupHandle } from 'react-resizable-panels'
import { useLocation } from "@tanstack/react-router";
import { useWorkspaceStore } from "@/stores/workspace";
import flagIcon from "@/assets/icons/flag.svg";
import * as Blockly from "blockly/core";

export const Route = createFileRoute('/$questionId')({
    component: RouteComponent,
})

function RouteComponent() {
    const { questionId } = Route.useParams();

    return <Question id={Number(questionId)} />
}

// 下面都是從 src/routes/question.tsx copy-paste 過來的，我沒改（除了標注✨的）

interface TabItem {
    value: string
    title: string
    content: JSX.Element;
}

function TabComponentWrapper({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col justify-center gap-3">
            {/* ✅ 確保標題來自 API */}
            <h2 className="ml-4 text-3xl font-semibold">{title}</h2>
            <Separator className="bg-gray-300" />
            {children}
        </div>
    );
}

// 點範例按鈕後可以看到的內容// 點範例按鈕後可以看到的內容
interface ExampleButtonProps {
    text: string
    onClick: () => void
    isActive: boolean
}

function ExampleButton({ text, onClick, isActive }: ExampleButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`relative w-[100%] py-4 text-xl font-bold rounded-full shadow-md transition-all border border-gray-300 z-20 ${isActive ? 'bg-[#00D1D0] text-white' : 'bg-white text-[#00D1D0]'}`}
        >
            {text}
        </button>
    )
}

interface ExampleContentProps {
    title: string
    input: string
    output: string
    description: string
    isVisible: boolean
}

function ExampleContent({
    title,
    input,
    output,
    description,
    isVisible,
  }: ExampleContentProps) {
    return (
      <div
        className={`relative w-[100%] max-w-lg bg-[#00A5AD] text-white rounded-lg p-4 shadow-lg overflow-hidden transition-all duration-300 -mt-6 ${
          isVisible ? 'opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="flex justify-between mt-4 p-2 text-white rounded-md border-b">
          <div className="w-1/2 border-r border-gray-300 pr-2">
            <p className="font-bold text-center">輸入</p>
            <div className="mt-1 text-lg ml-2 whitespace-pre-wrap break-words">
              {input.split('\n').map((line, idx) => (
                <div key={idx} className="text-left">{line}</div>
              ))}
            </div>
          </div>
          <div className="w-1/2 pl-2">
            <p className="font-bold text-center">輸出</p>
            <div className="mt-1 text-lg ml-2 whitespace-pre-wrap break-words">
              {output.split('\n').map((line, idx) => (
                <div key={idx} className="text-left">{line}</div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-lg text-left whitespace-pre-wrap break-words">
          {description.split('\n').map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </p>
      </div>
    )
  }
  


// function IntroTab({ questionData }: { questionData: any }) {
//     const [activeExample, setActiveExample] = useState<string | null>(null);
//     const [data, setData] = useState<any | null>(null);

//     useEffect(() => {
//         if (questionData) {
//             setData(questionData);
//         }
//     }, [questionData]); // 監聽 `questionData` 變更，確保 `data` 正確更新

//     if (!data) return <p>載入中...</p>;

//     return (
//         <TabComponentWrapper title={data.title}>
//             <div className="w-full max-w-lg max-h-full overflow-y-auto rounded-lg p-2">
//                 {/* 顯示題目敘述 */}
//                 <div className="w-full px-4 text-xl">
//                     {data.statements.map((statement: any, index: number) => (
//                         <div key={index} className="mb-4">
//                             {statement.text && (
//                                 <p className="mb-2">
//                                     {statement.text.split(/\n|<br>/).map((line: string, index: number) => (
//                                         <span key={index}>
//                                             {line}
//                                             <br />
//                                         </span>
//                                     ))}
//                                 </p>
//                             )}
//                         </div>
//                     ))}
//                 </div>

//                 {/* 顯示範例測試資料 */}
//                 <div className="flex flex-col items-center gap-4 mt-4 w-full max-w-lg justify-content">
//                     {data.example_cases.map((example: any, index: number) => (
//                         <div key={index} className="w-full flex flex-col items-center">
//                             <ExampleButton
//                                 text={example.title}
//                                 isActive={activeExample === example.title}
//                                 onClick={() => setActiveExample(activeExample === example.title ? null : example.title)}
//                             />
//                             {activeExample === example.title && (
//                                 <ExampleContent
//                                     title={example.title}
//                                     input={example.input}
//                                     output={example.output}
//                                     description={example.description}
//                                     isVisible={true}
//                                 />
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </TabComponentWrapper>
//     );
// }
function IntroTab({ questionData }: { questionData: any }) {
    // console.log(questionData);
    const [activeExample, setActiveExample] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);

    useEffect(() => {
        if (questionData) {
            setData(questionData);
        }
    }, [questionData]); // 監聽 `questionData` 變更，確保 `data` 正確更新




    if (!data) return <p>載入中...</p>;

    return (
        <TabComponentWrapper title={data.title}>
            <div className="w-full  max-h-full overflow-y-auto rounded-lg p-2 max-h-[81vh] ">
                {/* 顯示題目敘述 */}
                <div className="w-full px-4 text-xl ">
                    {data.statements.map((statement: any, index: number) => (
                        <div key={index} className="mb-4">
                            {/* {statement.text && (
                                <p className="mb-2">
                                    {statement.text.split(/\n|<br>/).map((line: string, index: number) => (
                                        <span key={index}>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
                                </p>
                            )} */}
                            {/* 處理文字內容 */}
                            {statement.text && (
                                <p className="mb-2">
                                    {statement.text.split(/\n|<br>/).map((line: string, idx: number) => (
                                        <span key={idx}>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
                                </p>
                            )}

                            {/* 處理表格內容（如果 `table` 存在且非空） */}
                            {statement.table && statement.table.trim() !== "" && (() => {
                                const parts = statement.table.split(",").map((s: string) => s.trim());
                                const headers = parts.slice(0, 2); // ['場次', '短片代碼']
                                const rows: string[][] = [];

                                for (let i = 2; i < parts.length; i += 2) {
                                    rows.push([parts[i], parts[i + 1]]);
                                }

                                return (
                                    <table className="table-auto w-full border-collapse border border-gray-700 mt-2">
                                        <thead>
                                            <tr>
                                                {headers.map((header:any, index:any) => (
                                                    <th key={index} className="border border-gray-700 px-2 py-1 text-center bg-gray-200">
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, rowIndex) => (
                                                <tr key={rowIndex} className="border border-gray-700">
                                                    {row.map((cell, cellIndex) => (
                                                        <td key={cellIndex} className="border border-gray-700 px-2 py-1 text-center">
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                );
                            })()}


                            {/* 處理圖片內容（如果 `image` 存在且非空） */}
                            {/* {statement.image && statement.image.trim() !== "" && (
                                <div className="flex justify-center mt-2">
                                    <img src={`${apiMain}${statement.image}`} alt="題目圖片" className="max-w-full h-auto rounded-lg shadow" />
                                </div>
                            )} */}
                        </div>
                    ))}
                </div>

                {/* 顯示範例測試資料 */}
                <div className="flex flex-col items-center gap-4 mt-4 w-full max-w-lg justify-content">
                    {data.example_cases.map((example: any, index: number) => (
                        <div key={index} className="w-full flex flex-col items-center">
                            <ExampleButton
                                text={example.title}
                                isActive={activeExample === example.title}
                                onClick={() => setActiveExample(activeExample === example.title ? null : example.title)}
                            />
                            {activeExample === example.title && (
                                <ExampleContent
                                    title={example.title}
                                    input={example.input}
                                    output={example.output}
                                    description={example.description}
                                    isVisible={true}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </TabComponentWrapper>
    );
}
function CodeDrillTab({ questionData, qid }: qProps) {
    const [activeExample, setActiveExample] = useState<string | null>(null);
    const [output, setOutput] = useState<string>("");

    const currentMode = useWorkspaceStore((state) => state.currentMode); // 取得 Blockly 或 Scratch 模式
    const generatedCode = useWorkspaceStore((state) => state.generatedCode); // 取得 Blockly 產生的程式碼
    const generatedXMLCode = useWorkspaceStore((state) => state.generatedXMLCode); // 取得 Blockly 產生的程式碼

    const storedData = localStorage.getItem("stulastsubmit");
    // var parsedLastData = storedData ? JSON.parse(storedData) : { questions: {1:[],2:[]} };
    var parsedLastData = storedData ? JSON.parse(storedData) : { questions: {} };
    if (!parsedLastData.questions[qid]) {
        parsedLastData.questions[qid] = [];
    }

    if (!questionData) return <p>載入中...</p>;

    const drillClick = async () => {
        try {
            // parsedLastData.questions[qid]..questions[qid]
            // console.log(parsedLastData);generatedCode
            // console.log(generatedCode);

            parsedLastData.questions[qid].push({
                bs: currentMode,
                code: generatedXMLCode,
            });
            while (parsedLastData.questions[qid].length > 1) {
                parsedLastData.questions[qid].shift();
            }
            localStorage.setItem("stulastsubmit", JSON.stringify(parsedLastData));

            if (currentMode === "Scratch") {
                const workspace = Blockly.getMainWorkspace();
                const greenFlagBlocks = workspace.getBlocksByType('event_whenflagclicked', false);
                if (!(greenFlagBlocks.length === 1)) {
                    // alert("Scratch 模式下，請恰好使用一個『點擊綠旗』積木！");
                    const result = "";
                    setOutput(result);
                    return;
                }
            }

            setOutput(""); // 清空輸出
            // console.log(generatedCode);
            let sandbox = new Function(`${generatedCode}; return output_result_string;`);
            const result = sandbox();
            setOutput(result);
        } catch (error) {
            console.error("執行錯誤：", error);
            setOutput("執行錯誤！");
        }
    };
    const returnCodeClick = () => {
        const storedData = localStorage.getItem("stulastsubmit");
        const parsedData = storedData ? JSON.parse(storedData) : { questions: {} };

        // 確保該題目有提交過程式碼
        if (!parsedData.questions[qid] || parsedData.questions[qid].length === 0) {
            return; // **如果沒有提交過，直接返回，不做任何操作**
        }

        // 取得該題的最新提交記錄
        const lastSubmission = parsedData.questions[qid][parsedData.questions[qid].length - 1];
        const lastMode = lastSubmission.bs; // Blockly 或 Scratch
        const lastXML = lastSubmission.code ?? `<xml xmlns="https://developers.google.com/blockly/xml"></xml>`;

        // 切換到對應的模式（Blockly / Scratch）
        if (lastMode === "Scratch") {
            useWorkspaceStore.setState({ currentMode: "Scratch" });
        } else {
            useWorkspaceStore.setState({ currentMode: "Blockly" });
        }

        // **確保模式切換後載入程式碼**
        setTimeout(() => {
            useWorkspaceStore.setState({ recordXMLCode: "" }); // 先清空 XML
            setTimeout(() => {
                useWorkspaceStore.setState({ recordXMLCode: lastXML });
                // console.log("✅ 已還原程式碼:", lastXML);
            }, 50);
        }, 50);
    };


    //worker沒有瀏覽器 所以有windows prompt的話都會報錯，因此使用者如果程式crash的話自己要承擔
    // const drillClick = () => {
    //     console.log(generatedCode);
    //     setOutput("執行中...");
    //     const worker = new Worker(new URL("../worker/sandboxWorker.ts", import.meta.url), { type: "module" });

    //     const TIMEOUT_MS = 2000;
    //     let isTerminated = false; // 用來追蹤 Worker 是否已經終止

    //     // 設定超時機制
    //     const timer = setTimeout(() => {
    //         if (!isTerminated) {
    //             isTerminated = true;
    //             worker.terminate();
    //             setOutput("執行時間過長，可能有無窮迴圈，請檢查程式！");
    //         }
    //     }, TIMEOUT_MS);

    //     // Worker 成功回傳結果
    //     worker.onmessage = (event) => {
    //         if (!isTerminated) { // 確保只處理一次回傳結果
    //             clearTimeout(timer);
    //             isTerminated = true;
    //             worker.terminate();
    //             setOutput(event.data.success ? event.data.result : `錯誤: ${event.data.error}`);
    //         }
    //     };

    //     // Worker 發生錯誤
    //     worker.onerror = (error) => {
    //         if (!isTerminated) {
    //             clearTimeout(timer);
    //             isTerminated = true;
    //             worker.terminate();
    //             setOutput(`錯誤: ${error.message}`);
    //         }
    //     };

    //     // 送出程式碼到 Worker 執行
    //     worker.postMessage({ code: generatedCode, timeout: TIMEOUT_MS });
    // };



    return (
        <TabComponentWrapper title={questionData.title}>
            <div className="w-full max-w-lg max-h-full overflow-y-auto rounded-lg p-2">
                {/* 互動區域 */}
                <div className="flex flex-row items-center space-x-4 w-full">
                    <button
                        className="shadow-md px-10 py-3 bg-white border-2 border-green-500 rounded-full flex items-center justify-center w-36 h-12"
                        onClick={drillClick}
                    >
                        {currentMode === "Scratch" ? (
                            <img src={flagIcon} alt="Start" className="w-8 h-8" />
                        ) : (
                            <span className="text-lg font-bold text-green-500 tracking-widest whitespace-nowrap">
                                執行
                            </span>
                        )}
                    </button>
                    <button
                        className="shadow-md px-10 py-3 bg-white border-2 border-green-500 rounded-full flex items-center justify-center w-36 h-12"
                        onClick={returnCodeClick}
                    >
                        <span className="text-lg font-bold text-green-500 tracking-widest whitespace-nowrap">
                            還原程式
                        </span>
                    </button>
                </div>
                <div className="text-left mt-4 w-full">
                    <span className="font-bold text-xl">輸出：</span>
                    <pre className="max-h-[400px] w-full overflow-x-auto overflow-y-auto text-lg font-mono leading-relaxed break-all whitespace-pre-wrap">
                        {output}
                    </pre>
                </div>



                {/* 顯示範例測試資料 */}
                <div className="flex flex-col items-center gap-4 mt-4 w-full max-w-lg">
                    {questionData.example_cases.map((example: any, index: number) => (
                        <div key={index} className="w-full flex flex-col items-center">
                            <ExampleButton
                                text={example.title}
                                isActive={activeExample === example.title}
                                onClick={() =>
                                    setActiveExample(activeExample === example.title ? null : example.title)
                                }
                            />
                            {activeExample === example.title && (
                                <ExampleContent
                                    title={example.title}
                                    input={example.input}
                                    output={example.output}
                                    description={example.description}
                                    isVisible={true}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </TabComponentWrapper>
    );
}


function CheckmarkIcon({ isCorrect }: { isCorrect: boolean }) {
    return (
        <span
            className={`mr-2 font-bold ${isCorrect ? 'text-[#8FFF00]' : 'text-white'}`}
            style={{
                color: isCorrect ? "#8FFF00" : "#FFFFFF",
                // fontSize: isCorrect ? "23px" : "",
                fontWeight: "bold",
                textShadow: isCorrect ? "1px 1px 0 #8FFF00, -1px -1px 0 #8FFF00" : ""
            }}
        >
            {isCorrect ? '✓' : '🗙'}
        </span>
    );
}



function SubmitTab({ questionData, qid }: qProps) {
    const [activeCase, setActiveCase] = useState<string | null>(null);
    const [isEvaluated, setIsEvaluated] = useState(false);
    const [cases, setCases] = useState<any[]>(questionData?.cases || []);
    const [score, setScore] = useState(0);
    const [numerator, setNumerator] = useState(0);
    const [denominator, setDenominator] = useState(0);
    const [loading, setLoading] = useState(false); // 新增 loading 狀態
    // console.log(questionData);

    const generatedCode = useWorkspaceStore((state) => state.generatedCode);
    const [currentMode, setCurrentMode] = useState(useWorkspaceStore.getState().currentMode);
    const generatedXMLCode = useWorkspaceStore((state) => state.generatedXMLCode); // 取得 Blockly 產生的程式碼
    const storedData = localStorage.getItem("stuansers");
    var parsedData = storedData ? JSON.parse(storedData) : { questions: {} };
    useEffect(() => {
        const unsubscribe = useWorkspaceStore.subscribe((state) => {
            setCurrentMode(state.currentMode);
        });
        return () => unsubscribe();
    }, []);

    const executeInWorker = async (code: string, testInputs: (string | number)[], timeout = 3000) => {
        return new Promise((resolve) => {
            const worker = new Worker(new URL("../worker/sandboxWorker.ts", import.meta.url));

            let resolved = false;
            const timer = setTimeout(() => {
                resolved = true;
                resolve(""); // 超時回傳空字串
                worker.terminate();
            }, timeout);

            worker.onmessage = (event) => {
                if (!resolved) {
                    clearTimeout(timer);
                    resolve(event.data.success ? event.data.result : "");
                    worker.terminate();
                }
            };

            worker.postMessage({ code, testInputs, timeout });
        });
    };

    const judgeCode = async () => {
        setLoading(true); // 開始測試，顯示 loader
        if (currentMode === "Scratch") {
            const workspace = Blockly.getMainWorkspace();
            const greenFlagBlocks = workspace.getBlocksByType('event_whenflagclicked', false);
            if (!(greenFlagBlocks.length === 1)) {
                alert("Scratch 模式下，請恰好使用一個『點擊綠旗』積木！");
                setLoading(false);
                return;
            }
        }

        let modifiedCode = generatedCode.replace(
            /window\.prompt\([^\(\)]*\)/g,
            "(testInputs.length > 0 ? testInputs.shift() : (() => { throw new Error('輸入（詢問）次數過多'); })())"
        );

        // const timestamp = new Date().toISOString();
        // const timestamp = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
        // const now = new Date();
        // const taiwanTime = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 轉成 UTC+8
        // const timestamp = taiwanTime.toISOString().slice(11, 19); // 只取 "hh:mm:ss"
        const timestamp = new Date().toISOString();

        // const [currentMode, setCurrentMode] = useState(useWorkspaceStore.getState().currentMode);
        // 如果當前題目還沒有紀錄，初始化為空陣列
        if (!parsedData.questions[qid]) {
            parsedData.questions[qid] = [];
        }
        // console.log(generatedXMLCode);
        // let modifiedCode = generatedCode.replace(

        // 存入當前程式碼，並維護歷史紀錄

        parsedData.questions[qid].push({
            time: timestamp,
            bs: currentMode,
            code: generatedXMLCode,
            score: 0,
            numerator: 0,
            denominator: 0
        });
        while (parsedData.questions[qid].length > 50) {
            parsedData.questions[qid].shift();
        }

        // 將更新後的紀錄存回 LocalStorage
        localStorage.setItem("stuansers", JSON.stringify(parsedData));
        // const parser = new DOMParser();
        // const xmlDoc = parser.parseFromString(generatedXMLCode, "text/xml");

        // console.log(xmlDoc); // 這是 XML 轉換後的物件

        // console.log(JSON.parse(storedData as string)); // ✅ 以物件格式印出


        // 使用 Promise.all 等待所有測試案例結果
        const studentOutputs = await Promise.all(
            cases.map(async (group: any) => ({
                group_title: group.group_title,
                subcase: await Promise.all(
                    group.subcase.map(async (sub: any) => {
                        let testInputs: (string | number)[] = [];

                        if (typeof sub.input === "string") {
                            sub.input
                                .split(/[\s,]+/)
                                .map((i: string) => i.trim())
                                .filter((i: string) => i.length > 0)
                                .forEach((i: string) => {
                                    const num: number = Number(i);
                                    testInputs.push(isNaN(num) ? i : num);
                                });
                        }

                        // 執行 Worker
                        let result = "";
                        try {
                            result = await executeInWorker(modifiedCode, testInputs) as string;
                        } catch (error: any) {
                            console.error("❌ 執行錯誤:", error);
                            result = `錯誤: ${error.message}`;
                        }

                        return {
                            ...sub,
                            student_output: result,
                            result: result.replace(/\s+/g, "").trim() === sub.output.replace(/\s+/g, "").trim()
                        };
                    })
                ),
            }))
        );



        // 更新測試結果
        setIsEvaluated(true);
        setCases(studentOutputs);
        setScore(calculateScore(studentOutputs));
        // 將當前程式碼成績紀錄下來

        // parsedData.questions[qid][parsedData.questions[qid].length - 1].numerator = numerator;
        // parsedData.questions[qid][parsedData.questions[qid].length - 1].denominator = denominator;

        // 將更新後的紀錄存回 LocalStorage


        setLoading(false); // 測試完成，隱藏 loader
    };

    const calculateScore = (cases: any) => {
        let totalTests = 0;
        let correctCount = 0;

        cases.forEach((group: any) => {
            group.subcase.forEach((sub: any) => {
                totalTests += Number(sub.score);
                if (sub.result) correctCount += Number(sub.score);
            });
        });
        setNumerator(correctCount);
        setDenominator(totalTests);
        const calculatedScore = Math.round((correctCount / totalTests) * 100);
        parsedData.questions[qid][parsedData.questions[qid].length - 1].score = calculatedScore;
        parsedData.questions[qid][parsedData.questions[qid].length - 1].numerator = correctCount;
        parsedData.questions[qid][parsedData.questions[qid].length - 1].denominator = totalTests;
        localStorage.setItem("stuansers", JSON.stringify(parsedData));
        console.log(parsedData);
        return totalTests === 0 ? 0 : Math.round((correctCount / totalTests) * 100);
    };

    return (
        <TabComponentWrapper title={questionData.title}>
            <div className="w-full max-w-lg h-full overflow-y-auto rounded-lg p-2">
                {/* 進度條 */}
                <div className="w-full max-w-lg bg-gray-200 rounded-full h-6 flex items-center relative">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: isEvaluated ? `${score}%` : "0%",
                            backgroundColor: isEvaluated ? "#28af68ff" : undefined // ✅ 設定顏色
                        }}
                    ></div>
                    {isEvaluated && (
                        <span
                            className="absolute w-full text-center font-bold"
                            style={{ color: score >= 60 ? "white" : "black" }} // ✅ 壓到進度條就變白
                        >
                            {numerator}/{denominator}
                        </span>
                    )}
                </div>



                {/* 顯示loading狀態 */}
                {loading && (
                    <div className="fixed top-0 left-0 w-full h-full bg-gray-600 bg-opacity-50 flex items-center justify-center z-[9999] pointer-events-auto">
                        <div className="text-white text-lg font-bold bg-black bg-opacity-70 px-6 py-4 rounded-lg">
                            正在評分...
                        </div>
                    </div>
                )}


                {/* 按鈕區塊 */}
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        className="bg-white text-[#00D1D0] font-bold py-2 px-4 rounded-full border border-white shadow-md transition duration-300 hover:bg-gray-100 hover:shadow-lg"
                        onClick={judgeCode}
                        disabled={loading} // 當測試進行中，禁用按鈕
                    >
                        儲存/評分
                    </button>
                </div>

                {/* 顯示測試資料 */}
                <div className="flex flex-col items-center gap-4 mt-4 w-full">
                    {cases.map((group: any, index: number) => (
                        <div key={index} className="w-3/4 relative">
                            <button
                                className={`flex flex-col items-center justify-center font-bold  px-5 rounded-full w-full shadow-md border relative z-10 transition-all ${isEvaluated
                                    ? group.subcase.every((sub: any) => sub.result)
                                        ? "bg-[#28af68] text-white border-[#28af68] py-1"
                                        : "bg-[#ff6161] text-white border-[#ff6161] py-1"
                                    : "bg-white text-black border-gray-300 py-3"
                                    }`}
                                onClick={() => setActiveCase(activeCase === group.group_title ? null : group.group_title)}
                            >
                                <span className="text-lg">{group.group_title}</span>
                                {isEvaluated && (
                                    <div className="grid grid-cols-5 gap-1 mt-1 justify-items-center">
                                        {group.subcase.map((sub: any, idx: number) => (
                                            <CheckmarkIcon key={idx} isCorrect={sub.result === true} />
                                        ))}
                                    </div>

                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </TabComponentWrapper>
    );
}


// function RecordTab({ questionData, qid }: qProps) {
//     return (
//         <TabComponentWrapper title={questionData.title}>
//             <div className="w-full max-w-lg max-h-[470px] overflow-y-auto rounded-lg p-2">
//                 <div className="flex flex-col gap-2">
//                     <p className="text-center text-gray-500">比賽期間提供作答歷程記錄</p>
//                 </div>
//             </div>
//         </TabComponentWrapper>
//     );
// }
function RecordTab({ questionData, qid }: qProps) {
    const setRecordXMLCode = useWorkspaceStore((state) => state.setRecordXMLCode);
    const [studentAnswers, setStudentAnswers] = useState<
        { time: string; bs: string; code: string | null; score: number; numerator: number; denominator: number }[]
    >([]);

    useEffect(() => {
        // 讀取 LocalStorage
        const storedData = localStorage.getItem("stuansers");
        const parsedData = storedData ? JSON.parse(storedData) : { questions: {} };

        // 取得該題的作答紀錄
        if (parsedData.questions[qid]) {
            setStudentAnswers(parsedData.questions[qid]);
        }
    }, [qid]); // 當 qid 改變時重新載入紀錄

    // 按時間排序，最新的在最上方


    const sortedRecords = [...studentAnswers]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .map(record => ({
            ...record,
            displayTime: new Date(record.time).toLocaleTimeString("zh-TW", { timeZone: "Asia/Taipei", hour12: false })
        }));

    return (
        <TabComponentWrapper title={questionData.title}>
            <div className="w-full max-w-lg h-full overflow-y-auto rounded-lg p-3  ">
                <div className="flex flex-col gap-3 max-h-[800px] overflow-y-auto">
                    {sortedRecords.length === 0 ? (
                        <p className="text-center text-gray-500 text-lg py-4">尚無作答紀錄</p>
                    ) : (
                        sortedRecords.map((record, index) => (
                            <button
                                key={index}
                                className="w-full flex items-center gap-4 bg-white border border-gray-300 rounded-full shadow-md px-5 py-4 transition-all duration-300 hover:bg-gray-100 active:bg-gray-200"
                                // onClick={() => {
                                //     const xmlToLoad = record.code ?? `<xml xmlns="https://developers.google.com/blockly/xml"></xml>`;

                                //     // ✅ 設定回之前的 Blockly 或 Scratch 模式
                                //     if (record.bs === "Scratch") {
                                //         useWorkspaceStore.setState({ currentMode: "Scratch" });
                                //     } else {
                                //         useWorkspaceStore.setState({ currentMode: "Blockly" });
                                //     }

                                //     setRecordXMLCode(xmlToLoad);
                                //     // console.log("🔄 切換模式:", record.bs);
                                //     // console.log("📜 載入 XML:", xmlToLoad);
                                // }}
                                // onClick={() => {
                                //     const xmlToLoad = record.code ?? `<xml xmlns="https://developers.google.com/blockly/xml"></xml>`;
                                //     const targetMode = record.bs as "Blockly" | "Scratch";

                                //     if (targetMode !== "Blockly" && targetMode !== "Scratch") {
                                //         console.error("❌ 無效的模式:", record.bs);
                                //         return;
                                //     }

                                //     const currentMode = useWorkspaceStore.getState().currentMode;

                                //     if (currentMode !== targetMode) {
                                //         useWorkspaceStore.setState({ currentMode: targetMode });

                                //         // 🔥 **稍微延遲，確保模式已經切換完成**
                                //         setTimeout(() => {
                                //             setRecordXMLCode(xmlToLoad);
                                //             console.log("✅ 模式切換後載入 XML:", xmlToLoad);
                                //         }, 50);
                                //     } else {
                                //         setRecordXMLCode(xmlToLoad);
                                //     }
                                // }}
                                onClick={() => {
                                    const xmlToLoad = record.code ?? `<xml xmlns="https://developers.google.com/blockly/xml"></xml>`;
                                    const targetMode = record.bs as "Blockly" | "Scratch";

                                    if (targetMode !== "Blockly" && targetMode !== "Scratch") {
                                        console.error("❌ 無效的模式:", record.bs);
                                        return;
                                    }

                                    const currentMode = useWorkspaceStore.getState().currentMode;
                                    const currentXML = useWorkspaceStore.getState().recordXMLCode;

                                    if (currentMode !== targetMode) {
                                        useWorkspaceStore.setState({ currentMode: targetMode });

                                        // 🔥 **稍微延遲，確保模式已經切換完成**
                                        setTimeout(() => {
                                            useWorkspaceStore.setState({ recordXMLCode: "" }); // 先清空 XML，確保會觸發 React 重新渲染
                                            setTimeout(() => {
                                                setRecordXMLCode(xmlToLoad);
                                                console.log("✅ 模式切換後載入 XML:", xmlToLoad);
                                            }, 50);
                                        }, 50);
                                    } else {
                                        // **如果 XML 內容相同，先清空再重新設置**
                                        if (currentXML === xmlToLoad) {
                                            useWorkspaceStore.setState({ recordXMLCode: "" });
                                            setTimeout(() => setRecordXMLCode(xmlToLoad), 50);
                                        } else {
                                            setRecordXMLCode(xmlToLoad);
                                        }
                                    }
                                }}


                            >

                                {/* ✅ 顯示台灣時間，風格一致 */}
                                <span className="text-lg font-bold w-32 text-gray-700">
                                    {/* {record.time} */}
                                    {record.displayTime}
                                </span>

                                {/* ✅ 進度條 UI 調整，風格統一 */}
                                <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${record.score}%`,
                                            // width: `${35}%`,
                                            backgroundColor: "#28af68",
                                        }}
                                    ></div>
                                    <span
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 font-bold"
                                        style={{
                                            color: record.score >= 35 ? "white" : "black",
                                        }}
                                    >
                                        {record.numerator}/{record.denominator}
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </TabComponentWrapper>
    );
}





const mapLayouts = {
    1: [70, 30],
    2: [65, 35],
    3: [60, 40],
}
interface qProps {
    questionData: any;
    qid: number; // 🔥 這裡新增 qid
}
function Question({ id }: { id: number }) {
    const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);
    // const location = useLocation() as { state: Record<string, unknown> }; // ✨
    const location = useLocation();

    const [questionData, setQuestionData] = useState<{
        title: string;
        statements: any[];
        example_cases: any[];
        cases: any[];
    } | null>(null);

    const setGeneratedCode = useWorkspaceStore((state) => state.setGeneratedCode);
    const setGeneratedXMLCode = useWorkspaceStore((state) => state.setGeneratedXMLCode);

    //第一次示範賽前demo(20250412)
    // const questions: Record<number, any> = {
    //     1: {
    //         title: "刮刮樂",
    //         statements: [
    //             {
    //                 text: "百貨公司週年慶期間發出多張刮刮樂卡，刮開的數字若正讀或反讀皆一致，就可換取獎品一份。\n給定刮刮樂卡的起、迄數字，計算總共該準備幾份贈品。\n\n刮刮樂卡的起迄數字皆介於 1 及 999999。"
    //             },
    //             {
    //                 table: ""
    //             }
    //         ],
    //         example_cases: [
    //             {
    //                 title: "範例一",
    //                 input: "10 99",
    //                 output: "9",
    //                 description: "刮刮樂卡的起始號碼為 10，結束號碼為 99。\n其中刮開的數字 11、22、33、44、55、66、77、88、99 之正讀、反讀皆一致，因此共需準備 9 份贈品。"
    //             },
    //             {
    //                 title: "範例二",
    //                 input: "11112 19999",
    //                 output: "88",
    //                 description: "刮刮樂卡的起始號碼為 11112，結束號碼為 19999。\n其中刮開的數字 11211、11311、...、11911、12021、12121、...、12921、...、19091、19191、...、19991 之正讀、反讀皆一致，因此共需準備 88 份贈品。"
    //             }
    //         ],
    //         cases: [
    //             {
    //                 group_title: "只測試個位數",
    //                 subcase: [
    //                     {
    //                         case_title: "情況一",
    //                         input: "0 1",
    //                         output: "2",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況二",
    //                         input: "1 1",
    //                         output: "1",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況三",
    //                         input: "0 9",
    //                         output: "10",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況四",
    //                         input: "5 8",
    //                         output: "4",
    //                         score: "4"
    //                     }
    //                 ]
    //             },
    //             {
    //                 group_title: "只測試兩位數",
    //                 subcase: [
    //                     {
    //                         case_title: "情況一",
    //                         input: "10 99",
    //                         output: "9",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況二",
    //                         input: "31 89",
    //                         output: "6",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況三",
    //                         input: "19 21",
    //                         output: "0",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況四",
    //                         input: "99 99",
    //                         output: "1",
    //                         score: "4"
    //                     }
    //                 ]
    //             },
    //             {
    //                 group_title: "只測試三位數",
    //                 subcase: [
    //                     {
    //                         case_title: "情況一",
    //                         input: "100 999",
    //                         output: "90",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況二",
    //                         input: "111 444",
    //                         output: "34",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況三",
    //                         input: "888 999",
    //                         output: "12",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況四",
    //                         input: "370 666",
    //                         output: "30",
    //                         score: "4"
    //                     }
    //                 ]
    //             },
    //             {
    //                 group_title: "只測試四位數",
    //                 subcase: [
    //                     {
    //                         case_title: "情況一",
    //                         input: "1000 9999",
    //                         output: "90",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況二",
    //                         input: "2345 6789",
    //                         output: "44",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況三",
    //                         input: "1111 1112",
    //                         output: "1",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況四",
    //                         input: "1201 9087",
    //                         output: "79",
    //                         score: "4"
    //                     }
    //                 ]
    //             },
    //             {
    //                 group_title: "只測試五位數",
    //                 subcase: [
    //                     {
    //                         case_title: "情況一",
    //                         input: "10000 99999",
    //                         output: "900",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況二",
    //                         input: "11111 11111",
    //                         output: "1",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況三",
    //                         input: "79797 97979",
    //                         output: "183",
    //                         score: "4"
    //                     },
    //                     {
    //                         case_title: "情況四",
    //                         input: "12345 67890",
    //                         output: "555",
    //                         score: "4"
    //                     }
    //                 ]
    //             },
    //             {
    //                 group_title: "只測試六位數",
    //                 subcase: [
    //                     {
    //                         case_title: "情況一",
    //                         input: "100000 999999",
    //                         output: "900",
    //                         score: "5"
    //                     },
    //                     {
    //                         case_title: "情況二",
    //                         input: "123456 567890",
    //                         output: "444",
    //                         score: "5"
    //                     },
    //                     {
    //                         case_title: "情況三",
    //                         input: "797979 979797",
    //                         output: "181",
    //                         score: "5"
    //                     },
    //                     {
    //                         case_title: "情況四",
    //                         input: "111111 111111",
    //                         output: "1",
    //                         score: "5"
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     2: {
    //         title: "活動分組",
    //         statements: [
    //             {
    //                 text: "栗栗國中社團迎新共有 15 個活動（編號 1 至 15 ），依序輸入每位新生報名參加的活動，最後輸入 -1 代表輸入完畢。\n\n請列出尚未有新生報名的活動有哪些。若所有活動皆有新生報名，則顯示「無」。"
    //             }
    //         ],
    //         example_cases: [
    //             {
    //                 title: "範例一",
    //                 input: "1 4 2 6 10 11 5 15 12 13 14 8 -1",
    //                 output: "3 7 9",
    //                 description: "新生們依序報名了編號為 1、4、2、6、10、11 、5、15、12、13、14、8 的活動 (-1表示結束)。因此編號 3、7、9 的活動未有新生報名。"
    //             },
    //             {
    //                 title: "範例二",
    //                 input: "7 3 9 12 1 15 6 10 4 14 9 2 9 13 8 5 11 -1",
    //                 output: "無",
    //                 description: "新生們依序報名了編號為 7、3、9、12、1、15、6、10、4、14、9、2、9、13、8、5、11 的活動 (-1表示結束)。因此所有活動皆有新生報名。"
    //             }
    //         ],
    //         "cases": [
    //             {
    //                 "group_title": "所有活動都沒有新生報名",
    //                 "subcase": [
    //                     {
    //                         "case_title": "情況一",
    //                         "input": "0 -1",
    //                         "output": "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況二",
    //                         "input": "-1",
    //                         "output": "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況三",
    //                         "input": "16 -1",
    //                         "output": "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況四",
    //                         "input": "10000 -1",
    //                         "output": "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況五",
    //                         "input": "0 0 0 0 0 -1",
    //                         "output": "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15",
    //                         "score": "5"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "group_title": "部分活動有新生報名",
    //                 "subcase": [
    //                     {
    //                         "case_title": "情況一",
    //                         "input": "13 1 4 2 6 1 8 2 3 2 14 -1",
    //                         "output": "5 7 9 10 11 12 15",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況二",
    //                         "input": "2 8 2 3 3 8 4 5 15 15 7 7 13 5 11 8 6 4 12 9 6 -1",
    //                         "output": "1 10 14",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況三",
    //                         "input": "5 10 9 1 1 10 8 15 10 9 4 15 1 15 10 11 9 5 3 9 -1",
    //                         "output": "2 6 7 12 13 14",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況四",
    //                         "input": "10 8 2 3 3 3 14 13 4 12 -1",
    //                         "output": "1 5 6 7 9 11 15",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況五",
    //                         "input": "8 6 4 13 10 8 12 8 9 5 2 1 2 8 9 12 8 14 2 6 -1",
    //                         "output": "3 7 11 15",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況六",
    //                         "input": "3 13 5 7 13 9 13 14 9 11 7 3 9 10 9 3 3 10 14 6 15 10 13 2 9 12 8 -1",
    //                         "output": "1 4",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況七",
    //                         "input": "15 1 15 12 5 9 9 11 3 12 7 2 4 15 -1",
    //                         "output": "6 8 10 13 14",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況八",
    //                         "input": "1 1 1 1 -1",
    //                         "output": "2 3 4 5 6 7 8 9 10 11 12 13 14 15",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況九",
    //                         "input": "15 1 15 12 5 16 9 9 11 3 12 7 0 4 15 -1",
    //                         "output": "2 6 8 10 13 14",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況十",
    //                         "input": "1 4 2 6 10 11 5 15 12 13 14 8 -1",
    //                         "output": "3 7 9",
    //                         "score": "5"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "group_title": "所有活動都有新生報名",
    //                 "subcase": [
    //                     {
    //                         "case_title": "情況一",
    //                         "input": "14 14 12 15 15 11 1 1 13 7 5 9 6 11 1 3 15 13 14 2 13 6 13 4 6 2 10 6 8 -1",
    //                         "output": "無",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況二",
    //                         "input": "1 3 5 7 9 8 4 6 2 10 15 13 12 14 11 -1",
    //                         "output": "無",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況三",
    //                         "input": "1 1 7 6 15 12 9 3 1 5 4 1 14 4 13 2 10 6 11 7 9 7 4 15 9 8 11 4 -1",
    //                         "output": "無",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況四",
    //                         "input": "1000 99 123 1 1 7 6 15 12 9 3 1 5 4 1 14 4 13 2 10 6 11 7 9 7 4 15 9 8 11 4 -1",
    //                         "output": "無",
    //                         "score": "5"
    //                     },
    //                     {
    //                         "case_title": "情況五",
    //                         "input": "1000 99 123 1 1 7 6 15 12 9 3 1 5 4 1 14 4 13 2 10 6 11 7 9 7 4 15 9 8 11 4 -1",
    //                         "output": "無",
    //                         "score": "5"
    //                     }
    //                 ]
    //             }
    //         ]
    //     }
    // };


    //202507研習demo
    const questions: Record<number, any> = {
        1: {
            title: "可口便當",
            statements: [
                {
                    "text": "可口便當主廚每天早上會先檢視每筆訂單上的套餐 （最多 9 種套餐，套餐編號為 1, 2, 3, …, 9 )，再列出當天套餐應該烹煮的先後順序。請依據訂單資訊與主廚準備便當的順序，列舉出所有套餐被處理的順序。"
                },
                {
                    "table": ""
                }
            ],
            example_cases: [
                {
                    title: "範例一",
                    input: "5\n8 9 9 9 8\n2\n9 8",
                    output: "9 9 9 8 8",
                    description: "總共有 5 筆訂單，\n訂單上的套餐編號依序為 8 9 9 9 8。\n總共有 2 個不同套餐，\n主廚決定套餐的烹煮順序為 9 8。\n\n因此需先處理三個 9 號餐，再處理兩個 8 號餐。因此訂單上套餐處理順序為 9 9 9 8 8。"
                },
                {
                    title: "範例二",
                    input: "7\n3 1 4 1 5 9 3\n5\n1 9 4 3 5",
                    output: "1 1 9 4 3 3 5",
                    description: "總共有 7 筆訂單，\n訂單上的套餐編號依序為 3 1 4 1 5 9 3。\n總共有 5 個不同套餐，\n主廚決定套餐的烹煮順序為 1 9 4 3 5。\n\n先處理兩個 1 號餐，再依序處理 9, 4 號餐，再處理兩個 3 號餐，最後才處理 5 號餐。因此訂單上套餐處理順序為 1 1 9 4 3 3 5。"
                }
            ],

            cases: [
                {
                    group_title: "套餐不會重複出現",
                    subcase: [
                        {
                            case_title: "A1",
                            input: "9 1 2 3 4 5 6 7 8 9 9 9 8 7 6 5 4 3 2 1",
                            output: "9 8 7 6 5 4 3 2 1",
                            score: "4"
                        },
                        {
                            case_title: "A2",
                            input: "1 1 1 1",
                            output: "1",
                            score: "4"
                        },
                        {
                            case_title: "A3",
                            input: "5 5 3 1 4 2 5 2 3 1 5 4",
                            output: "2 3 1 5 4",
                            score: "4"
                        },
                        {
                            case_title: "A4",
                            input: "8 9 8 7 6 5 4 3 2 8 9 8 7 6 5 4 3 2",
                            output: "9 8 7 6 5 4 3 2",
                            score: "4"
                        },
                        {
                            case_title: "A5",
                            input: "8 9 8 7 6 5 4 3 2 8 2 3 4 5 6 7 8 9",
                            output: "2 3 4 5 6 7 8 9",
                            score: "4"
                        }
                    ]
                },
                {
                    group_title: "訂單只出現兩種套餐",
                    subcase: [
                        {
                            case_title: "B1",
                            input: "3 1 2 2 2 1 2",
                            output: "1 2 2",
                            score: "4"
                        },
                        {
                            case_title: "B2",
                            input: "3 1 2 2 2 2 1",
                            output: "2 2 1",
                            score: "4"
                        },
                        {
                            case_title: "B3",
                            input: "10 7 7 7 7 9 9 9 9 9 9 2 7 9",
                            output: "7 7 7 7 9 9 9 9 9 9",
                            score: "4"
                        },
                        {
                            case_title: "B4",
                            input: "12 3 8 3 8 3 8 3 8 3 8 3 8 2 8 3",
                            output: "8 8 8 8 8 8 3 3 3 3 3 3",
                            score: "4"
                        },
                        {
                            case_title: "B5",
                            input: "12 7 9 9 7 7 9 7 7 9 9 9 9 2 9 7",
                            output: "9 9 9 9 9 9 9 7 7 7 7 7",
                            score: "4"
                        }
                    ]
                },
                {
                    group_title: "套餐會重複出現",
                    subcase: [
                        {
                            case_title: "C1",
                            input: "6 2 3 3 1 2 2 3 2 1 3",
                            output: "2 2 2 1 3 3",
                            score: "6"
                        },
                        {
                            case_title: "C2",
                            input: "8 5 6 6 6 7 5 7 5 3 5 7 6",
                            output: "5 5 5 7 7 6 6 6",
                            score: "6"
                        },
                        {
                            case_title: "C3",
                            input: "10 9 9 1 1 1 1 3 3 3 3 3 1 9 3",
                            output: "1 1 1 1 9 9 3 3 3 3",
                            score: "6"
                        },
                        {
                            case_title: "C4",
                            input: "7 7 8 8 8 7 7 7 2 8 7",
                            output: "8 8 8 7 7 7 7",
                            score: "6"
                        },
                        {
                            case_title: "C5",
                            input: "20 5 5 5 5 5 5 5 5 5 5 9 9 9 9 9 9 9 9 9 9 2 9 5",
                            output: "9 9 9 9 9 9 9 9 9 9 5 5 5 5 5 5 5 5 5 5",
                            score: "6"
                        },
                        {
                            case_title: "C6",
                            input: "12 2 1 4 2 3 5 1 3 2 4 5 1 5 5 4 3 2 1",
                            output: "5 5 4 4 3 3 2 2 2 1 1 1",
                            score: "6"
                        },
                        {
                            case_title: "C7",
                            input: "15 6 7 6 8 6 7 7 8 6 6 7 8 7 8 8 3 8 6 7",
                            output: "8 8 8 8 8 6 6 6 6 6 7 7 7 7 7",
                            score: "6"
                        },
                        {
                            case_title: "C8",
                            input: "10 8 1 8 3 3 8 2 8 2 3 4 1 2 3 8",
                            output: "1 2 2 3 3 3 8 8 8 8",
                            score: "6"
                        },
                        {
                            case_title: "C9",
                            input: "4 7 7 8 8 2 7 8",
                            output: "7 7 8 8",
                            score: "6"
                        },
                        {
                            case_title: "C10",
                            input: "11 1 9 8 7 6 5 4 3 2 1 9 9 1 2 3 4 5 6 7 8 9",
                            output: "1 1 2 3 4 5 6 7 8 9 9",
                            score: "6"
                        }
                    ]
                }
            ]
        },
        2: {
            title: "短片欣賞",
            statements: [
                {
                    text: "圖書館有一間媒體播放室，每週六會連續播放科學系列短片(最多 20 個短片)。短片代碼為大寫英文字母，例如 A, X, P 等，但同一系列短片會用相同的英文字母表示。娜娜有特別喜歡看的系列短片，但每天能夠進圖書館看短片的時間有限。\n\n舉例來說，圖書館安排連續播放以下 8 場次的短片，娜娜最喜歡 A 系列短片，且該天有時間可以連續看 5 場次。她若從第 1 場次開始看，只會看到 2 個 A 系列短片；但若是從第 4 場次開始看，就能夠看到 3 個 A 系列短片。"
                },
                {
                    table: "\n場次, 短片代碼,\n1,A,\n2,B,\n3,C,\n4,A,\n5,W,\n6,A,\n7,Q,\n8,A"
                },
                {
                    text: "請幫娜娜計算最多可以看到幾次最喜歡的系列短片。"
                }

            ],
            example_cases: [
                {
                    title: "範例一",
                    input: "8 A B C A W A Q A\n5 A",
                    output: "3",
                    description: "圖書館安排連續播放8場次的短片，\n依序播放系列短片A B C A W A Q A。\n娜娜有時間可以連續看5場次，且最喜歡的是A系列短片。\n\n最佳情形是從第4場開始看 (A W A Q A)，共可以看到3場次的A系列短片，因此輸出 3。"
                },
                {
                    title: "範例二",
                    input: "3 X G X\n2 X",
                    output: "1",
                    description: "圖書館安排連續播放3場次的短片。\n3場次依序播放短片 X G X。\n娜娜有時間可以連續看2場次，且最喜歡的是X系列短片。\n\n最佳情形是從第 1 場或第 2 場開始看(X G), (G X)都可以看到 1 場，因此輸出 1。"
                }
            ],
            cases: [

                {
                    group_title: "有時間看所有短片",
                    subcase: [
                        {
                            case_title: "A1",
                            input: "3 A A B 3 A",
                            output: "2",
                            score: "6"
                        },
                        {
                            case_title: "A2",
                            input: "3 C B C 3 D",
                            output: "0",
                            score: "6"
                        },
                        {
                            case_title: "A3",
                            input: "4 B A A C 4 C",
                            output: "1",
                            score: "6"
                        },
                        {
                            case_title: "A4",
                            input: "6 C B A A B C 6 B",
                            output: "2",
                            score: "6"
                        },
                        {
                            case_title: "A5",
                            input: "12 A B A B B F A F A F B A 12 B",
                            output: "4",
                            score: "6"
                        }
                    ]
                },
                {
                    group_title: "僅有時間看部分連續短片",
                    subcase: [
                        {
                            case_title: "B1",
                            input: "6 E A B C D A 1 A",
                            output: "1",
                            score: "5"
                        },
                        {
                            case_title: "B2",
                            input: "7 A B A C E F D 4 A",
                            output: "2",
                            score: "5"
                        },
                        {
                            case_title: "B3",
                            input: "8 B C F P F G F F 4 F",
                            output: "3",
                            score: "5"
                        },
                        {
                            case_title: "B4",
                            input: "14 D C C C B A C D C C C C C D 7 C",
                            output: "6",
                            score: "5"
                        },
                        {
                            case_title: "B5",
                            input: "15 A Z A C Z Z D Z Z B Z Z Z Z C 6 Z",
                            output: "5",
                            score: "5"
                        },
                        {
                            case_title: "B6",
                            input: "20 A A A A A A A B B B B A B B C B B B B B 15 B",
                            output: "11",
                            score: "5"
                        },
                        {
                            case_title: "B7",
                            input: "20 Z Y X W V U T S R Q P O N M L K J I H G 5 C",
                            output: "0",
                            score: "5"
                        },
                        {
                            case_title: "B8",
                            input: "20 Z Y X X V U T S P P P P P M L K K J H G 5 K",
                            output: "2",
                            score: "5"
                        }
                    ]
                },
                {
                    group_title: "特殊情形",
                    subcase: [
                        {
                            case_title: "C1",
                            input: "3 B B B 2 B",
                            output: "2",
                            score: "6"
                        },
                        {
                            case_title: "C2",
                            input: "3 B B B 3 B",
                            output: "3",
                            score: "6"
                        },
                        {
                            case_title: "C3",
                            input: "15 A A A A A A A A A A A A A A A 12 A",
                            output: "12",
                            score: "6"
                        },
                        {
                            case_title: "C4",
                            input: "12 A A A A A A A A A A A A 6 B",
                            output: "0",
                            score: "6"
                        },
                        {
                            case_title: "C5",
                            input: "15 A B C X X X A A A X X X A A X 6 X",
                            output: "4",
                            score: "6"
                        }
                    ]
                }
            ]
        }
    };

    const setCurrentMode = useWorkspaceStore((state) => state.setCurrentMode); // ✅ 獲取設定模式的函數
    useEffect(() => {
        setCurrentMode("Scratch");
    }, []); // `id` 改變時重新設定題目
    const resetWorkspaces = useWorkspaceStore((state) => state.resetWorkspaces);
    useEffect(() => {
        resetWorkspaces();
        setQuestionData(questions[id]); // 直接從 `questions` 取得對應的題目
    }, [id]); // `id` 改變時重新設定題目
    const tabItems: TabItem[] = useMemo(() => {
        if (!questionData) return [];

        return [
            {
                value: 'tab1',
                // title: '任務說明',
                title: '題目說明',
                content: <IntroTab questionData={questionData} />,
            },
            {
                value: 'tab2',
                // title: '任務演練',                                
                title: '自行測試',
                content: <CodeDrillTab questionData={questionData} qid={id} />,
            },
            {
                value: 'tab3',
                // title: '任務挑戰',                
                title: '評分',
                content: <SubmitTab questionData={questionData} qid={id} />,
            },
            {
                value: 'tab4',
                // title: '挑戰紀錄',
                title: '評分紀錄',
                content: <RecordTab questionData={questionData} qid={id} />,
            },
        ];
    }, [questionData]);  // 🔥 `questionData` 變更時，`tabItems` 會重新計算


    return (
        <ResizablePanelGroup
            ref={panelGroupRef}
            direction="horizontal"
            className="flex h-full overflow-clip rounded-t-2xl"
        >
            <ResizablePanel >
                <CodeEditor key={id} />
                {/* <CodeEditor key={id} /> */}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={mapLayouts[1][1]} minSize={mapLayouts[1][1]}>
                <Tabs
                    defaultValue="tab1"
                    orientation="vertical"
                    className="flex h-full flex-row"
                >
                    {tabItems.map((tab) => (
                        <TabsContent
                            key={tab.value}
                            value={tab.value}
                            className="mt-0 grow bg-gray-50 bg-[url('/img/base_2.png')] bg-right-bottom px-1 py-4"
                        >
                            {tab.content}
                        </TabsContent>
                    ))}
                    <TabsList className="flex h-full w-12 min-w-12 flex-col justify-start rounded-none bg-[url('/img/base_3.png')] bg-left p-0 pt-40 pt-0">
                        {tabItems.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="w-full rounded-none rounded-r-sm bg-cover py-8 text-lg tracking-wider data-[state=active]:bg-[url('/img/base_button.png')]"
                                style={{
                                    writingMode: 'vertical-lr',
                                    textOrientation: 'upright',
                                }}
                            >
                                {tab.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
