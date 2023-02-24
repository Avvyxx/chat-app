const crypto = require('node:crypto');

const magicWebSocketKey = require('./magic-websocket-key');

module.exports = (reqKey) => {
	const responseWebSocketKeyHash = crypto.createHash('sha1');
	responseWebSocketKeyHash.update(reqKey + magicWebSocketKey);
	return responseWebSocketKeyHash.digest('base64');
};
