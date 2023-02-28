const { logMessage } = require('../commands');
const { fromDataFrame, decodePayload, updateClientLogs } = require('../util');

// TODO: create constants for opcodes, names should indicate meaning

let temp = [];

module.exports = (socket, sockets) => {
	return () => {
		const checkIfBufferNull = socket.read();

		if (checkIfBufferNull) {
			const { data } = checkIfBufferNull.toJSON();
			temp.push(...data);

			const { opcode, MASK, payloadLength, maskingKey, payload } = fromDataFrame(temp);

			if (payload.length === payloadLength) {
				temp = [];

				const message = decodePayload(Boolean(MASK), maskingKey, payload);

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
		}
	};
};
