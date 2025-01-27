from openai import OpenAI

def gen_text(model, api_key, text_list):
	gpt_client = OpenAI(api_key=api_key)
	completion = gpt_client.chat.completions.create(
		model=model, messages=text_list)
	assistant_reply = completion.choices[0].message.content
	return assistant_reply
