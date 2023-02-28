const socketReadable = require('./socket-readable');
const { updateClientLogs, updateClientConnected } = require('../util');
const crypto = require('node:crypto');
const magicWebSocketKey = require('../util/magic-websocket-key');

let sockets = [];

module.exports = (req, socket) => {
	console.log('Client requested upgrade.');

	const resWebSocketKeyHash = crypto.createHash('sha1');
	resWebSocketKeyHash.update(req.headers['sec-websocket-key'] + magicWebSocketKey);

	const headers = ['HTTP/1.1 101 Switching Protocols', 'Upgrade: websocket', 'Connection: Upgrade', `Sec-WebSocket-Accept: ${resWebSocketKeyHash.digest('base64')}`, '']
		.map((line) => line.concat('\r\n'))
		.join('');

	socket.write(headers, () => {
		console.log('Connection established.');
	});

	sockets.push(socket);

	updateClientLogs(socket);
	sockets.forEach(updateClientConnected(sockets.length));

	// TODO: ping client to keep connection alive or respond to ping from client
	socket.on('readable', socketReadable(socket, sockets));

	socket.on('close', () => {
		console.log('Connection closed.');

		sockets = sockets.filter((s) => s.closed === false);
		sockets.forEach(updateClientConnected(sockets.length));
	});
};
