const http = require('node:http');

const { serverRequest, serverUpgrade, serverError } = require('./listeners');

const server = http.createServer();

server.listen(3000, () => {
	console.log('Server is running.');
});

server.on('request', serverRequest);
server.on('upgrade', serverUpgrade);
server.on('error', serverError);
