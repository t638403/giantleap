const { Transform } = require('stream');

class Nrpn extends Transform {
	constructor(partialNrpn) {
		super({objectMode:true, highWaterMark:5000});
		this.partialNrpn = partialNrpn;
	}

	_transform(partialMidiMsg, _enc, next) {
		const nrpn = Object.assign({}, partialMidiMsg, this.partialNrpn, {dm:partialMidiMsg.value});
		this.push(Object.assign({}, nrpn, {msg:'nrpn'}));
		next();
	}
}

module.exports = Nrpn;