const { Transform } = require('stream');

const max = (a, b) => a > b ? a : b;

class Stitch extends Transform {
	constructor() {
		super({objectMode:true});
		this.activeStreamIndex = 0;
		this.streams = [];
		this.maxT = 0;

		this.on('pipe', src => {
			if(this.streams.length > 0) {
				src.pause();
			}
			this.streams.push(src);
		});

	}

	_transform(msg, _enc, next) {

		this.maxT = max(this.maxT, msg.t);

		// console.log(`d:${msg.device}, ${msg.msg} - ${this.maxT}`);

		if(msg.t >= this.maxT) {
			this.streams[this.activeStreamIndex].pause();
			this.activeStreamIndex++;
			if(this.activeStreamIndex === this.streams.length) {
				this.activeStreamIndex = 0;
			}
			this.streams[this.activeStreamIndex].resume();
		}

		this.push(msg);
		next();
	}
}

module.exports = Stitch;