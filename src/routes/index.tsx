// import { CodeEditor } from "@/components/CodeEditor";
// // import { Simulator } from "@/components/Simulator";
// import { Separator } from "@/components/ui/separator";
// // import { Slider } from "@/components/ui/slider";
// // import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { createFileRoute } from "@tanstack/react-router";
// // import speedSlow from "@/assets/graphics/speed_slow.png";
// // import speedFast from "@/assets/graphics/speed_fast.png";
// // import {
// //   Pause,
// //   Play,
// //   Repeat,
// //   CircleDot,
// //   CircleArrowRight,
// //   CircleArrowUp,
// //   CircleMinus,
// // } from "lucide-react";
// // import coinImg from "@/assets/graphics/map_coin.png";
// import { useSimulationStore } from "@/stores/simulation";
// import { useEffect, useRef } from "react";
// // import { useToast } from "@/hooks/use-toast";
// import { worldMaps } from "@/lib/world";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";
// import type { ImperativePanelGroupHandle } from "react-resizable-panels";


// import { useState } from "react";

// export const Route = createFileRoute("/")({
//   component: Index,
// });

// interface TabItem {
//   value: string;
//   title: string;
//   content: React.ReactNode;
// }

// const tabItems: TabItem[] = [
//   {
//     value: "tab1",
//     title: "任務說明",
//     content: <IntroTab />,
//   },
//   {
//     value: "tab2",
//     title: "任務演練",
//     content: <CodeDrillTab />,
//   },
//   {
//     value: "tab3",
//     title: "任務挑戰",
//     // content: <SimulationTab />,
//     content: <SubmitTab />,
//   },
//   {
//     value: "tab4",
//     title: "挑戰紀錄",
//     content: <RecordTab />,
//   },
// ];

// function TabComponentWrapper({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex flex-col justify-center gap-3">
//       <h2 className="ml-4 text-3xl font-semibold">月餅禮盒</h2>
//       <Separator className="bg-gray-300" />
//       {children}
//     </div>
//   );
// }

// function WorldSelector() {
//   const currentWorldId = useSimulationStore((state) => state.currentWorldId);
//   const setCurrentWorldId = useSimulationStore(
//     (state) => state.setCurrentWorldId
//   );

//   return (
//     <Tabs
//       value={currentWorldId.toString()}
//       onValueChange={(value) => setCurrentWorldId(parseInt(value))}
//       className="w-full px-2"
//     >
//       <TabsList className="grid w-full grid-cols-3 bg-gray-300 bg-opacity-30">
//         {worldMaps.map((world) => (
//           <TabsTrigger
//             key={world.id}
//             value={world.id.toString()}
//             className="data-[state=active]:bg-gray-50 data-[state=active]:font-bold"
//           >
//             {world.name}
//           </TabsTrigger>
//         ))}
//       </TabsList>
//     </Tabs>
//   );
// }

// // function SimulatorController() {
// //   const togglePlayPause = useSimulationStore((state) => state.togglePlayPause);
// //   const runSimulation = useSimulationStore((state) => state.runSimulation);
// //   const isPlaying = useSimulationStore((state) => state.isPlaying);
// //   const isComplete = useSimulationStore((state) => state.isComplete);
// //   const currentStateIndex = useSimulationStore(
// //     (state) => state.currentStateIndex
// //   );

// //   const handleButtonClick = () => {
// //     if (currentStateIndex === 0 && !isPlaying) {
// //       runSimulation("");
// //     } else {
// //       togglePlayPause();
// //     }
// //   };

// //   return (
// //     <Button
// //       aria-label="start"
// //       className="w-24 rounded-full bg-gray-200 py-6 text-gray-900 shadow-[0_10px_theme(colors.gray.400)] transition-[transform,box-shadow] duration-75 hover:bg-gray-200 hover:shadow-[0_10px_theme(colors.gray.500)] active:translate-y-[6px] active:shadow-[0_4px_theme(colors.gray.600)] xl:w-32"
// //       onClick={handleButtonClick}
// //     >
// //       {isPlaying ? (
// //         <Pause className="!size-6" />
// //       ) : isComplete ? (
// //         <Repeat className="!size-6" />
// //       ) : (
// //         <Play className="!size-6" />
// //       )}
// //     </Button>
// //   );
// // }

