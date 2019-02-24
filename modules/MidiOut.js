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

		// These will be filled when msgs come along in _transform
		this.outs = [];
		this.ins = [];
		this.inValues = {};

		this.curr = null;
		this.i = null;
	}

	play() {

		const startTime = process.hrtime.bigint();

		return setInterval(() => {

			const now = process.hrtime.bigint() - startTime;

			if(this.curr && this.curr.t <= now) {

				if(this.curr.input) {
					this.curr.msg[2] = this.inValues[this.inKey(this.curr.input.type, this.curr.input.device, this.curr.input.channel, this.curr.input.nr)];
				}

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

	inKey(type, deviceNo, channelNo, ctrlNo) {
		return `${type}:${deviceNo}:${channelNo}:${ctrlNo}`;
	}

	_write(outMsg, _enc, next) {

		if(!this.i) this.i = this.play();

		// Check if midi device was available, and if not make it available
		if(!this.outs[outMsg.device] && outMsg.device in this.ports) {
			this.outs[outMsg.device] = new midi.output();
			this.outs[outMsg.device].openPort(outMsg.device);

			console.log(`All notes of...`);
			for(let channel=1; channel <=16; channel++) {
				this.outs[outMsg.device].sendMessage(Msgr.allNotesOff(channel));
			}

		}
		// Check if midi device was available, and if not make it available
		if(outMsg.input && !this.ins[outMsg.input.device]) {
			this.ins[outMsg.input.device] = new midi.input();
			this.ins[outMsg.input.device].openPort(outMsg.input.device);
			this.inValues[this.inKey(outMsg.input.type, outMsg.input.device, outMsg.input.channel, outMsg.input.nr)] = 64;
			this.ins[outMsg.input.device].on('message', (_d, inMsg) => {
				const { type, channel, ctrl, value } = Msgr.parse(inMsg);
				this.inValues[this.inKey(type, outMsg.input.device, channel, ctrl)] = value;
			});
		}

		// This message will be picked up by the setInterval callback. The next function is attached to the message so
		// the interval callback can inform the stream when it is ready to receive new messages.
		outMsg.next = next;
		this.curr = outMsg;

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
