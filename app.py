from flask import Flask, request, jsonify, render_template
import ai_core

app = Flask(__name__)

# Route for the chat application UI


@app.route('/')
def index():
	return render_template('index.html')  # Ensure this matches your HTML filename

# API endpoint for handling chat messages


@app.route('/chat', methods=['POST'])
def chat():
	receive_message = request.get_json()  # 解析 JSON 数据
	print("Received data:", receive_message)
	if not receive_message:
		return jsonify({'error': 'No message provided'}), 400

	user_message = receive_message[1:]
	model = receive_message[0]["model"]
	api_key = receive_message[0]["api_key"]

	bot_response = ai_core.gen_text(model, api_key, user_message)

	return jsonify({'response': bot_response})

if __name__ == '__main__':
	app.run(debug=True)
