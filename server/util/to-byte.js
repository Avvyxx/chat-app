module.exports = (decimal) => {
	return decimal.toString(2).padStart(8, '0');
};