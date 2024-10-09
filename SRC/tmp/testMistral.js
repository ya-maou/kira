// testMistral.js
import axios from 'axios';

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions'; // 使用正確的 API URL
const API_KEY = 'MISTRAL_API_KEY'; // 替換為你的 API 密鑰

const requestBody = {
  model: "mistral-small-latest",
  temperature: 0.7,
  top_p: 1,
  max_tokens: 100, // 可以設置為想要的最大令牌數
  min_tokens: 0,
  stream: false,
  stop: "\n", // 停止標記
  random_seed: 0,
  messages: [
    {
      role: "user",
      content: "Who is the best French painter? Answer in one short sentence."
    }
  ],
  response_format: {
    type: "text"
  },
  tools: [],
  tool_choice: "auto",
  safe_prompt: false
};

const generateResponse = async () => {
  try {
    const response = await axios.post(MISTRAL_API_URL, requestBody, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Response:', response.data); // 打印生成的結果
  } catch (error) {
    console.error('Error with Mistral API:', error.response.data); // 打印錯誤信息
  }
};

generateResponse();
