let webSocket;

onmessage = (e) => {
	switch (e.data.objective) {
		case 'initiate websocket':
			webSocket = new WebSocket('ws://localhost:3000');

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
				const { objective, content } = JSON.parse(e.data);
				postMessage({
					objective,
					content,
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
			webSocket.send(e.data.content);
			break;
	}
};
