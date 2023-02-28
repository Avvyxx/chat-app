const { logMessage } = require('../commands');
const { fromDataFrame, decodePayload, updateClientLogs, opcodeDict } = require('../util');

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

				const { TEXT_FRAME, BINARY_FRAME, CONNECTION_CLOSE } = opcodeDict;
				switch (opcode) {
					case TEXT_FRAME:
						logMessage(opcode, message);

						sockets.forEach(updateClientLogs);
						break;
					case BINARY_FRAME:
						const base64Encoding = Buffer.from(message, 'binary').toString('base64');
						logMessage(opcode, base64Encoding);

						sockets.forEach(updateClientLogs);
						break;
					case CONNECTION_CLOSE:
						socket.destroy();
						break;
					default:
						break;
				}
			}
		}
	};
};
