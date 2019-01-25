const { Writable } = require('stream');
const midi          = require('midi');
const PriorityQueue = require('@giantleap/utils/PriorityQueue');

class MidiOut extends Writable {

	constructor() {
		super({objectMode:true, highWaterMark:5000});

		MidiOut.displayAvailablePorts();

		// This will be filled when msgs come along in _transform
		this.outs = [];

		this.q = [];

		// The loop
		const startTime = process.hrtime.bigint();
		this.curr = null;
		this.i = setInterval(() => {

			if(!this.curr) {
				this.curr = this.q.pop();
			}

			const now = process.hrtime.bigint() - startTime;

			while (this.curr && this.curr.t <= now) {
				this.outs[this.curr.device].sendMessage(this.curr.msg);
				this.curr.next();
				this.curr = this.q.pop();
			}

		}, 0);
	}

	_write(msg, _enc, next) {
		if(!this.outs[msg.device]) {
			this.outs[msg.device] = new midi.output();
			this.outs[msg.device].openPort(msg.device);
		}

		msg.next = next;
		this.q.push(msg);

	}

	_final(done) {
		clearInterval(this.i);
		this.outs.filter(o => !!o).forEach(o => o.closePort());
		done();
	}

	static displayAvailablePorts() {
		const tempOut = new midi.output();
		const portCount = tempOut.getPortCount();
		for(let i=0; i < portCount; i++) {
			console.log(`${i}: ${tempOut.getPortName(i)}`);
		}
		tempOut.closePort();
	}

}

module.exports = MidiOut;
