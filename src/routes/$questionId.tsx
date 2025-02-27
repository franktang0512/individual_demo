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

// 點範例按鈕後可以看到的內容
interface ExampleButtonProps {
    text: string
    onClick: () => void
    isActive: boolean
}

function ExampleButton({ text, onClick, isActive }: ExampleButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`relative w-full py-4 text-xl font-bold rounded-full shadow-md transition-all border border-gray-300 z-20 ${isActive ? 'bg-[#00D1D0] text-white' : 'bg-white text-[#00D1D0]'}`}
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
            className={`relative w-full max-w-lg bg-[#00A5AD] text-white rounded-lg p-4 shadow-lg overflow-hidden transition-all duration-300 -mt-6 ${isVisible ? 'max-h-[500px] opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}`}
        >
            {/* <h3 className="text-2xl font-bold text-center">{title}</h3> */}
            <div className="flex justify-between mt-4 p-2  text-white rounded-md border-b">
                <div className="text-center w-1/2 border-r border-gray-300">
                    <p className="font-bold">輸入</p>
                    <p className="mt-1 text-lg">{input}</p>
                </div>
                <div className="text-center w-1/2">
                    <p className="font-bold">輸出</p>
                    <p className="mt-1 text-lg">{output}</p>
                </div>
            </div>
            <p className="mt-4 text-lg text-center">{description}</p>
        </div>
    )
}

