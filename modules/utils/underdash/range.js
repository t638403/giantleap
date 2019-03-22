const range = (start, end, step=1) => {
	end = end || start;
	start = end === start ? 0 : start;
	const a = [];
	for(start; start < end ; start = start + step) {
		a.push(start);
	}
	return a;
};

module.exports = range;