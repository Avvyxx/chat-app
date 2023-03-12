let webSocket;

onmessage = (e) => {
	switch (e.data.webSocketWorkerObjective) {
		case 'initiate websocket':
			webSocket = new WebSocket('wss://avyx.dev');

			webSocket.onopen = () => {
				console.log('WebSocket connection to chat server established.');
				postMessage({
					objective: 'update connection state',
					content: true,
				});
			};

			webSocket.onerror = () => {
				console.log('error');
			};

			webSocket.onclose = (e) => {
				debugger;
				console.log('WebSocket connection to chat server terminated.');
				postMessage({
					objective: 'update connection state',
					content: false,
				});
			};

			webSocket.onmessage = (e) => {
				postMessage(JSON.parse(e.data));
			};
			break;
		case 'terminate websocket':
			if (webSocket instanceof WebSocket) {
				webSocket.close();
			} else {
				throw new Error("WebSocket hasn't been initiated.");
			}
			break;
		case 'communicate to server':
			delete e.data.webSocketWorkerObjective;

			webSocket.send(JSON.stringify(e.data));
			break;
	}
};
