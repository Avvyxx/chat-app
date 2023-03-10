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
const curSetUsername = document.getElementById('cur-username');
const messageColorInput = document.getElementById('message-color');
const messageColorSetButton = document.getElementById('set-message-color');
const curSetMessageColor = document.getElementById('cur-message-color');
const resetValuesButton = document.getElementById('reset-user-values');

[...document.getElementsByTagName('input')].forEach((ele) => {
	ele.value = '';
});

// prettier-ignore
const eleArr = [
    terminateButton,
    textMessageInput,
    fileMessageInput,
    sendFileMessageButton,
    usernameInput,
    usernameSetButton,
    messageColorInput,
    messageColorSetButton
];

webSocketWorker.onmessage = (e) => {
	switch (e.data.objective) {
		case 'update connection state':
			if (e.data.content) {
				initiateButton.disabled = true;
				eleArr.forEach((ele) => {
					ele.removeAttribute('disabled');
				});
				curSetUsername.innerHTML = 'anon';
				curSetMessageColor.innerHTML = '#000000';
				connectionStatusImg.src = 'img/green-dot.png';
				favicon.href = 'img/green-dot.png';
			} else {
				initiateButton.removeAttribute('disabled');
				eleArr.forEach((ele) => {
					ele.disabled = true;
				});
				connectionStatusImg.src = 'img/red-dot.png';
				favicon.href = 'img/red-dot.png';
				messageLog.innerHTML = '';
				curSetUsername.innerHTML = 'N/A';
				curConnectedCount.innerHTML = 'N/A';
				curSetMessageColor.innerHTML = 'N/A';
			}
			break;
		case 'update client logs':
			messageLog.innerHTML = '';

			const messageArr = JSON.parse(e.data.content);

			messageArr.forEach(({ username, type, color, message }) => {
				// TODO: styles should be set in css
				const messageEle = document.createElement('div');
				messageEle.style.display = 'flex';
				messageEle.style.gap = '10px';

				const usernameEle = document.createElement('p');
				usernameEle.appendChild(document.createTextNode(username + ':'));

				let messageContent;
				if (type === 'text') {
					messageContent = document.createElement('p');
					const textNode = document.createTextNode(message);

					messageContent.appendChild(textNode);

					messageContent.style.color = color;

					messageContent.classList.add('text_message');
					messageLog.appendChild(messageContent);
				} else if (type === 'file') {
					messageContent = document.createElement('img');

					messageContent.classList.add('image_message');

					messageContent.src = 'data:image/png;charset=utf-8;base64,' + message;
				}

				messageEle.appendChild(usernameEle);
				messageEle.appendChild(messageContent);

				messageLog.append(messageEle);
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
	curSetUsername.innerHTML = curUsername.length === 0 ? 'anon' : curUsername;
	webSocketWorker.postMessage({
		webSocketWorkerObjective: 'communicate to server',
		objective: 'update username',
		content: curUsername.length === 0 ? 'anon' : curUsername,
	});
};

let curColor = '';

messageColorInput.onchange = (e) => {
	curColor = e.target.value;
};

messageColorSetButton.onclick = () => {
	curSetMessageColor.innerHTML = curColor.length === 0 ? '#000000' : curColor;
	webSocketWorker.postMessage({
		webSocketWorkerObjective: 'communicate to server',
		objective: 'update message color',
		content: curColor.length === 0 ? '#000000' : curColor,
	});
};

resetValuesButton.onclick = () => {
	curSetUsername.innerHTML = 'anon';
	curSetMessageColor.innerHTML = '#000000';
	usernameInput.value = '';
	messageColorInput.value = '#000000';
	webSocketWorker.postMessage({
		webSocketWorkerObjective: 'communicate to server',
		objective: 'update username',
		content: 'anon',
	});
	webSocketWorker.postMessage({
		webSocketWorkerObjective: 'communicate to server',
		objective: 'update message color',
		content: '#000000',
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
		content: 'clear session log',
	});
};
