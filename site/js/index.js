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
const usernameInput = document.getElementById('username');
const usernameSetButton = document.getElementById('set-username');

webSocketWorker.onmessage = (e) => {
	switch (e.data.objective) {
		case 'update connection state':
			if (e.data.content) {
				initiateButton.disabled = true;
				[terminateButton, textMessageInput, fileMessageInput, sendFileMessageButton, usernameInput, usernameSetButton].forEach((ele) => {
					ele.removeAttribute('disabled');
				});
				connectionStatusImg.src = 'img/green-dot.png';
				favicon.href = 'img/green-dot.png';
			} else {
				initiateButton.removeAttribute('disabled');
				[terminateButton, textMessageInput, fileMessageInput, sendFileMessageButton, usernameInput, usernameSetButton].forEach((ele) => {
					ele.disabled = true;
				});
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

let curUsername = '';

usernameInput.oninput = (e) => {
	curUsername = e.target.value;
	usernameInput.value = curUsername;
};

usernameSetButton.onclick = () => {
	webSocketWorker.postMessage({
		webSocketWorkerObjective: 'communicate to server',
		objective: 'update username',
		content: curUsername,
	});
};

let curMessage = '';

textMessageInput.oninput = (e) => {
	curMessage = e.target.value;
	textMessageInput.value = curMessage;
};

textMessageInput.onkeydown = (e) => {
	if (e.key.toLowerCase() === 'enter') {
		webSocketWorker.postMessage({
			webSocketWorkerObjective: 'communicate to server',
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
		let binaryString = '';
		if (e.target.result instanceof ArrayBuffer) {
			new Uint8Array(e.target.result).map((charCode) => {
				binaryString += String.fromCharCode(charCode);
			});
		} else {
			binaryString = e.target.result;
		}
		webSocketWorker.postMessage({
			webSocketWorkerObjective: 'communicate to server',
			objective: 'log message',
			type: 'file',
			content: btoa(binaryString),
		});
	};
	fileToSend.readAsArrayBuffer(fileMessageInput.files[0]);
};

initiateButton.onclick = () => {
	webSocketWorker.postMessage({
		webSocketWorkerObjective: 'initiate websocket',
	});
};

terminateButton.onclick = () => {
	webSocketWorker.postMessage({
		webSocketWorkerObjective: 'terminate websocket',
	});
};

clearLogButton.onclick = () => {
	webSocketWorker.postMessage({
		webSocketWorkerObjective: 'communicate to server',
		objective: 'run command',
		content: 'clear message log',
	});
};