function IntroTab({ questionData }: { questionData: any }) {
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
            <div className="w-full max-w-lg max-h-[500px] overflow-y-auto rounded-lg p-2">
                {/* 顯示題目敘述 */}
                <div className="w-full px-4 text-xl">
                    {data.statements.map((statement: any, index: number) => (
                        <div key={index} className="mb-4">
                            {statement.text && (
                                <p className="mb-2">
                                    {statement.text.split(/\n|<br>/).map((line: string, index: number) => (
                                        <span key={index}>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* 顯示範例測試資料 */}
                <div className="flex flex-col items-center gap-4 mt-4 w-full max-w-lg">
                    {data.example_cases.map((example: any, index: number) => (
                        <div key={index} className="w-full relative">
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

function CodeDrillTab({ questionData }: { questionData: any }) {
    const [activeExample, setActiveExample] = useState<string | null>(null);
    const [output, setOutput] = useState<string>("");

    const currentMode = useWorkspaceStore((state) => state.currentMode); // 取得 Blockly 或 Scratch 模式
    const generatedCode = useWorkspaceStore((state) => state.generatedCode); // 取得 Blockly 產生的程式碼

    if (!questionData) return <p>載入中...</p>;

    const drillClick = async () => {
        try {
            setOutput(""); // 清空輸出
            let sandbox = new Function(`${generatedCode}; return output_result_string;`);
            const result = sandbox();
            setOutput(result);
        } catch (error) {
            console.error("執行錯誤：", error);
            setOutput("執行錯誤！");
        }
    };

    return (
        <TabComponentWrapper title={questionData.title}>
            <div className="w-full max-w-lg max-h-[470px] overflow-y-auto rounded-lg p-2">
                {/* 互動區域 */}
                <div className="flex flex-col items-start gap-4 w-full max-w-lg mt-4">
                    <div className="flex flex-col items-center space-y-2">
                        <button
                            className="shadow-md px-10 py-3 bg-white border-2 border-green-500 rounded-full flex items-center justify-center w-36 h-12"
                            onClick={drillClick}
                        >
                            {currentMode === "Scratch" ? (
                                <img src="/individual/img/flag.svg" alt="Start" className="w-8 h-8" />
                            ) : (
                                <span className="text-lg font-bold text-green-500 tracking-widest whitespace-nowrap">
                                    執行
                                </span>
                            )}
                        </button>
                        <div className="flex flex-col text-lg font-bold text-center">
                            <span>輸出：</span>
                            <pre className="whitespace-pre-wrap">{output}</pre>
                        </div>
                    </div>
                </div>

                {/* 顯示範例測試資料 */}
                <div className="flex flex-col items-center gap-4 mt-4 w-full max-w-lg">
                    {questionData.example_cases.map((example: any, index: number) => (
                        <div key={index} className="w-full relative">
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
            className={`mr-2 font-bold ${isCorrect ? 'text-green-400' : 'text-white'}`}
            style={{ color: isCorrect ? '#8FFF00' : '#FFFFFF' }} // 這裡強制覆蓋 Tailwind
        >
            {isCorrect ? '✔' : '🗙'}
        </span>
    )
}


function SubmitTab({ questionData }: { questionData: any }) {
    const navigate = useNavigate();
    const [activeCase, setActiveCase] = useState<string | null>(null);
    const [isEvaluated, setIsEvaluated] = useState(false);
    const [cases, setCases] = useState<any[]>(questionData?.cases || []);
    const [score, setScore] = useState(0); // ✅ 追蹤評分百分比
    const generatedCode = useWorkspaceStore((state) => state.generatedCode); // 取得 Blockly 產生的程式碼

    if (!questionData) return <p>載入中...</p>;

    const judgeCode = () => {
        if (!generatedCode) {
            alert("請先撰寫程式碼");
            return;
        }

        let modifiedCode = generatedCode.replace(
            /window\.prompt\([^\(\)]*\)/g,
            "(testInputs.length > 0 ? testInputs.shift() : (() => { throw new Error('輸入（詢問）次數過多'); })())"
        );

        // 直接從 questionData 測試用例執行程式碼
        const studentOutputs = cases.map((group: any) => ({
            group_title: group.group_title,
            subcase: group.subcase.map((sub: any) => {
                let testInputs: (string | number)[] = [];

                if (typeof sub.input === "string") {
                    sub.input
                        .split(/[\s,]+/) // 🔹 **支援空白、換行、逗號、Tab 分隔**
                        .map((i: string) => i.trim()) // 🔹 **去除多餘空白**
                        .filter((i: string) => i.length > 0) // 🔹 **避免空字串**
                        .forEach((i: string) => {
                            const num: number = Number(i);
                            testInputs.push(isNaN(num) ? i : num);
                        });
                }

                let result;
                try {
                    const executeFunction = new Function("testInputs", `
                        return (() => {
                            var output_result_string = "";
                            ${modifiedCode}
                            return typeof output_result_string !== "undefined" ? output_result_string : "未定義 output_result_string";
                        })();
                    `);
                    result = executeFunction(testInputs);
                    // console.log(result);
                } catch (error: any) {
                    console.error("❌ 執行錯誤:", error);
                    result = `錯誤: ${error.message}`;
                }
                const each_result = {
                    ...sub,
                    student_output: result,
                    result: result.trim() === sub.output.trim() // 判斷是否正確
                }
                // console.log(haha);

                return each_result;
            })
        }));

        setIsEvaluated(true);
        setCases(studentOutputs);
        setScore(calculateScore(studentOutputs));
    };

    const calculateScore = (cases: any) => {
        let totalTests = 0;
        let correctCount = 0;

        // cases.forEach((group: any) => {
        //     group.subcase.forEach((sub: any) => {
        //         totalTests++;
        //         if (sub.result) correctCount++;
        //     });
        // });

        // return totalTests === 0 ? 0 : Math.round((correctCount / totalTests) * 100);

        cases.forEach((group: any) => {
            group.subcase.forEach((sub: any) => {
                totalTests+=sub.score;
                if (sub.result) correctCount+=sub.score;
            });
        });
        return totalTests === 0 ? 0 : Math.round((correctCount / totalTests) * 100);
    };

    return (
        <TabComponentWrapper title={questionData.title}>
            <div className="w-full max-w-lg max-h-[470px] overflow-y-auto rounded-lg p-2">

                {/* 🔹 進度條 */}
                <div className="w-full max-w-lg bg-gray-200 rounded-full h-6 flex items-center relative">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${isEvaluated ? "bg-green-500" : "bg-gray-200"
                            }`}
                        style={{ width: isEvaluated ? `${score}%` : "0%" }}
                    ></div>
                    {isEvaluated && (
                        <span className="absolute w-full text-center font-bold text-black">
                            {score}%
                        </span>
                    )}
                </div>

                {/* 🔹 按鈕區塊 */}
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        className="bg-[#00D1D0] text-white font-bold py-2 px-4 rounded-full border border-[#00D1D0]"
                        onClick={() => judgeCode()}
                    >
                        進行評分
                    </button>
                </div>

                {/* 🔹 題目測試資料 */}
                <div className="flex flex-col items-center gap-6 mt-6 w-full">
                    {cases.map((group: any, index: number) => (
                        <div key={index} className="w-full relative">
                            <button
                                className={`font-bold py-4 px-6 rounded-full w-full shadow-md border relative z-10 transition-all ${isEvaluated
                                        ? group.subcase.every((sub: any) => sub.result)
                                            ? "bg-[#2B8A3E] text-white border-[#2B8A3E]"
                                            : "bg-[#D9534F] text-white border-[#D9534F]"
                                        : "bg-white text-black border-gray-300"
                                    }`}
                                onClick={() =>
                                    setActiveCase(activeCase === group.group_title ? null : group.group_title)
                                }
                            >
                                {group.group_title}
                            </button>

                            {activeCase === group.group_title && (
                                <div
                                    className="w-full font-bold py-4 px-6 rounded-lg shadow-md relative -mt-3 text-center border border-gray-300"
                                    style={{
                                        backgroundColor: isEvaluated
                                            ? group.subcase.every((sub: any) => sub.result)
                                                ? "#2B8A3E"
                                                : "#D9534F"
                                            : "#D9D9D9"
                                    }}
                                >
                                    <div className="flex flex-col items-center mt-2 px-6 gap-2">
                                        {group.subcase.map((sub: any, idx: number) => (
                                            <p
                                                key={idx}
                                                className="flex items-center justify-center px-4 py-2 w-full rounded-md transition-all text-center"
                                                style={{
                                                    // backgroundColor: isEvaluated
                                                    //     ? sub.result
                                                    //         ? "#2B8A3E"
                                                    //         : "#D9534F"
                                                    //     : "#D9D9D9",
                                                    color: isEvaluated ? "white" : "black",
                                                    fontWeight: isEvaluated ? "bold" : "normal"
                                                }}
                                            >
                                                {isEvaluated && (
                                                    <span
                                                        className={`mr-2 font-bold ${sub.result ? "text-green-400" : "text-white"
                                                            }`}
                                                        style={{
                                                            color: sub.result ? "#8FFF00" : "#FFFFFF"
                                                        }}
                                                    >
                                                        {sub.result ? "✔" : "🗙"}
                                                    </span>
                                                )}
                                                {sub.case_title}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </TabComponentWrapper>
    );
}


function RecordTab({ questionData }: { questionData: any }) {
    return (
        <TabComponentWrapper title={questionData.title}>
            <div className="w-full max-w-lg max-h-[470px] overflow-y-auto rounded-lg p-2">
                <div className="flex flex-col gap-2">
                    <p className="text-center text-gray-500">比賽期間提供作答歷程記錄</p>
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


    const questions: Record<number, any> = {
        1: {
            title: "刮刮樂",
            statements: [
                {
                    text: "百貨公司週年慶期間發出多張刮刮樂卡，刮開的數字若正讀或反讀皆一致，就可換取獎品一份。\n給定刮刮樂卡的起、迄數字，計算總共該準備幾份贈品。\n\n刮刮樂卡的起迄數字皆介於 1 及 999999。"
                },
                {
                    table: ""
                }
            ],
            example_cases: [
                {
                    title: "範例一",
                    input: "10 99",
                    output: "9",
                    description: "刮刮樂卡的起始號碼為 10，結束號碼為 99。\n其中刮開的數字 11、22、33、44、55、66、77、88、99 之正讀、反讀皆一致，因此共需準備 9 份贈品。"
                },
                {
                    title: "範例二",
                    input: "11112 19999",
                    output: "88",
                    description: "刮刮樂卡的起始號碼為 11112，結束號碼為 19999。\n其中刮開的數字 11211、11311、...、11911、12021、12121、...、12921、...、19091、19191、...、19991 之正讀、反讀皆一致，因此共需準備 88 份贈品。"
                }
            ],
            cases: [
                {
                    group_title: "只測試個位數",
                    subcase: [
                        {
                            case_title: "情況一",
                            input: "0 1",
                            output: "2",
                            score: "4"
                        },
                        {
                            case_title: "情況二",
                            input: "1 1",
                            output: "1",
                            score: "4"
                        },
                        {
                            case_title: "情況三",
                            input: "0 9",
                            output: "10",
                            score: "4"
                        },
                        {
                            case_title: "情況四",
                            input: "5 8",
                            output: "4",
                            score: "4"
                        }
                    ]
                },
                {
                    group_title: "只測試兩位數",
                    subcase: [
                        {
                            case_title: "情況一",
                            input: "10 99",
                            output: "9",
                            score: "4"
                        },
                        {
                            case_title: "情況二",
                            input: "31 89",
                            output: "6",
                            score: "4"
                        },
                        {
                            case_title: "情況三",
                            input: "19 21",
                            output: "0",
                            score: "4"
                        },
                        {
                            case_title: "情況四",
                            input: "99 99",
                            output: "1",
                            score: "4"
                        }
                    ]
                },
                {
                    group_title: "只測試三位數",
                    subcase: [
                        {
                            case_title: "情況一",
                            input: "100 999",
                            output: "90",
                            score: "4"
                        },
                        {
                            case_title: "情況二",
                            input: "111 444",
                            output: "34",
                            score: "4"
                        },
                        {
                            case_title: "情況三",
                            input: "888 999",
                            output: "12",
                            score: "4"
                        },
                        {
                            case_title: "情況四",
                            input: "370 666",
                            output: "30",
                            score: "4"
                        }
                    ]
                },
                {
                    group_title: "只測試四位數",
                    subcase: [
                        {
                            case_title: "情況一",
                            input: "1000 9999",
                            output: "90",
                            score: "4"
                        },
                        {
                            case_title: "情況二",
                            input: "2345 6789",
                            output: "44",
                            score: "4"
                        },
                        {
                            case_title: "情況三",
                            input: "1111 1112",
                            output: "1",
                            score: "4"
                        },
                        {
                            case_title: "情況四",
                            input: "1201 9087",
                            output: "79",
                            score: "4"
                        }
                    ]
                },
                {
                    group_title: "只測試五位數",
                    subcase: [
                        {
                            case_title: "情況一",
                            input: "10000 99999",
                            output: "900",
                            score: "4"
                        },
                        {
                            case_title: "情況二",
                            input: "11111 11111",
                            output: "1",
                            score: "4"
                        },
                        {
                            case_title: "情況三",
                            input: "79797 97979",
                            output: "183",
                            score: "4"
                        },
                        {
                            case_title: "情況四",
                            input: "12345 67890",
                            output: "555",
                            score: "4"
                        }
                    ]
                },
                {
                    group_title: "只測試六位數",
                    subcase: [
                        {
                            case_title: "情況一",
                            input: "100000 999999",
                            output: "900",
                            score: "5"
                        },
                        {
                            case_title: "情況二",
                            input: "123456 567890",
                            output: "444",
                            score: "5"
                        },
                        {
                            case_title: "情況三",
                            input: "797979 979797",
                            output: "181",
                            score: "5"
                        },
                        {
                            case_title: "情況四",
                            input: "111111 111111",
                            output: "1",
                            score: "5"
                        }
                    ]
                }
            ]
        },
        2: {
            title: "活動分組",
            statements: [
                {
                    text: "栗栗國中社團迎新共有 15 個活動（編號 1 至 15 ），依序輸入每位新生報名參加的活動，最後輸入 -1 代表輸入完畢。\n\n請列出尚未有新生報名的活動有哪些。若所有活動皆有新生報名，則顯示「無」。"
                }
            ],
            example_cases: [
                {
                    title: "範例一",
                    input: "1 4 2 6 10 11 5 15 12 13 14 8 -1",
                    output: "3 7 9",
                    description: "新生們依序報名了編號為 1、4、2、6、10、11 、5、15、12、13、14、8 的活動 (-1表示結束)。因此編號 3、7、9 的活動未有新生報名。"
                },
                {
                    title: "範例二",
                    input: "7 3 9 12 1 15 6 10 4 14 9 2 9 13 8 5 11 -1",
                    output: "無",
                    description: "新生們依序報名了編號為 7、3、9、12、1、15、6、10、4、14、9、2、9、13、8、5、11 的活動 (-1表示結束)。因此所有活動皆有新生報名。"
                }
            ],
            cases: [
                {
                    group_title: "所有活動都沒有新生報名",
                    subcase: [
                        { case_title: "情況一", input: "0 -1", output: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15", score: "5" },
                        { case_title: "情況二", input: "-1", output: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15", score: "5" },
                        { case_title: "情況三", input: "16 -1", output: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15", score: "5" },
                        { case_title: "情況四", input: "10000 -1", output: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15", score: "5" },
                        { case_title: "情況五", input: "0 0 0 0 0 -1", output: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15", score: "5" }
                    ]
                },
                {
                    group_title: "部分活動有新生報名",
                    subcase: [
                        { case_title: "情況一", input: "13 1 4 2 6 1 8 2 3 2 14 -1", output: "5 7 9 10 11 12 15", score: "5" },
                        { case_title: "情況二", input: "2 8 2 3 3 8 4 5 15 15 7 7 13 5 11 8 6 4 12 9 6 -1", output: "1 10 14", score: "5" }
                    ]
                },
                {
                    group_title: "所有活動都有新生報名",
                    subcase: [
                        { case_title: "情況一", input: "14 14 12 15 15 11 1 1 13 7 5 9 6 11 1 3 15 13 14 2 13 6 13 4 6 2 10 6 8 -1", output: "無", score: "5" },
                        { case_title: "情況二", input: "1 3 5 7 9 8 4 6 2 10 15 13 12 14 11 -1", output: "無", score: "5" }
                    ]
                }
            ]
        }
    };

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
                title: '任務說明',
                content: <IntroTab questionData={questionData} />,
            },
            {
                value: 'tab2',
                title: '任務演練',
                content: <CodeDrillTab questionData={questionData} />,
            },
            {
                value: 'tab3',
                title: '任務挑戰',
                content: <SubmitTab questionData={questionData} />,
            },
            {
                value: 'tab4',
                title: '挑戰紀錄',
                content: <RecordTab questionData={questionData} />,
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
