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
				console.log('message received')
				postMessage({
					objective: 'update message log',
					content: e.data
				})
			}
			break;
		case 'terminate websocket':
			if (webSocket instanceof WebSocket) {
				webSocket.close();
			} else {
				throw new Error("WebSocket hasn't been initiated.");
			}
			break;
		case 'clear message log':
			webSocket.send('clear message log')
			break;
		case 'send message':
			webSocket.send(e.data.content)
			break;
	}
};
