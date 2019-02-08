const { Transform } = require('stream');
const NaivePriorityQueue = require("@giantleap/utils/NaivePriorityQueue");

const {
	noteOn,
	noteOff,
	clock,
	ctrl,
	nrpn
} = require('@giantleap/utils/Msgr');

/**
 * Reduce all messages into a minimal format that is necessary for being able to send the midi message to the right
 * device at the right time.
 */
class MidiMsgr extends Transform {

	constructor() {
		super({objectMode:true});
		this.pq = new NaivePriorityQueue( (a, b) => a.t < b.t );
	}

	_transform(msg, _enc, next) {

		/*
		 * The `note` message is special one because it contains the start time and the end time of the note. This
		 * message needs to be split into a note on and a note off message, since this is the way MIDI works. However,
		 * the final stream handler, being `MidiOut`, counts on the messages delivered in sequence. We need to buffer
		 * those note off messages and send them when the time is there, hence the while loop. The while loop constantly
		 * checks if the received message is older than any of the messages on the buffer. If so, it sends those and
		 * finally sends the actual message that was received.
		 */
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

				// Adding this node off message to the prio queue so it can be sent when the time is there.
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