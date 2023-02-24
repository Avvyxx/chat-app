const { toByte, toDecimal } = require('../../util');

module.exports = (dataFrame) => {
	// reading first 2 bytes
	const [metaData, payloadInfo] = dataFrame.splice(0, 2).map(toByte);

	// first byte
	// TODO: is this repeated function call necessary
	const FIN = toDecimal(metaData[0]);
	const RSV1 = toDecimal(metaData[1]);
	const RSV2 = toDecimal(metaData[2]);
	const RSV3 = toDecimal(metaData[3]);
	const opcode = toDecimal(metaData.slice(4));

	//second byte
	const MASK = toDecimal(payloadInfo[0]);
	const lengthInfo = toDecimal(payloadInfo.slice(1));

	// conditional reading of payload length
	// TODO: condense this conditional statement
	const payloadLength =
		lengthInfo <= 125
			? lengthInfo
			: toDecimal(
					dataFrame
						.splice(0, lengthInfo === 126 ? 2 : 8)
						.map(toByte)
						.join('')
			  );

	// payload information
	// TODO: this null may cause issues later
	const maskingKey = Boolean(MASK) ? dataFrame.splice(0, 4) : null;
	const encodedPayload = dataFrame;

	// returning all relevant values
	return {
		FIN,
		RSV1,
		RSV2,
		RSV3,
		opcode,
		MASK,
		payloadLength,
		maskingKey,
		encodedPayload,
	};
};
