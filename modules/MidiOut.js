const { Writable } = require('stream');
const midi         = require('midi');
const invert       = require('@giantleap/utils/underdash/invert');

class MidiOut extends Writable {

	constructor() {
		super({objectMode:true});

		MidiOut.displayAvailablePorts();
		this.ports = invert(MidiOut.availablePorts());

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
				const diff = now - this.curr.t;
				const logMsg = `${now / 1000000000n}: ${this.curr.t} Diff: ${Math.round(Number(diff / 10000000n)) / 100}, Msg: ${this.curr.msg}`;
				// Check if port is available, e.g. physical instrument is switched on
				if(this.curr.device in this.ports) {
					this.outs[this.curr.device].sendMessage(this.curr.msg);
				}
				this.curr.next();
				this.curr = this.q.pop();
			}

		}, 0);
	}

	_write(msg, _enc, next) {
		if(!this.outs[msg.device] && msg.device in this.ports) {
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

	static availablePorts() {
		const ports = {};
		const tempOut = new midi.output();
		const portCount = tempOut.getPortCount();
		for(let i=0; i < portCount; i++) {
			ports[tempOut.getPortName(i)] = i;
		}
		tempOut.closePort();
		return ports;
	}

	static displayAvailablePorts() {
		const ports = MidiOut.availablePorts();
		for(const portName in ports) {
			const port = ports[portName];
			console.log(`${port}: ${portName}`);
		}
	}

}

module.exports = MidiOut;
