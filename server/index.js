const https = require('node:https');

const { serverRequest, serverUpgrade, serverError } = require('./listeners');

const server = https.createServer();

server.listen(3000, () => {
	console.log('Server is running.');
});

server.on('request', serverRequest);
server.on('upgrade', serverUpgrade);
server.on('error', serverError);
