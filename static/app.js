document.addEventListener("DOMContentLoaded", () => {
	const chatForm = document.getElementById("chat-form");
	const messageInput = document.getElementById("message-input");
	const messages = document.getElementById("messages");

	// Function to append message to chat window
	function addMessage(content, sender = "You") {
		const messageDiv = document.createElement("div");
		messageDiv.classList.add("message");
		messageDiv.innerText = `${sender}: ${content}`;
		messages.appendChild(messageDiv);
		messages.scrollTop = messages.scrollHeight;
	}

	// Function to send message to the server
	async function sendMessageToServer(message) {
		try {
			const response = await fetch('/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message }),
			});

			if (!response.ok) {
				throw new Error('Failed to send message');
			}

			const data = await response.json();
			addMessage(data.response, "Bot");
		} catch (error) {
			console.error('Error:', error);
			addMessage("Error: Unable to get a response from the server.", "Bot");
		}
	}

	// Event listener for form submission
	chatForm.addEventListener("submit", (e) => {
		e.preventDefault();
		const messageText = messageInput.value.trim();
		if (messageText) {
			addMessage(messageText);
			messageInput.value = "";
			sendMessageToServer(messageText);
		}
	});
});
