const invert = (o) => Object.keys(o).reduce((inverted, key) => {
	const v = o[key];
	inverted[v] = key;
	return inverted;
}, {});

module.exports = invert;