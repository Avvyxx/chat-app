const webSocketWorker = new Worker('js/workers/websocket.js');

const messageInput = document.getElementById('message');
const initiateButton = document.getElementById('initiate');
const terminateButton = document.getElementById('terminate');
const clearLogButton = document.getElementById('clear-log');
const connectionStatusDot = document.getElementById('connection-status');
const messageLog = document.getElementById('message-log');

webSocketWorker.onmessage = (e) => {
	switch (e.data.objective) {
		case 'update connection state':
			if (e.data.content) {
				initiateButton.disabled = true;
				terminateButton.removeAttribute('disabled');
				messageInput.disabled = false;
				connectionStatusDot.style.backgroundColor = 'green';
			} else {
				initiateButton.removeAttribute('disabled');
				terminateButton.disabled = true;
				messageInput.disabled = true;
				connectionStatusDot.style.backgroundColor = 'red';
			}
			break;
		case 'update message log':
			messageLog.innerHTML = '';
			const messageArr = JSON.parse(e.data.content);
			messageArr.forEach(({ message }) => {
				const paragraphElement = document.createElement('p');
				const textNode = document.createTextNode(message);

				paragraphElement.appendChild(textNode);

				messageLog.appendChild(paragraphElement);
			});
			messageLog.scrollTo(0, messageLog.scrollHeight);
			break;
	}
};

let curMessage = '';

messageInput.oninput = (e) => {
	curMessage = e.target.value;
	messageInput.value = curMessage;
};

messageInput.onkeydown = (e) => {
	if (e.key.toLowerCase() === 'enter') {
		webSocketWorker.postMessage({
			objective: 'log message',
			content: messageInput.value,
		});
		curMessage = '';
		messageInput.value = '';
	}
};

initiateButton.onclick = () => {
	webSocketWorker.postMessage({
		objective: 'initiate websocket',
	});
};

terminateButton.onclick = () => {
	webSocketWorker.postMessage({
		objective: 'terminate websocket',
	});
};

clearLogButton.onclick = () => {
	webSocketWorker.postMessage({
		objective: 'run command',
		content: 'clear message log',
	});
};
