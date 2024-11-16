import { Events } from "discord.js";
import axios from "axios";

export const event = {
    name: Events.MessageCreate,
};

export const action = async (message) => {
    if (message.author.bot) return; // 忽略機器人的訊息
    const botUser = message.client.user;

    // 檢查用戶是否標註了 @KIRA 且訊息開頭有 "!"
    if (!message.mentions.has(botUser) || !message.content.startsWith("!")) return;
    
    // 提取去掉標註部分和開頭 "!" 的 prompt
    const prompt = message.content.replace(`<@${botUser.id}>`, '').replace(/^!/, '').trim();

    try {
        // 調用 GPT4All 本地 API
        const response = await axios.post(
            'http://localhost:4891/v1/chat/completions', // GPT4All API 端點
            {
                model: "gpt4all", // 使用的模型
                messages: [
                    {
                        role: "user",
                        content: prompt // 傳入用戶輸入作為 prompt
                    }
                ],
                temperature: 0.7, // 隨機性參數
                max_tokens: 100, // 最大生成長度
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // 取得回應內容
        const reply = response.data.choices[0].message.content.trim();
        await message.reply(reply); // 回覆用戶
    } catch (error) {
        console.error('GPT4All API 調用失敗:', error.response ? error.response.data : error.message);
        await message.reply('抱歉，我無法生成回應。'); // 回應用戶錯誤訊息
    }
};
