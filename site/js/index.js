const webSocketWorker = new Worker('js/workers/websocket.js');

const textMessageInput = document.getElementById('text-message');
const fileMessageInput = document.getElementById('file-message');
const sendFileMessageButton = document.getElementById('send-file-message');
const initiateButton = document.getElementById('initiate');
const terminateButton = document.getElementById('terminate');
const clearLogButton = document.getElementById('clear-log');
const connectionStatusImg = document.getElementById('connection-status');
const messageLog = document.getElementById('message-log');
const curConnectedCount = document.getElementById('cur-connected-count');
const favicon = document.getElementById('favicon');

webSocketWorker.onmessage = (e) => {
	switch (e.data.objective) {
		case 'update connection state':
			if (e.data.content) {
				initiateButton.disabled = true;
				terminateButton.removeAttribute('disabled');
				textMessageInput.removeAttribute('disabled');
				fileMessageInput.removeAttribute('disabled');
				sendFileMessageButton.removeAttribute('disabled');
				connectionStatusImg.src = 'img/green-dot.png';
				favicon.href = 'img/green-dot.png';
			} else {
				initiateButton.removeAttribute('disabled');
				terminateButton.disabled = true;
				textMessageInput.disabled = true;
				fileMessageInput.disabled = true;
				sendFileMessageButton.disabled = true;
				connectionStatusImg.src = 'img/red-dot.png';
				favicon.href = 'img/red-dot.png';
				messageLog.innerHTML = '';
				curConnectedCount.innerHTML = 'N/A';
			}
			break;
		case 'update client logs':
			messageLog.innerHTML = '';
			const messageArr = JSON.parse(e.data.content);
			messageArr.forEach(({ type, message }) => {
				let eleToAppend;
				if (type === 'text') {
					eleToAppend = document.createElement('p');
					const textNode = document.createTextNode(message);

					eleToAppend.appendChild(textNode);
					eleToAppend.classList.add('text_message');

					messageLog.appendChild(eleToAppend);
				} else if (type === 'file') {
					eleToAppend = document.createElement('img');

					eleToAppend.classList.add('image_message');

					eleToAppend.src = 'data:image/png;charset=utf-8;base64,' + message;
				}

				messageLog.append(eleToAppend);
			});
			messageLog.scrollTo(0, messageLog.scrollHeight);
			break;
		case 'update client connected':
			curConnectedCount.innerHTML = e.data.content.toString();
			break;
	}
};

let curMessage = '';

textMessageInput.oninput = (e) => {
	curMessage = e.target.value;
	textMessageInput.value = curMessage;
};

textMessageInput.onkeydown = (e) => {
	if (e.key.toLowerCase() === 'enter') {
		webSocketWorker.postMessage({
			objective: 'log message',
			type: 'text',
			content: textMessageInput.value,
		});
		curMessage = '';
		textMessageInput.value = '';
	}
};

sendFileMessageButton.onclick = () => {
	const fileToSend = new FileReader();
	fileToSend.onloadend = (e) => {
		webSocketWorker.postMessage({
			objective: 'log message',
			type: 'file',
			content: e.target.result,
		});
	};
	fileToSend.readAsArrayBuffer(fileMessageInput.files[0]);
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
