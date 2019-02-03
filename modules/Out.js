const { Transform } = require('stream');

const Stitch      = require('@giantleap/Stitch'),
	MidiMsgr    = require('@giantleap/MidiMsgr'),
	MidiOut     = require('@giantleap/MidiOut'),
	TimeSort    = require('@giantleap/TimeSort'),
	Tap         = require('@giantleap/Tap'),
	Pick         = require('@giantleap/Pick'),
	Json        = require('@giantleap/JSON')
;

const sto = (ms) => new Transform({
	objectMode:true,
	transform(data, _enc, next) {
		setTimeout(() => {
			this.push(data);
			next();
		}, ms);
	}
});

class Out extends Stitch {

	constructor() {
		super();
		if(Out.instance){
			return Out.instance;
		}

		Out.instance = this;
		this
			.pipe(new MidiMsgr())
			// .pipe(new TimeSort())
			// .pipe(sto(100))
			// .pipe(new Pick(['t', 'msg']))
			// .pipe(Json.stringify)
			// .pipe(process.stdout)
			.pipe(new MidiOut())
		;
	}

}

Out.instance = null;


module.exports = Out;