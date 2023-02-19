const fs = require('node:fs');

const fromDataFrame = require('./from-data-frame');
const toDataFrame = require('./to-data-frame');
const { logMessage, mainDir, clearLog } = require('../../util');

module.exports = (socket, sockets) => {
	const { opcode, MASK, maskingKey, encodedPayload } = fromDataFrame(socket);

	if (opcode === 1) {
		// TODO: is there a way to condense this V
		if (Boolean(MASK)) {
			const decodedMsg = Uint8Array.from(encodedPayload, (elt, i) => elt ^ maskingKey[i % 4]);
			const readableMsg = String.fromCharCode(...decodedMsg);

			if (readableMsg === 'clear message log') {
				clearLog();
			} else {
				logMessage(readableMsg);
			}
		} else {
			if (encodedPayload === 'clear message log') {
				clearLog();
			} else {
				logMessage(encodedPayload);
			}
		}

		const updatedLog = fs.readFileSync(`${mainDir}\\server\\message-log.json`, { encoding: 'utf-8' });
		const updatedLogFrame = toDataFrame('1', '0', '0', '0', '1', '0', updatedLog);
		sockets.forEach((a) => a.write(updatedLogFrame));
	} else if (opcode === 8) {
		socket.destroy();
	}
};
