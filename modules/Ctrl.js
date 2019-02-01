const { Transform } = require('stream');

class Ctrl extends Transform {
	constructor(ctrlNr) {
		super({objectMode:true, highWaterMark:5000});
		this.ctrlNr = ctrlNr;
	}

	_transform(partialMidiMsg, _enc, next) {
		this.push(Object.assign({}, partialMidiMsg, {ctrl:this.ctrlNr, msg:'ctrl'}));
		next();
	}
}

module.exports = Ctrl;