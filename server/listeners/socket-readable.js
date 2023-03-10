const { logMessage, clearLog } = require('../commands');
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

				let payloadVar = payload;
				if (Boolean(MASK)) {
					payloadVar = Uint8Array.from(payload, (elt, i) => elt ^ maskingKey[i % 4]);
				}

				let message = '';
				payloadVar.forEach((charCode) => {
					message += String.fromCharCode(charCode);
				});

				const { TEXT_FRAME, BINARY_FRAME, CONNECTION_CLOSE, PING } = opcodeDict;
				switch (opcode) {
					case TEXT_FRAME:
						const msgObj = JSON.parse(message);

						switch (msgObj.objective) {
							case 'run command':
								switch (msgObj.content) {
									case 'clear session log':
										clearLog();

										sockets.forEach(updateClientLogs)
										break;
								}
								break;
							case 'update username':
								socket.username = msgObj.content;
								break;
							case 'update message color':
								socket.messageColor = msgObj.content;
								break;
							case 'log message':
								logMessage(socket.username ? socket.username: 'anon', msgObj.type, socket.messageColor, msgObj.content);

								sockets.forEach(updateClientLogs);
								break;
						}
						break;
					case BINARY_FRAME:
						console.log(message);
						throw new Error('Frame is not supported.');
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
