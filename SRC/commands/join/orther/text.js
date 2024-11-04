// 引入 child_process 模塊
import { exec } from 'child_process';

// 使用 exec 函數來運行 Python 腳本
// exec('python src/commands/join/speech2.py', (error, stdout, stderr) => {
exec('python src/commands/join/pp.py', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    console.log(`Output: ${stdout}`);
});
