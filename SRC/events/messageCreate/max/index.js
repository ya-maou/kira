import { Events } from "discord.js";
import axios from "axios";
console.log("in to tne file.");

const mistralAPI = 'https://api.mistral.ai/v1/chat/completions'; // Mistral API
const ggufAPI = 'http://localhost:4891/v1/chat/completions'; // GGUF 本地 API

export const event = {
    name: Events.MessageCreate,
};

export const action = async (message) => {
    // console.log("Message received:", message.content);
    if (message.author.bot) {
        // console.log("Message is from a bot, skipping...");
        return;
    }
    const botUser = message.client.user;
    // console.log("Bot user:", botUser.username);
    if (!message.mentions.has(botUser)) {
        // console.log("Bot was not mentioned, skipping...");
        return;
    }
    const prompt = message.content.replace(`<@${botUser.id}>`, '').trim();
    // console.log("Prompt extracted:", prompt);

    if (!prompt) {
        // console.log("Prompt is empty, skipping...");
        return;
    }

    try {
        const isProfessionalQuery = checkIfProfessionalQuery(prompt);
        // console.log("Is professional query:", isProfessionalQuery);

        const apiURL = isProfessionalQuery ? ggufAPI : mistralAPI;
        console.log("apiURL:", apiURL);

        const requestData = isProfessionalQuery
            ? {
                  model: "gpt4all", 
                  messages: [
                      {
                          role: "user",
                          content: prompt,
                      },
                  ],
                  temperature: 0.7,
                  max_tokens: 150,
              }
            : {
                  model: "mistral-small-latest", 
                  temperature: 0.7,
                  top_p: 1,
                  max_tokens: 8000,
                  stream: false,
                  stop: "\0",
                  random_seed: 99,
                  messages: [
                      {
                          role: "user",
                          content: prompt,
                      },
                  ],
                  response_format: {
                      type: "text",
                  },
                  tools: [],
                  tool_choice: "auto",
                  safe_prompt: false,
              };

        const headers = !isProfessionalQuery
            ? {
                  Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
                  'Content-Type': 'application/json',
              }
            : { 'Content-Type': 'application/json' };

        // console.log("Sending API request to:", apiURL);
        const response = await axios.post(apiURL, requestData, { headers });
        // console.log("API response received:", response.data);

        const reply = response.data.choices[0].message.content.trim();
        await message.reply(reply);
    } catch (error) {
        console.error("API 調用失敗:", error.response ? error.response.data : error.message);
    }
};

// 判斷
function checkIfProfessionalQuery(prompt) {
    const professionalKeywords = ["教授", "專長", "老師", "李國川", "研究", "王能中", "溫育瑋", "李衍緯", "林奕安"];
    return professionalKeywords.some((keyword) => prompt.includes(keyword));
}
