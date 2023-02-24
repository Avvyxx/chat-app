const logMessage = require('../commands/log-message');
const { fromDataFrame, updateClientLogs } = require('../util');

let messageQueue = [];

module.exports = (socket, sockets) => {
	return () => {
		const data = JSON.parse(JSON.stringify(socket.read()) || {}).data;

		if (data !== null) {
			// TODO: this function directly edits data variable
			const { opcode, MASK, maskingKey, encodedPayload } = fromDataFrame(data);

			let message;
			if (Boolean(MASK)) {
				const decodedMsg = Uint8Array.from(encodedPayload, (elt, i) => elt ^ maskingKey[i % 4]);
				message = String.fromCharCode(...decodedMsg);
			} else {
				message = encodedPayload;
			}

			messageQueue.push(message);

			if (opcode === 1) {
				if (messageQueue.length === 2) {
					logMessage(messageQueue);

					sockets.forEach(updateClientLogs);

					messageQueue = [];
				}
			} else if (opcode === 2) {
				if (messageQueue.length === 2) {
					messageQueue[1] = Buffer.from(messageQueue[1]).toString('base64');
					logMessage(messageQueue);

					sockets.forEach(updateClientLogs);

					messageQueue = [];
				}
			} else if (opcode === 8) {
				socket.destroy();
			}
		}
	};
};