// // function SimulatorSpeedController() {
// //   const speed = useSimulationStore((state) => state.speed);
// //   const setSpeed = useSimulationStore((state) => state.setSpeed);

// //   return (
// //     <div className="flex flex-col gap-2">
// //       <div className="flex justify-between px-2">
// //         <img src={speedSlow} alt="slow" className="size-6" />
// //         <img src={speedFast} alt="fast" className="size-6" />
// //       </div>
// //       <Slider
// //         value={[speed]}
// //         min={0.5}
// //         max={2}
// //         step={0.01}
// //         onValueChange={([value]) => setSpeed(value)}
// //       />
// //     </div>
// //   );
// // }

// // function CoinsCountIndicator({ coins }: { coins: number }) {
// //   return (
// //     <div className="mr-2 flex items-center gap-4">
// //       <img src={coinImg} alt="coin_count" className="size-10" />
// //       <span className="text-2xl font-semibold">{coins}</span>
// //     </div>
// //   );
// // }

// // 點範例按鈕後可以看到的內容
// interface ExampleButtonProps {
//   text: string;
//   onClick: () => void;
//   isActive: boolean;
// }

// function ExampleButton({ text, onClick, isActive }: ExampleButtonProps) {
//   return (
//     <button
//       onClick={onClick}
//       className={`relative w-full py-4 text-xl font-bold rounded-full shadow-md transition-all border border-gray-300 z-20 ${isActive ? "bg-[#00D1D0] text-white" : "bg-white text-[#00D1D0]"}`}
//     >
//       {text}
//     </button>
//   );
// }

// interface ExampleContentProps {
//   title: string;
//   input: string;
//   output: string;
//   description: string;
//   isVisible: boolean;
// }

// function ExampleContent({ title, input, output, description, isVisible }: ExampleContentProps) {
//   return (
//     <div
//       className={`relative w-full max-w-lg bg-[#00A5AD] text-white rounded-lg p-4 shadow-lg overflow-hidden transition-all duration-300 -mt-6 ${isVisible ? "max-h-[500px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"}`}
//     >
//       {/* <h3 className="text-2xl font-bold text-center">{title}</h3> */}
//       <div className="flex justify-between mt-4 p-2 bg-white text-black rounded-md">
//         <div className="text-center w-1/2 border-r border-gray-300">
//           <p className="font-bold">輸入</p>
//           <p className="mt-1 text-lg">{input}</p>
//         </div>
//         <div className="text-center w-1/2">
//           <p className="font-bold">輸出</p>
//           <p className="mt-1 text-lg">{output}</p>
//         </div>
//       </div>
//       <p className="mt-4 text-lg text-center">{description}</p>
//     </div>
//   );
// }

// function IntroTab() {
//   const [activeExample, setActiveExample] = useState<string | null>(null);

//   const examples: Record<string, ExampleContentProps> = {
//     "範例一": {
//       title: "範例一",
//       input: "A 2 B 3 -1",
//       output: "2250 元",
//       description: "購買輕享盒(A) 2盒、經典盒(B) 3盒(-1代表結帳)。滿五盒享9折優惠，總金額為2250元。",
//       isVisible: activeExample === "範例一"
//     },
//     "範例二": {
//       title: "範例二",
//       input: "B 1 A 1 C 1 -1",
//       output: "1350 元",
//       description: "購買經典盒(B) 1盒、輕享盒(A) 1盒、精選盒(C) 1盒(-1代表結帳)。未滿五盒無優惠，總金額為1350元。",
//       isVisible: activeExample === "範例二"
//     }
//   };

