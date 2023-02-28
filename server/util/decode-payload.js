module.exports = (isMasked, maskingKey, data) => {
	if (isMasked) {
		let str = '';
		const decodedMsg = Uint8Array.from(data, (elt, i) => elt ^ maskingKey[i % 4]);

		decodedMsg.forEach((charCode) => {
			str += String.fromCharCode(charCode);
		});

		return str;
	} else {
		return data;
	}
};
