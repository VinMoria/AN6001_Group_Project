from openai import OpenAI

client = OpenAI(api_key="sk-wvpnzlshtibibtoneqhbrrhvfhbrhbhbpjsitidijifzwtpd", base_url="https://api.siliconflow.cn")

response = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-R1",
    messages=[
        {"role": "user", "content": "你好"}
    ],
    stream=False
)

print(response.model_dump_json())