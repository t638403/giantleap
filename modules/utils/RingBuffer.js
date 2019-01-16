module.exports = RingBuffer;

function *RingBuffer(a) {
	let index = 0;
	while (true) {
		if(index === a.length) {
			index = 0;
		}
		yield a[index];
		index++;
	}
}
