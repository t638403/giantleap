const { Writable } = require('stream');
const midi         = require('midi');
const invert       = require('@giantleap/utils/underdash/invert');
const Msgr         = require('@giantleap/utils/Msgr');

/**
 * The main purpose of the final part of the message stream is to measure time and send the message when the time is
 * there. Furthermore it keeps track of the available and used midi devices and opens the device if it was not ready
 * for receiving messages yet.
 */
class MidiOut extends Writable {

	constructor() {
		super({objectMode:true});

		MidiOut.displayAvailablePorts();
		this.ports = invert(MidiOut.availablePorts());

		// This will be filled when msgs come along in _transform
		this.outs = [];

		this.curr = null;
		this.i = null;
	}

	play() {

		const startTime = process.hrtime.bigint();

		return setInterval(() => {

			const now = process.hrtime.bigint() - startTime;

			if(this.curr && this.curr.t <= now) {

				const diff = now - this.curr.t;
				const logMsg = `${now / 1000000000n}: ${this.curr.t} Diff: ${Math.round(Number(diff / 10000000n)) / 100}, Msg: ${this.curr.msg}`;
				// Check if port is available, e.g. physical instrument is switched on
				if (this.curr.device in this.ports) {
					this.outs[this.curr.device].sendMessage(this.curr.msg);
				}

				this.curr.next();

			}

		}, 0);
	}

	_write(msg, _enc, next) {

		if(!this.i) this.i = this.play();

		// Check if midi device was available, and if not make it available
		if(!this.outs[msg.device] && msg.device in this.ports) {
			this.outs[msg.device] = new midi.output();
			this.outs[msg.device].openPort(msg.device);

			for(let channel=1; channel <=16; channel++) {
				// console.log(`All notes of: ${msg.device}/${channel}`);
				this.outs[msg.device].sendMessage(Msgr.allNotesOff(channel));
			}

		}

		// This message will be picked up by the setInterval callback. The next function is attached to the message so
		// the interval callback can inform the stream when it is ready to receive new messages.
		msg.next = next;
		this.curr = msg;

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
