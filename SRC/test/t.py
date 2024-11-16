# C:\Users\YaMaou\Desktop\QAQ\00\Justaway\kira\src\test\t.py

import requests

# GPT4All 本機 API 端點
API_URL = "http://localhost:4891/v1/chat/completions"

# 發送請求的函數
def query_gpt4all(prompt):
    headers = {
        "Content-Type": "application/json",
    }

    data = {
        "model": "gpt4all",  # 模型名稱
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 1.0,  # 調高隨機性
        "top_p": 0.9,
        "max_tokens": 100,
    }

    try:
        response = requests.post(API_URL, json=data, headers=headers)
        response.raise_for_status()
        result = response.json()
        return result.get("choices", [])[0].get("message", {}).get("content", "")
    except requests.exceptions.RequestException as e:
        print("Error querying GPT4All:", e)
        return None

# 測試調用
if __name__ == "__main__":
    prompt = "溫育緯的專業"
    response = query_gpt4all(prompt)
    print("GPT4All 回應：", response)
