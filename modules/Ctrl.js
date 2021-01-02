const { Transform } = require('stream');

/**
 * m120()
 * 	.pipe(new Value(Value.randPat(bpm)))
 * 	.pipe(new Ctrl(21))
 * 	.pipe(doepfer())
 */
class Ctrl extends Transform {
	constructor(ctrlNr) {
		super({objectMode:true});
		this.ctrlNr = ctrlNr;
	}

	_transform(partialMidiMsg, _enc, next) {
		this.push(Object.assign({}, partialMidiMsg, {ctrl:this.ctrlNr, msg:'ctrl'}));
		next();
	}
}

module.exports = Ctrl;