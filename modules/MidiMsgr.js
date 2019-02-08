const { Transform } = require('stream');
const FastPriorityQueue = require("fastpriorityqueue");

const {
	noteOn,
	noteOff,
	clock,
	ctrl,
	nrpn
} = require('@giantleap/utils/Msgr');

class MidiMsgr extends Transform {

	constructor() {
		super({objectMode:true});
		this.pq = new FastPriorityQueue( (a, b) => a.t < b.t );
	}

	_transform(msg, _enc, next) {

		while(!this.pq.isEmpty() && this.pq.peek().t < msg.t) {
			this.push(this.pq.poll());
		}

		switch(msg.msg) {
			case 'note':
				this.push({
					device: msg.device,
					t:msg.t,
					msg:noteOn(msg.channel, msg.key || 'C2', msg.velocity || 100)
				});
				this.pq.add({
					device: msg.device,
					t:msg.tEnd,
					msg:noteOff(msg.channel, msg.key || 'C2', msg.velocity || 100)
				});
				break;
			case 'clock':
				this.push({
					device: msg.device,
					t: msg.t,
					msg:clock()
				});
				break;
			case 'nrpn':
				const midiMsgs = nrpn(msg.channel, msg.nm, msg.nl, msg.value, msg.dl);
				for(const midiMsg of midiMsgs) {
					this.push({
						device: msg.device,
						t: msg.t,
						msg:midiMsg
					});
				}
				break;
			case 'ctrl':
				this.push({
					device: msg.device,
					t: msg.t,
					msg:ctrl(msg.channel, msg.ctrl, msg.value)
				});
				break;
			default:
				// do stuff one day
		}
		next();
	}
}

module.exports = MidiMsgr;