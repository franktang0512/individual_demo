self.onmessage = async (event: MessageEvent) => {
    const { code, timeout, testInputs } = event.data;

    try {
        let output = "";
        const MAX_OUTPUT_LENGTH = 500; // 限制輸出長度
        const MAX_LINES = 1000; // 限制最大行數
        let logCount = 0;

        // 攔截 console.log，防止過量輸出
        const originalConsoleLog = console.log;
        console.log = (...args) => {
            if (logCount < MAX_LINES) {
                let logOutput = args.join(" ") + "\n";
                if (output.length + logOutput.length > MAX_OUTPUT_LENGTH) {
                    output += "...(輸出過長，已截斷)\n";
                    logCount = MAX_LINES;
                } else {
                    output += logOutput;
                    logCount++;
                }
            }
        };

        let isTimeout = false;
        const timer = setTimeout(() => {
            isTimeout = true;
            self.postMessage({ success: false, error: "執行超時！" });
            cleanup(); // 清理記憶體
        }, timeout);

        // **執行程式碼，防止長輸出**
        const sandboxFunction = new Function("testInputs", `
            var output_result_string = "";
            ${code}
            var result = output_result_string.length > ${MAX_OUTPUT_LENGTH} 
                ? output_result_string.substring(0, ${MAX_OUTPUT_LENGTH}) + "...(輸出過長，已截斷)" 
                : output_result_string;
            return result;
        `) as (testInputs: (string | number)[]) => string;

        const result = sandboxFunction(testInputs);
        output += result;

        clearTimeout(timer);

        if (!isTimeout) {
            console.log = originalConsoleLog;
            self.postMessage({ success: true, result: output.trim() });
        }

        await cleanup();

    } catch (error: any) {
        self.postMessage({ success: false, error: error.message });
        await cleanup();
    }
};

// **強制清理記憶體，防止 STATUS_ACCESS_VIOLATION**
const cleanup = async () => {
    return new Promise((resolve) => {
        try {
            (self as any).output_result_string = null;
            (self as any).output = null;
            if (typeof (self as any).gc === "function") {
                (self as any).gc();
            }
        } catch (err) {}

        setTimeout(() => {
            self.close(); // **確保 Worker 被正確關閉**
            resolve(true);
        }, 100);
    });
};
