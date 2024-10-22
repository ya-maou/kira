import { Events } from "discord.js";
import axios from "axios";

export const event = {
    name: Events.MessageCreate,
};

export const action = async (message) => {
    if (message.author.bot) return; 

    const botUser = message.client.user; 

    // 檢查用戶是否有標註 @KIRA
    if (!message.mentions.has(botUser)) return; 

    const prompt = message.content.replace(`<@${botUser.id}>`, '').trim(); 

    try {
        // 調用 Mistral API
        const response = await axios.post(
            'https://api.mistral.ai/v1/chat/completions',  
            {
                model: "mistral-small-latest",  
                temperature: 0.7,
                top_p: 1,
                max_tokens: 8000,
                min_tokens: 0,
                stream: false,
                stop: "\0",
                random_seed: 99,
                messages: [
                    {
                        role: "user",
                        content: prompt  
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
                    Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,  
                    'Content-Type': 'application/json'
                },
            }
        );

        const reply = response.data.choices[0].message.content.trim(); 
        await message.reply(reply);   
    } catch (error) {
        console.error('Mistral API 調用失敗:', error.response ? error.response.data : error.message);
        //await message.reply('抱歉，我無法生成回應。');  
    }
};
