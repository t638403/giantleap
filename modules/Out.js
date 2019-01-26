const { Transform } = require('stream');

const Stitch      = require('@giantleap/Stitch'),
	MidiMsgr    = require('@giantleap/MidiMsgr'),
	MidiOut     = require('@giantleap/MidiOut'),
	TimeSort    = require('@giantleap/TimeSort')
;

class Out extends Stitch {

	constructor() {
		super();
		if(Out.instance){
			return Out.instance;
		}

		Out.instance = this;
		this
			.pipe(new MidiMsgr())
			.pipe(new TimeSort())
			.pipe(new MidiOut())
	}

}

Out.instance = null;


module.exports = Out;