const pick = (unpicked, keys = []) => keys.reduce((picked, k, i) => {
	picked[k] = unpicked[k];
	return picked;
}, {});

module.exports = pick;