//   return (
//     <TabComponentWrapper>
//       {/* <h2 className="px-4 text-3xl font-bold">月餅禮盒</h2> */}
//       <p className="px-4 text-xl">月餅店推出三種禮盒，單筆滿五盒享9折優惠，品項如下：</p>
//       <ul className="px-6 text-xl list-disc">
//         <li>A. 輕享盒 250元</li>
//         <li>B. 經典盒 500元</li>
//         <li>C. 精選盒 600元</li>
//       </ul>
//       <p className="px-4 text-xl">請輸入購買品項與數量後，計算出總金額。</p>
//       <div className="flex flex-col items-center gap-4 mt-4 w-full max-w-lg">
//         {Object.keys(examples).map((key) => (
//           <div key={key} className="w-full relative">
//             <ExampleButton
//               text={key}
//               isActive={activeExample === key}
//               onClick={() => setActiveExample(activeExample === key ? null : key)}
//             />
//             {activeExample === key && (
//               <ExampleContent {...examples[key]} isVisible={true} />
//             )}
//           </div>
//         ))}
//       </div>
//     </TabComponentWrapper>
//   );
// }



// function CodeDrillTab() {
//   const [activeExample, setActiveExample] = useState<string | null>(null);

//   const examples: Record<string, ExampleContentProps> = {
//     "範例一": {
//       title: "範例一",
//       input: "A 2 B 3 -1",
//       output: "2250 元",
//       description: "購買輕享盒(A) 2盒、經典盒(B) 3盒(-1代表結帳)。滿五盒享9折優惠，總金額為2250元。",
//       isVisible: activeExample === "範例一"
//     },
//     "範例二": {
//       title: "範例二",
//       input: "B 1 A 1 C 1 -1",
//       output: "1350 元",
//       description: "購買經典盒(B) 1盒、輕享盒(A) 1盒、精選盒(C) 1盒(-1代表結帳)。未滿五盒無優惠，總金額為1350元。",
//       isVisible: activeExample === "範例二"
//     }
//   };

//   return (
//     <TabComponentWrapper>
//       <div className="flex flex-col items-start gap-4 w-full max-w-lg">
//         <div className="flex flex-col items-center space-y-2">
//           <button className="shadow-md px-8 py-3 bg-white rounded-full border border-gray-300 flex items-center justify-center w-24 h-12">
//             <img src="/img/flag.svg" alt="Start" className="w-8 h-8" />
//           </button>
//           <div className="flex flex-col text-lg font-bold text-center">
//             <span>輸出：</span>
//             <span>1300元</span>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col items-center gap-4 mt-4 w-full max-w-lg">
//         {Object.keys(examples).map((key) => (
//           <div key={key} className="w-full relative">
//             <ExampleButton
//               text={key}
//               isActive={activeExample === key}
//               onClick={() => setActiveExample(activeExample === key ? null : key)}
//             />
//             {activeExample === key && (
//               <ExampleContent {...examples[key]} isVisible={true} />
//             )}
//           </div>
//         ))}
//       </div>
//     </TabComponentWrapper>
//   );
// }


// function CheckmarkIcon({ isCorrect }: { isCorrect: boolean }) {
//   return (
//     <span
//       className={`mr-2 font-bold ${isCorrect ? "text-green-400" : "text-white"}`}
//       style={{ color: isCorrect ? "#8FFF00" : "#FFFFFF" }} // 這裡強制覆蓋 Tailwind
//     >
//       {isCorrect ? "✔" : "❌"}
//     </span>
//   );
// }

// function SubmitTab() {
//   const [activeExample, setActiveExample] = useState<string | null>(null);
//   const [isEvaluated, setIsEvaluated] = useState(false);

//   const examples: Record<
//     string,
//     { title: string; details: { label: string; isCorrect: boolean }[]; isCorrect: boolean }
//   > = {
//     "三盒均購買未滿 5 盒": {
//       title: "三盒均購買未滿 5 盒",
//       details: [
//         { label: "輕享盒(A) 3盒", isCorrect: false },
//         { label: "經典盒(B) 4盒", isCorrect: false },
//         { label: "精選盒(C) 2盒", isCorrect: false },
//       ],
//       isCorrect: false,
//     },
//     "單盒購買滿 5 盒": {
//       title: "單盒購買滿 5 盒",
//       details: [
//         { label: "輕享盒(A)滿5盒", isCorrect: true },
//         { label: "經典盒(B)滿5盒", isCorrect: true },
//         { label: "精選盒(C)滿5盒", isCorrect: true },
//       ],
//       isCorrect: true,
//     },
//     "兩盒均購買滿 5 盒": {
//       title: "兩盒均購買滿 5 盒",
//       details: [
//         { label: "經典盒(B)滿5盒", isCorrect: true },
//         { label: "精選盒(C) 3盒", isCorrect: false },
//       ],
//       isCorrect: false,
//     },
//     "三盒均購買滿 5 盒": {
//       title: "三盒均購買滿 5 盒",
//       details: [
//         { label: "輕享盒(A)滿5盒", isCorrect: true },
//         { label: "經典盒(B)滿5盒", isCorrect: true },
//         { label: "精選盒(C)滿5盒", isCorrect: true },
//       ],
//       isCorrect: true,
//     },
//   };

