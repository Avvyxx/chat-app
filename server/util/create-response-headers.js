module.exports = (resKey) => {
	return [
		'HTTP/1.1 101 Switching Protocols',
		'Upgrade: websocket',
		'Connection: Upgrade',
		`Sec-WebSocket-Accept: ${resKey}`,
		''
	].map((line) => line.concat('\r\n')).join('');
};
