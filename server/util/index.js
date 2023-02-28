module.exports = {
	// constants
	magicWebSocketKey: require('./constants/magic-websocket-key'),
	mainDir: require('./constants/main-dir'),
	mimeDict: require('./constants/mime-dict'),
	opcodeDict: require('./constants/opcode-dict'),
	// functions
	toByte: require('./functions/to-byte'),
	toDecimal: require('./functions/to-decimal'),
	updateClientLogs: require('./functions/update-client-logs'),
	fromDataFrame: require('./functions/from-data-frame'),
	toDataFrame: require('./functions/to-data-frame'),
	decodePayload: require('./functions/decode-payload'),
	updateClientConnected: require('./functions/update-client-connected'),
};
