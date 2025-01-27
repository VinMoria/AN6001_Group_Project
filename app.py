from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Route for the chat application UI
@app.route('/')
def index():
    return render_template('index.html')  # Ensure this matches your HTML filename

# API endpoint for handling chat messages
@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    # Simulate a bot response (can replace with real logic later)
    bot_response = f"Echo: {user_message}"
    return jsonify({'response': bot_response})

if __name__ == '__main__':
    app.run(debug=True)
