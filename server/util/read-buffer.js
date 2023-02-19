module.exports = (buffer) => {
	return (JSON.parse(JSON.stringify(buffer)) || {}).data;
};