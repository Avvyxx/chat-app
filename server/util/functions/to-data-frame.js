const { Buffer } = require('node:buffer');

const toDecimal = require('./to-decimal');

module.exports = (FIN = '1', RSV1 = '0', RSV2 = '0', RSV3 = '0', opcode = '1', MASK = '0', message) => {
	const metaData = FIN + RSV1 + RSV2 + RSV3 + opcode.padStart(4, '0');

	const { length } = message;

	let lengthIndicator;
	let payloadLength;

	if (length <= 125) {
		lengthIndicator = length.toString(2).padStart(7, '0');
	} else if (length <= 65_535) {
		lengthIndicator = '1111110';
		payloadLength = length
			.toString(2)
			.padStart(16, '0')
			.match(/.{1,8}/g)
			.map(toDecimal);
	} else if (length <= 9_223_372_036_854_775_807) {
		lengthIndicator = '1111111';
		payloadLength = length
			.toString(2)
			.padStart(64, '0')
			.match(/.{1,8}/g)
			.map(toDecimal);
	}

	const payloadInfo = MASK + lengthIndicator;

	const messageInBytes = message.split('').map((char) => char.charCodeAt(0));

	if (payloadLength) {
		return Buffer.from([toDecimal(metaData), toDecimal(payloadInfo), ...payloadLength, ...messageInBytes]);
	}
	return Buffer.from([toDecimal(metaData), toDecimal(payloadInfo), ...messageInBytes]);
};
