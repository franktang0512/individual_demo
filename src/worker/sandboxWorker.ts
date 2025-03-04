self.onmessage = (event) => {
    const { code, timeout } = event.data;

    try {
        let output = "";
        let MAX_OUTPUT_LINES = 100; // 限制最大輸出行數
        let logCount = 0;

        // 改寫 console.log，防止大量輸出
        const consoleLog = console.log;
        console.log = (...args) => {
            if (logCount < MAX_OUTPUT_LINES) {
                output += args.join(" ") + "\n";
                logCount++;
            } else if (logCount === MAX_OUTPUT_LINES) {
                output += "... (超出最大輸出限制，已截斷)\n";
                logCount++;
            }
        };

        let isTimeout = false;
        const timer = setTimeout(() => {
            isTimeout = true;
            self.postMessage({ success: false, error: "執行超時！" });
            self.close();
        }, timeout);

        let sandboxFunction;
        sandboxFunction = new Function(`
            var output_result_string = "";
            ${code}
            return output_result_string.substring(0, 5000) + (output_result_string.length > 5000 ? "\\n...(輸出過長，已截斷)" : ""); // 限制最大輸出長度
        `);

        const result = sandboxFunction();
        output += result; // 將 `output_result_string` 加入輸出

        clearTimeout(timer);
        if (!isTimeout) {
            console.log = consoleLog; // 還原 console.log
            self.postMessage({ success: true, result: output.trim() });
        }
    } catch (error: any) {
        self.postMessage({ success: false, error: error.message });
    }
};
