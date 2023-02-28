const toByte = require('./to-byte');
const toDecimal = require('./to-decimal');

const calcPayloadLength = (dataFrame, lenInd) => {
	if (lenInd <= 125) {
		return lenInd;
	} else if (lenInd === 126) {
		return toDecimal(dataFrame.splice(0, 2).map(toByte).join(''));
	} else if (lenInd === 127) {
		return toDecimal(dataFrame.splice(0, 8).map(toByte).join(''));
	}
};

module.exports = (dataFrame) => {
	const dataFrameCopy = [...dataFrame];

	const [metaData, payloadInfo] = dataFrameCopy.splice(0, 2).map(toByte);

	// TODO: is this repeated function call necessary
	const FIN = toDecimal(metaData[0]);
	const RSV1 = toDecimal(metaData[1]);
	const RSV2 = toDecimal(metaData[2]);
	const RSV3 = toDecimal(metaData[3]);
	const opcode = toDecimal(metaData.slice(4));

	const MASK = toDecimal(payloadInfo[0]);
	const payloadLengthInd = toDecimal(payloadInfo.slice(1));

	const payloadLength = calcPayloadLength(dataFrameCopy, payloadLengthInd);

	const maskingKey = Boolean(MASK) ? dataFrameCopy.splice(0, 4) : undefined;

	const payload = [...dataFrameCopy];

	return {
		FIN,
		RSV1,
		RSV2,
		RSV3,
		opcode,
		MASK,
		payloadLength,
		maskingKey,
		payload,
	};
};
