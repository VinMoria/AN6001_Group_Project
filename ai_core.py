from openai import OpenAI


def gen_text(model, api_key, text_list):
	if model[:8]=="deepseek":
		gpt_client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")
	else:
		gpt_client = OpenAI(api_key=api_key)
	completion = gpt_client.chat.completions.create(
		model=model, messages=text_list)
	assistant_reply = completion.choices[0].message.content
	return assistant_reply


def gen_image(model, api_key, prompt):
	gpt_client = OpenAI(api_key=api_key)
	response = gpt_client.images.generate(
            model=model,
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
	image_url = response.data[0].url
	return image_url
