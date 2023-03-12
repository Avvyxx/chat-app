const crypto = require('node:crypto');

const { magicWebSocketKey, updateClientLogs, updateClientConnected } = require('../util');

const socketReadable = require('./socket-readable');

let connectedSockets = [];

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

	connectedSockets.push(socket);

	updateClientLogs(socket);
	connectedSockets.forEach(updateClientConnected(connectedSockets.length));

	// TODO: ping client to keep connection alive or respond to ping from client
	socket.on('readable', socketReadable(socket, connectedSockets));
	socket.on('close', () => {
		console.log('Connection closed.');

		connectedSockets = connectedSockets.filter((socket) => socket.closed === false);

		connectedSockets.forEach(updateClientConnected(connectedSockets.length));
	});
	socket.on('connect', () => {
		console.log('connect event')
	})
	socket.on('error', () => {
		console.log('error event')
	})
	socket.on('drain', () => {
		console.log('drain event')
	})
	socket.on('ready', () => {
		console.log('ready event')
	})
};
