const { Transform } = require('stream');

class Stitch extends Transform {
	constructor() {
		super();
		this.activeStreamIndex = 0;
		this.streams = [];

		this.on('pipe', src => {
			if(this.streams.length > 0) {
				src.pause();
			}
			this.streams.push(src);
		});

	}

	_transform(data, _enc, next) {

		this.streams[this.activeStreamIndex].pause();
		this.activeStreamIndex++;
		if(this.activeStreamIndex === this.streams.length) {
			this.activeStreamIndex = 0;
		}
		this.streams[this.activeStreamIndex].resume();

		this.push(data);
		next();
	}
}

module.exports = Stitch;