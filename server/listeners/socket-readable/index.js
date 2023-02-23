const fs = require('node:fs');

const fromDataFrame = require('./from-data-frame');
const toDataFrame = require('./to-data-frame');
const interpretMessage = require('./interpret-message');
const { mainDir } = require('../../util');

module.exports = (socket, sockets) => {
	const { opcode, MASK, maskingKey, encodedPayload } = fromDataFrame(socket);

	if (opcode === 1) {
		let message;
		if (Boolean(MASK)) {
			const decodedMsg = Uint8Array.from(encodedPayload, (elt, i) => elt ^ maskingKey[i % 4]);
			message = String.fromCharCode(...decodedMsg);
		} else {
			message = encodedPayload;
		}

		interpretMessage(message);

		const updatedLog = fs.readFileSync(`${mainDir}/server/message-log.json`, { encoding: 'utf-8' });
		const updatedLogFrame = toDataFrame('1', '0', '0', '0', '1', '0', updatedLog);
		sockets.forEach((a) => a.write(updatedLogFrame));
	} else if (opcode === 8) {
		socket.destroy();
	}
};
