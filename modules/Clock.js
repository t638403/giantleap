const { Transform } = require('stream');

class Clock extends Transform {
	constructor() {
		super({objectMode:true});
		this.started = false;
	}

	_transform(partialMidiMsg, _enc, next) {
	  if(!this.started) {
      this.push(Object.assign({}, partialMidiMsg, {msg:'start'}));
	    this.started = true;
    }
    this.push(Object.assign({}, partialMidiMsg, {msg:'clock'}));
		next();
	}
}

module.exports = Clock;