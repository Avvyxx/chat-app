const { logMessage } = require('../commands');
const { fromDataFrame, decodePayload, updateClientLogs } = require('../util');

module.exports = (socket, sockets) => {
	return () => {
		const checkIfBufferNull = socket.read();

		if (checkIfBufferNull) {
			const { data } = checkIfBufferNull.toJSON();

			const { opcode, MASK, maskingKey, encodedPayload } = fromDataFrame(data);

			const message = decodePayload(Boolean(MASK), maskingKey, encodedPayload);

			if (opcode === 1) {
				logMessage(opcode, message);

				sockets.forEach(updateClientLogs);
			} else if (opcode === 2) {
				const base64Encoding = Buffer.from(message).toString('base64');
				logMessage(opcode, base64Encoding);

				sockets.forEach(updateClientLogs);
			} else if (opcode === 8) {
				socket.destroy();
			}
		}
	};
};
