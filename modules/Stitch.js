const { Readable, Transform } = require('stream');

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

/**
 * This stream handler stitches together all the read/transform streams that are generating messages. It basically
 * peeks at all values that all streams are willing to send and it sends the one with the lowest time stamp. This way
 * it is guaranteed the messages this stream sends out are sequentially in order with respect to time.
 *
 * One drawback of this implementation is that when a read stream might be slow, it will return false and the process
 * will crash because it is not able to determine the message with the lowest time stamp since `false` has not property
 * t. I suspect this will never occur though, since the write stream is definitely slower.
 */
class Stitch extends Transform {
	constructor(streams) {
		super({objectMode:true});
		this.streams = streams;
		this.msgs = [];
		for(const i in this.streams) {
			this.streams[i].pipe(this);
			this.streams[i].pause();
			this.streams[i].isReady = () => new Promise(resolve => this.streams[i].on('readable', resolve));
		}
		this.activeStreamIndex = null;
		this._allStreamsReady = false;
		this.allStreamsReady().then(() => {
			for (const stream of this.streams) {
				this.msgs.push(stream.read());
			}
			this.activeStreamIndex = nextActiveStreamIndex(this.msgs);
		})
	}

	allStreamsReady() {
		return this._allStreamsReady || Promise
			.all(this.streams.map(s => s.isReady()))
			.then(() => this._allStreamsReady = true)
			.then(() => true)
		;
	}

	_transform(_, _enc, next) {
		Promise.resolve(this.allStreamsReady())
			.then(() => {
				this.push(this.msgs[this.activeStreamIndex]);
				this.msgs[this.activeStreamIndex] = this.streams[this.activeStreamIndex].read();
				this.activeStreamIndex = nextActiveStreamIndex(this.msgs);
				next();
			});
	}
}

module.exports = Stitch;