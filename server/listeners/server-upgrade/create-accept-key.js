const crypto = require('node:crypto');

const { magicWebSocketKey } = require('../../util');

module.exports = (reqKey) => {
	const responseWebSocketKeyHash = crypto.createHash('sha1');
	responseWebSocketKeyHash.update(reqKey + magicWebSocketKey);
	return responseWebSocketKeyHash.digest('base64');
};
