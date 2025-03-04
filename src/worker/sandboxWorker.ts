self.onmessage = (event) => {
    const { code, timeout } = event.data;
    try {
        let output = "";
        const consoleLog = console.log;
        console.log = (...args) => { output += args.join(" ") + "\n"; };

        let isTimeout = false;
        const timer = setTimeout(() => {
            isTimeout = true;
            self.postMessage({ success: false, error: "執行超時！" });
            self.close(); // 關閉 Worker
        }, timeout);

        // **安全執行程式碼**
        const sandboxFunction = new Function(`${code}; return output_result_string;`);
        const result = sandboxFunction();

        clearTimeout(timer); // **程式正常結束時清除 timeout**
        if (!isTimeout) {
            console.log = consoleLog; // 還原 console.log
            self.postMessage({ success: true, result });
        }
    } catch (error: any) {
        self.postMessage({ success: false, error: error.message });
    }
};
