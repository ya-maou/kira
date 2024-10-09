import { Events } from "discord.js";
import axios from "axios";

export const event = {
    name: Events.MessageCreate,
};

export const action = async (message) => {
    if (message.author.bot) return; // 不回應其他機器人

    const botUser = message.client.user; // 獲取 bot 自己的用戶資訊

    // 檢查用戶是否有標註 @KIRA
    if (!message.mentions.has(botUser)) return; // 若無標註機器人則不回應

    const prompt = message.content.replace(`<@${botUser.id}>`, '').trim(); // 移除 @KIRA，取得用戶輸入的內容

    try {
        // 調用 Mistral API
        const response = await axios.post(
            'https://api.mistral.ai/v1/chat/completions',  // 正確的 Mistral API 地址
            {
                model: "mistral-small-latest",  // 指定模型
                temperature: 0.7,
                top_p: 1,
                max_tokens: 100,
                min_tokens: 0,
                stream: false,
                stop: "\0",
                random_seed: 0,
                messages: [
                    {
                        role: "user",
                        content: prompt  // 使用者輸入的訊息作為 prompt
                    }
                ],
                response_format: {
                    type: "text"
                },
                tools: [],
                tool_choice: "auto",
                safe_prompt: false
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,  // 從環境變數讀取 API Key
                    'Content-Type': 'application/json'
                },
            }
        );

        const reply = response.data.choices[0].message.content.trim(); // 獲取 Mistral 回應
        await message.reply(reply);  // Bot 在 Discord 頻道回應用戶
    } catch (error) {
        console.error('Mistral API 調用失敗:', error.response ? error.response.data : error.message);
        //await message.reply('抱歉，我無法生成回應。');  // 錯誤時回應用戶
    }
};
