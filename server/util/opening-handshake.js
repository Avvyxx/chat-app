const createAcceptKey = require('./create-accept-key');
const createResponseHeaders = require('./create-response-headers');

module.exports = (req, socket) => {
	const acceptKey = createAcceptKey(req.headers['sec-websocket-key']);
	const headers = createResponseHeaders(acceptKey);

	socket.write(headers, () => {
		console.log('Connection established.');
	});
};
