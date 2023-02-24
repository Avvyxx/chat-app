let webSocket;

onmessage = (e) => {
	switch (e.data.objective) {
		case 'initiate websocket':
			webSocket = new WebSocket('wss://avyx.dev');

			webSocket.onopen = () => {
				console.log('WebSocket connection to chat server established.');
				postMessage({
					objective: 'update connection state',
					content: true,
				});
			};

			webSocket.onclose = () => {
				console.log('WebSocket connection to chat server terminated.');
				postMessage({
					objective: 'update connection state',
					content: false,
				});
			};

			webSocket.onmessage = (e) => {
				console.log('message received');
				postMessage({
					objective: 'update message log',
					content: e.data,
				});
			};
			break;
		case 'terminate websocket':
			if (webSocket instanceof WebSocket) {
				webSocket.close();
			} else {
				throw new Error("WebSocket hasn't been initiated.");
			}
			break;
		case 'run command':
			webSocket.send(
				JSON.stringify({
					objective: 'run command',
					content: e.data.content,
				})
			);
			break;
		case 'log message':
			webSocket.send(
				JSON.stringify({
					objective: 'log message',
					content: e.data.content,
				})
			);
			break;
	}
};
