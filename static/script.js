
/*
TODO 
markdown格式
回车fasong
api_key存cookie
支持文生图，文生声音
chatbox格式
*/
//import marked from 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';

const chatRecords = [{ "model": "gpt-4o-mini", "api_key": "" }];

window.onload = function () {

	// 获取选择的模型
	document.getElementById("modelSelect").addEventListener("change", function () {
		chatRecords[0].model = this.value;
		console.log(chatRecords[0]);
	});

	//获取API key
	document.getElementById("apiKeyInput").addEventListener("change", function () {
		chatRecords[0].api_key = this.value;
		console.log(chatRecords[0]);
	});
}

// 点击Send时触发
function sendMessage() {
	if (chatRecords[0].model == "" || chatRecords[0].api_key == "") {
		alert("Please set the config.");
	} else {
		let input = document.getElementById("chat-input");
		let message = input.value.trim();
		if (message) {
			addMessageToChatBox(message, "User");
			input.value = "";
			//记入对话记录，用于发送
			chatRecords.push({ role: "user", content: message });
			//发送消息到服务器
			sendMessageToServer();
		} else {
			alert("Please enter a message.");
		}
	}

}

// 将发送的消息显示在前端 
function addMessageToChatBox(message, sender) {
	let chatBox = document.getElementById("chat-box");
	let msgElement = document.createElement("div");
	msgElement.textContent = sender + ": " + message;
	msgElement.style.padding = "10px";
	msgElement.style.margin = "5px 0";
	msgElement.style.background = "#fff";
	msgElement.style.borderRadius = "5px";
	chatBox.appendChild(msgElement);
	chatBox.scrollTop = chatBox.scrollHeight;
	if (sender == "Bot") {
		msgElement.innerHTML = marked.parse(msgElement.innerHTML);
	}
}

// Function to send message to the server
async function sendMessageToServer() {
	try {
		const response = await fetch('/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(chatRecords)
		});

		if (!response.ok) {
			throw new Error('Failed to send message');
		}

		// 接收到服务器消息后
		const data = await response.json();
		addMessageToChatBox(data.response, "Bot");
		chatRecords.push({ role: "assistant", content: data.response });
		console.log(chatRecords);
	} catch (error) {
		console.error('Error:', error);
		addMessageToChatBox("Error: Unable to get a response from the server.", "System");
	}
}