//   return (
//     <TabComponentWrapper>
//       {/* 進度條 (一開始顯示灰色，點擊後才變綠色並顯示數字) */}
//       <div className="w-full max-w-lg bg-gray-200 rounded-full h-6 flex items-center relative">
//         <div
//           className={`h-full rounded-full transition-all duration-500 ${
//             isEvaluated ? "bg-green-500" : "bg-gray-200"
//           }`}
//           style={{ width: isEvaluated ? "60%" : "0%" }}
//         ></div>
//         {isEvaluated && <span className="absolute w-full text-center font-bold text-black">60%</span>}
//       </div>

//       {/* 按鈕區塊 */}
//       <div className="flex justify-center gap-4 mt-4">
//         <button className="bg-[#00D1D0] text-white font-bold py-2 px-4 rounded-full border border-[#00D1D0]">
//           儲存作答
//         </button>
//         <button
//           className="bg-[#00D1D0] text-white font-bold py-2 px-4 rounded-full border border-[#00D1D0]"
//           onClick={() => setIsEvaluated(true)}
//         >
//           進行評分
//         </button>
//       </div>

//       {/* 測資測試 */}
//       <div className="flex flex-col items-center gap-4 mt-6 w-full max-w-lg">
//         {Object.keys(examples).map((key) => (
//           <div key={key} className="w-full relative">
//             {/* 按鈕 */}
//             <button
//               className={`font-bold py-4 px-6 rounded-full w-full shadow-md border relative z-10 transition-all ${
//                 isEvaluated
//                   ? activeExample === key
//                     ? examples[key].isCorrect
//                       ? "bg-[#2B8A3E] text-white border-[#2B8A3E]"
//                       : "bg-[#D9534F] text-white border-[#D9534F]"
//                     : examples[key].isCorrect
//                     ? "bg-white text-[#008C4A] border-gray-300"
//                     : "bg-white text-red-500 border-gray-300"
//                   : "bg-white text-black border-gray-300"
//               }`}
//               onClick={() => isEvaluated && setActiveExample(activeExample === key ? null : key)}
//               disabled={!isEvaluated}
//             >
//               {key}
//             </button>

//             {/* 展開內容 */}
//             {isEvaluated && activeExample === key && (
//               <div
//                 className={`w-full font-bold py-4 px-6 rounded-lg shadow-md relative -mt-6 text-center ${
//                   examples[key].isCorrect ? "bg-[#2B8A3E] text-white" : "bg-[#D9534F] text-white"
//                 }`}
//               >
//                 {/* <p className="text-center mt-4">{examples[key].title}</p> */}
//                 <p className="text-center mt-4"></p>
//                 <div className="flex flex-col items-center mt-2 px-6">
//                   {examples[key].details.map((detail, index) => (
//                     <p key={index} className="flex items-center">
//                       <CheckmarkIcon isCorrect={detail.isCorrect} />
//                       {detail.label}
//                     </p>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </TabComponentWrapper>
//   );
// }








