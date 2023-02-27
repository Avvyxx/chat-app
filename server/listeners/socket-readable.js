const { logMessage } = require('../commands');
const { fromDataFrame, decodePayload, updateClientLogs } = require('../util');

module.exports = (socket, sockets) => {
	return () => {
		const checkIfBufferNull = socket.read();

		if (checkIfBufferNull) {
			const { data } = checkIfBufferNull.toJSON();

			const { opcode, MASK, maskingKey, encodedPayload } = fromDataFrame(data);

			const message = decodePayload(Boolean(MASK), maskingKey, encodedPayload);

			switch (opcode) {
				case 1:
					logMessage(opcode, message);

					sockets.forEach(updateClientLogs);
					break;
				case 2:
					const base64Encoding = Buffer.from(message, 'binary').toString('base64');
					logMessage(opcode, base64Encoding);

					sockets.forEach(updateClientLogs);
					break;
				case 8:
					socket.destroy();
					break;
				default:
					break;
			}
		}
	};
};
