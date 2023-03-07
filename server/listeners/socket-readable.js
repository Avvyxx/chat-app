const { logMessage, interpretMessage } = require('../commands');
const { fromDataFrame, toDataFrame, updateClientLogs, opcodeDict } = require('../util');

// TODO: client rate limiting

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

				let message = '';
				let payloadVar = payload;
				if (Boolean(MASK)) {
					payloadVar = Uint8Array.from(payload, (elt, i) => elt ^ maskingKey[i % 4]);
				}
				payloadVar.forEach((charCode) => {
					message += String.fromCharCode(charCode);
				});

				const { TEXT_FRAME, BINARY_FRAME, CONNECTION_CLOSE, PING } = opcodeDict;
				switch (opcode) {
					case TEXT_FRAME:
						interpretMessage('text', message);

						sockets.forEach(updateClientLogs);
						break;
					case BINARY_FRAME:
						const base64Encoding = Buffer.from(message, 'binary').toString('base64');
						logMessage('file', base64Encoding);

						sockets.forEach(updateClientLogs);
						break;
					case CONNECTION_CLOSE:
						socket.destroy();
						break;
					case PING:
						const pongFrame = toDataFrame('1', '0', '0', '0', '1010', '0', 'pong frame');
						socket.write(pongFrame);
						break;
					default:
						break;
				}
			}
		}
	};
};
