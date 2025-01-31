
/*
TODO
loading动画
折叠侧边栏
*/

const chatRecords = [{ "model": "gpt-4o-mini", "api_key": "" }];
const GPT_LIST = ["gpt-4o", "gpt-4o-mini"]
const AIG_LIST = ["dall-e-3", "dall-e-2"]

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

	//读取api key cookie
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
			//加载动画
			let chatBox = document.getElementById("chat-box");
			let imgElement = document.createElement("img");
			imgElement.src = "/images/loading.gif";
			imgElement.style.maxWidth = "10%";
			imgElement.id = "loading-img";
			chatBox.appendChild(imgElement);
			chatBox.scrollTop = chatBox.scrollHeight;

			if (GPT_LIST.includes(chatRecords[0].model)) {
				//记入对话记录，用于发送
				chatRecords.push({ role: "user", content: message });
				//发送消息到服务器
				sendMessageToServer();
			} else if (AIG_LIST.includes(chatRecords[0].model)) {
				sendPromptToAIG(message)
			}

		} else {
			alert("Please enter a message.");
		}
	}
}

//接收到消息后，删除loading-gif
function removeLoadingGif() {
	let loadingImg = document.getElementById("loading-img");
	if (loadingImg) {
		loadingImg.remove();
	}
}

// 将发送的消息显示在前端 
function addMessageToChatBox(message, sender) {
	let chatBox = document.getElementById("chat-box");
	let msgElement = document.createElement("div");
	msgElement.textContent = message;
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

//将图片链接显示到前端
function addImageToChatBox(imageUrl) {
	let chatBox = document.getElementById("chat-box");
	let imgElement = document.createElement("img");
	imgElement.src = imageUrl;
	imgElement.style.maxWidth = "30%";
	chatBox.appendChild(imgElement);
	chatBox.scrollTop = chatBox.scrollHeight;
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
		removeLoadingGif();
	} catch (error) {
		console.error('Error:', error);
		addMessageToChatBox("Error: Unable to get a response from the server.", "System");
	}
}

// send prompt to server to gen image
async function sendPromptToAIG(prompt) {
	try {
		const response = await fetch('/gen_image', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				model: chatRecords[0].model,
				api_key: chatRecords[0].api_key,
				prompt: prompt
			})
		});

		if (!response.ok) {
			throw new Error('Failed to fetch image');
		}

		// 接收到服务器返回的图片链接
		const data = await response.json();
		addImageToChatBox(data.response); // 假设有一个方法用于显示图片
		console.log("Image URL:", data.response);
		removeLoadingGif();

	} catch (error) {
		console.error('Error:', error);
		displayImageFallback(); // 备用方案，假设有一个方法用于显示默认图片
	}
}

// Function to send message to the server
async function generateMdFromMessage() {
	try {
		const response = await fetch('/generate_md', {
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
		const blob = await response.blob(); // 解析成Blob对象
		const url = window.URL.createObjectURL(blob); // 创建一个Blob URL

		// 创建一个链接并触发下载
		const a = document.createElement('a');
		a.href = url;
		a.download = 'gpt-records.md'; // 指定下载文件名
		document.body.appendChild(a);
		a.click(); // 触发下载
		a.remove(); // 移除链接
		window.URL.revokeObjectURL(url); // 释放创建的Blob URL

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