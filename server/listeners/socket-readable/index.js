const logMessage = require('../../commands/log-message');
const { fromDataFrame, updateClientLogs } = require('../../util');

module.exports = (socket, sockets) => {
	const data = JSON.parse(JSON.stringify(socket.read()) || {}).data;

	if (data !== null) {
		const { opcode, MASK, maskingKey, encodedPayload } = fromDataFrame(data);

		let message;
		if (Boolean(MASK)) {
			const decodedMsg = Uint8Array.from(encodedPayload, (elt, i) => elt ^ maskingKey[i % 4]);
			message = String.fromCharCode(...decodedMsg);
		} else {
			message = encodedPayload;
		}

		if (opcode === 1) {
			logMessage(message);

			sockets.forEach(updateClientLogs);
		} else if (opcode === 2) {
			const base64Encoding = Buffer.from(message).toString('base64');
			logMessage(base64Encoding);

			sockets.forEach(updateClientLogs);
		} else if (opcode === 8) {
			socket.destroy();
		}
	}
};
