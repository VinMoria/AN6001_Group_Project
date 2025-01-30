
/*
TODO
支持文生图，文生声音
loading动画
保存markdown文件
*/

const chatRecords = [{ "model": "gpt-4o-mini", "api_key": "" }];

window.onload = function () {

	// 监听回车键按下事件
	document.getElementById('chat-input').addEventListener('keydown', function (event) {
		// 判断是否是回车键（Enter键的键码是13）
		if (event.key === 'Enter') {
			// 当回车键按下时，触发按钮点击事件
			sendMessage()
		}
	});

	// 获取选择的模型
	document.getElementById("modelSelect").addEventListener("change", function () {
		chatRecords[0].model = this.value;
		console.log(chatRecords[0]);
	});

	//获取API key
	document.getElementById("apiKeyInput").addEventListener("change", function () {
		chatRecords[0].api_key = this.value;
		console.log(chatRecords[0]);
		var d = new Date();
		d.setTime(d.getTime() + (100 * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = "api_key=" + this.value + "; " + expires;
		console.log(getCookie("api_key"));

	});

	if (getCookie("api_key") != "") {
		document.getElementById("apiKeyInput").value = getCookie("api_key");
		chatRecords[0].api_key = getCookie("api_key");
	}
}

// 点击Send时触发
function sendMessage() {
	if (chatRecords[0].model == "" || chatRecords[0].api_key == "") { //检查配置是否填写
		alert("Please set the config.");
	} else {
		let input = document.getElementById("chat-input");
		let message = input.value.trim();
		if (message) { // 检查是否为空
			// 将消息添加到聊天框
			addMessageToChatBox(message, "User");
			//清空输入框
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
	msgElement.textContent = "> " + message;
	msgElement.style.padding = "10px";
	msgElement.style.margin = "5px 0";
	msgElement.style.background = "#fff";
	msgElement.style.borderRadius = "5px";
	chatBox.appendChild(msgElement);
	chatBox.scrollTop = chatBox.scrollHeight;
	if (sender == "Bot") {
		msgElement.innerHTML = marked.parse(message, { sanitize: false });
		msgElement.className = "markdown-body";
	}

	if (sender == "User") {
		msgElement.style.color = "#fff";
		msgElement.style.background = "#1e6eff";
	}

	if (sender == "System") {
		msgElement.style.color = "#fd7199";
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

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return "";
}