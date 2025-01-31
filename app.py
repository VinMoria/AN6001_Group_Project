from flask import Flask, request, jsonify, render_template, send_file, send_from_directory
import ai_core
import os

app = Flask(__name__)

# Route for the chat application UI

# 获取web页面
@app.route('/')
def index():
	return render_template('index.html')  # Ensure this matches your HTML filename

# 提供静态图片资源
@app.route('/images/<filename>')
def get_image(filename):
    return send_from_directory('static/images', filename)

# 文本生成
@app.route('/chat', methods=['POST'])
def chat():
	receive_message = request.get_json()  # 解析 JSON 数据
	# print("Received data:", receive_message)
	if not receive_message:
		return jsonify({'error': 'No message provided'}), 400

	user_message = receive_message[1:]
	model = receive_message[0]["model"]
	api_key = receive_message[0]["api_key"]

	bot_response = ai_core.gen_text(model, api_key, user_message)

	return jsonify({'response': bot_response})

# 图片生成
@app.route('/gen_image', methods=['POST'])
def gen_image():
	receive_message = request.get_json()
	if not receive_message:
		return jsonify({'error': 'No message provided'}), 400
	model = receive_message["model"]
	api_key = receive_message["api_key"]
	prompt = receive_message["prompt"]
	bot_response = ai_core.gen_image(model, api_key, prompt)
	return jsonify({'response': bot_response})

# 确保临时存储目录存在
os.makedirs("temp", exist_ok=True)
# 生成markdown文件
@app.route("/generate_md", methods=["POST"])
def generate_md():
	md_content = ""
	receive_message = request.get_json()  # 解析 JSON 数据
	# print(receive_message)
	user_message = receive_message[1:]
	for message in user_message:
		if message["role"] == "user":
			md_content += f"# User\n\n"
			md_content += f"{message['content']}\n\n"
		elif message["role"] == "assistant":
			md_content += f"# AI\n\n"
			md_content += f"{message['content']}\n\n"

	# 生成Markdown文件内容
	md_file_path = "temp/talk_note.md"

	# 将内容写入文件
	with open(md_file_path, 'w', encoding='utf-8') as md_file:
		md_file.write(md_content)

	# 返回文件
	return send_file(md_file_path, as_attachment=True)


if __name__ == '__main__':
	app.run(debug=True)
