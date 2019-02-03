const { Transform } = require('stream');

const max = (a, b) => a > b ? a : b;
const min = (a, b) => a < b ? a : b;

const nextActiveStreamIndex = (msgs) => {
	let leastIndex = 0;
	let least = Infinity;
	for (let i = 0; i < msgs.length; i++) {
		least = min(least, msgs[i].t);
		if(least === msgs[i].t) {
			leastIndex = i;
		}
	}
	return leastIndex;
};

class Stitch extends Transform {
	constructor() {
		super({objectMode:true});
		this.activeStreamIndex = 0;
		this.streams = [];
		this.msgs = [];

		this.on('pipe', src => {
			if(this.streams.length > 0) {
				src.pause();
			}
			this.streams.push(src);
		});

	}

	_transform(msg, _enc, next) {

		if(this.msgs.length < this.streams.length) {

			this.msgs.push(msg);
			this.streams[this.activeStreamIndex].pause();

			this.activeStreamIndex++;
			if (this.streams[this.activeStreamIndex]) {
				this.streams[this.activeStreamIndex].resume();
			} else {
				this.activeStreamIndex = nextActiveStreamIndex(this.msgs);
				this.streams[this.activeStreamIndex].resume();
				this.push(this.msgs[this.activeStreamIndex]);
			}

		} else {

			this.msgs[this.activeStreamIndex] = msg;
			this.streams[this.activeStreamIndex].pause();
			this.activeStreamIndex = nextActiveStreamIndex(this.msgs);
			this.push(this.msgs[this.activeStreamIndex]);
			this.streams[this.activeStreamIndex].resume();

		}
		next();
	}

	// _final(done) {
	//
	// 	done();
	// }
}

module.exports = Stitch;