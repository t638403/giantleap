const { Transform } = require('stream');
const FastPriorityQueue = require("fastpriorityqueue");

class TimeSort extends Transform {

	constructor() {
		super({objectMode:true});
		this.q = new FastPriorityQueue( (a, b) => a.t < b.t );
	}

	_transform(msg, _enc, next) {
		this.q.add(msg);
		if(this.q.size > 500) {
			this.push(this.q.poll());
		}
		next();
	}

	_final(done) {
		while(this.q.size > 0) {
			this.push(this.q.poll())
		}
		done();
	}

}

module.exports = TimeSort;