// function RecordTab() {
//   // 模擬大量學生歷史作答紀錄
//   const [progressRecords, setProgressRecords] = useState([
//     { timestamp: "08:49:21", progress: 0 },
//     { timestamp: "08:51:10", progress: 5 },
//     { timestamp: "08:53:02", progress: 25 },
//     { timestamp: "08:58:16", progress: 40 },
//     { timestamp: "09:06:01", progress: 60 },
//     { timestamp: "09:06:21", progress: 30 },
//     { timestamp: "09:13:15", progress: 75 },
//     { timestamp: "09:14:21", progress: 95 },
//     { timestamp: "09:15:00", progress: 100 },
//     { timestamp: "09:16:10", progress: 85 },
//     { timestamp: "09:18:25", progress: 50 },
//     { timestamp: "09:20:37", progress: 10 },
//     { timestamp: "09:22:49", progress: 35 },
//     { timestamp: "09:25:00", progress: 70 },
//     { timestamp: "09:27:15", progress: 90 },
//     { timestamp: "09:30:45", progress: 100 },
//   ]);

//   // 🎯 使用 `.sort()` 來排序時間（最新的在最上面）
//   const sortedRecords = [...progressRecords].sort((a, b) => {
//     return b.timestamp.localeCompare(a.timestamp); // 讓時間從新到舊排序
//   });

//   return (
//     <TabComponentWrapper>
//       {/* 🎯 限制歷史紀錄區域的高度，並允許內部滾動 */}
//       <div className="w-full max-w-lg max-h-[470px] overflow-y-auto rounded-lg shadow-md border border-gray-300 p-2">
//         <div className="flex flex-col gap-2">
//           {sortedRecords.map((record, index) => (
//             <button
//               key={index}
//               className="w-full flex items-center gap-4 bg-white border border-gray-300 rounded-full shadow px-4 py-3 transition-all duration-300 hover:bg-gray-100 active:bg-gray-200"
//             >
//               {/* ⏳ 時間戳記 */}
//               <span className="text-lg font-bold w-24">{record.timestamp}</span>
              
//               {/* 📊 進度條 */}
//               <div className="w-full bg-gray-200 rounded-full h-6 relative">
//                 <div
//                   className="bg-green-400 h-full rounded-full transition-all duration-500"
//                   style={{ width: `${record.progress}%` }}
//                 ></div>
//                 <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-black font-bold">
//                   {record.progress}%
//                 </span>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>
//     </TabComponentWrapper>
//   );
// }




// // function SimulationTab() {
// //   const simulationStates = useSimulationStore(
// //     (state) => state.simulationStates
// //   );
// //   const currentStateIndex = useSimulationStore(
// //     (state) => state.currentStateIndex
// //   );
// //   const setCurrentStateIndex = useSimulationStore(
// //     (state) => state.setCurrentStateIndex
// //   );
// //   const speed = useSimulationStore((state) => state.speed);
// //   const isPlaying = useSimulationStore((state) => state.isPlaying);
// //   const setIsPlaying = useSimulationStore((state) => state.setIsPlaying);
// //   const setIsComplete = useSimulationStore((state) => state.setIsComplete);

// //   const currentState = simulationStates[currentStateIndex];

// //   const directions = simulationStates
// //     .slice(Math.max(0, currentStateIndex - 10), currentStateIndex + 1)
// //     .map((state) => state.direction);

// //   const { toast } = useToast();

// //   useEffect(() => {
// //     if (!isPlaying) return;

// //     const interval = setInterval(() => {
// //       if (currentStateIndex >= simulationStates.length - 1) {
// //         setIsPlaying(false);
// //         setIsComplete(true);

// //         if (currentState.error) {
// //           let message = currentState.error.toLowerCase();
// //           if (
// //             message.includes("consecutive idle steps") ||
// //             message.includes("consecutive invalid moves") ||
// //             message.includes("infinite loop")
// //           ) {
// //             message = "步數過多，停止執行";
// //           } else {
// //             console.error(message);
// //             message = "程式執行錯誤";
// //           }
// //           toast({
// //             title: "挑戰失敗",
// //             description: message,
// //             variant: "destructive",
// //             duration: 4000,
// //           });
// //         } else {
// //           toast({
// //             title: "挑戰成功",
// //             description: `總共獲得 ${currentState.accumulatedCoins} 枚金幣`,
// //             variant: "success",
// //             duration: 4000,
// //           });
// //         }
// //         return;
// //       }
// //       setCurrentStateIndex(currentStateIndex + 1);
// //     }, 1000 / speed);

