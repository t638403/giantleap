const { Transform } = require('stream');

class Nrpn extends Transform {
	constructor(partialNrpn) {
		super({objectMode:true});
		this.partialNrpn = partialNrpn;
	}

	_transform(partialMidiMsg, _enc, next) {
		this.push(Object.assign({}, partialMidiMsg, this.partialNrpn, {msg:'nrpn'}));
		next();
	}
}

module.exports = Nrpn;