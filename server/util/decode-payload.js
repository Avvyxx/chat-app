module.exports = (isMasked, maskingKey, data) => {
	if (isMasked) {
		const decodedMsg = Uint8Array.from(data, (elt, i) => elt ^ maskingKey[i % 4]);
		return String.fromCharCode(...decodedMsg);
	} else {
		return data;
	}
};