// //     return () => clearInterval(interval);
// //   }, [
// //     isPlaying,
// //     currentStateIndex,
// //     simulationStates.length,
// //     setCurrentStateIndex,
// //     setIsPlaying,
// //     setIsComplete,
// //     currentState.error,
// //     toast,
// //     currentState.accumulatedCoins,
// //     speed,
// //   ]);

// //   return (
// //     <TabComponentWrapper>
// //       <WorldSelector />
// //       <div className="flex justify-center pr-2">
// //         <Simulator world={currentState.world} />
// //       </div>
// //       {directions.length > 0 && (
// //         <div className="flex justify-center gap-2">
// //           {directions.map((direction, index) =>
// //             index === 0 && direction === "none" ? (
// //               <CircleDot key={index} className="!size-4" />
// //             ) : direction === "right" ? (
// //               <CircleArrowRight key={index} className="!size-4" />
// //             ) : direction === "up" ? (
// //               <CircleArrowUp key={index} className="!size-4" />
// //             ) : (
// //               <CircleMinus key={index} className="!size-4" />
// //             )
// //           )}
// //         </div>
// //       )}
// //       <div className="flex flex-col justify-center gap-10 px-2">
// //         <SimulatorSpeedController />
// //         <div className="flex items-center justify-between px-0 xl:px-6">
// //           <SimulatorController />
// //           <CoinsCountIndicator coins={currentState.accumulatedCoins} />
// //         </div>
// //       </div>
// //     </TabComponentWrapper>
// //   );
// // }

// const mapLayouts = {
//   1: [70, 30],
//   2: [65, 35],
//   3: [60, 40],
// };

// function Index() {
//   const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);
//   const currentWorldId = useSimulationStore((state) => state.currentWorldId);

//   useEffect(() => {
//     const panelGroup = panelGroupRef.current;
//     if (panelGroup) {
//       panelGroup.setLayout(
//         mapLayouts[currentWorldId as keyof typeof mapLayouts]
//       );
//     }
//   }, [currentWorldId]);

//   return (
//     <ResizablePanelGroup
//       ref={panelGroupRef}
//       direction="horizontal"
//       className="flex h-full overflow-clip rounded-t-2xl"
//     >
//       <ResizablePanel>
//         <CodeEditor />
//       </ResizablePanel>
//       <ResizableHandle withHandle />
//       <ResizablePanel minSize={mapLayouts[1][1]}>
//         <Tabs
//           defaultValue="tab1"
//           orientation="vertical"
//           className="flex h-full flex-row"
//         >
//           {tabItems.map((tab) => (
//             <TabsContent
//               key={tab.value}
//               value={tab.value}
//               className="mt-0 grow bg-gray-50 bg-[url('/img/base_2.png')] bg-right-bottom px-1 py-4"
//             >
//               {tab.content}
//             </TabsContent>
//           ))}
//           <TabsList className="flex h-full w-12 min-w-12 flex-col justify-start rounded-none bg-[url('/img/base_3.png')] bg-left p-0 pt-40 pt-0">
//             {tabItems.map((tab) => (
//               <TabsTrigger
//                 key={tab.value}
//                 value={tab.value}
//                 className="w-full rounded-none rounded-r-sm bg-cover py-8 text-lg tracking-wider data-[state=active]:bg-[url('/img/base_button.png')]"
//                 style={{
//                   writingMode: "vertical-lr",
//                   textOrientation: "upright",
//                 }}
//               >
//                 {tab.title}
//               </TabsTrigger>
//             ))}
//           </TabsList>
//         </Tabs>
//       </ResizablePanel>
//     </ResizablePanelGroup>
//   );
// }



import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const router = useRouter();
  // const { isLoggedIn } = router.options.context as { isLoggedIn: boolean };
  // const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     router.navigate({ to: "/questions" }); // Redirect to /questions if logged in
  //   } else {
  //     router.navigate({ to: "/login" }); // Redirect to /login if not logged in
  //   }
  // }, [isLoggedIn, router]);


  useEffect(() => {
    router.navigate({ to: "/questions" });
  }, [router]);

  return null; // This route doesn't render any content
}

export default Index;
