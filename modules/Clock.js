const { Transform } = require('stream');
const RingBuffer    = require('@giantleap/utils/RingBuffer');
const isArray       = require('lodash/isArray');


class Clock extends Transform {
	constructor() {
		super({objectMode:true});
	}

	_transform(partialMidiMsg, _enc, next) {
		this.push(Object.assign({}, partialMidiMsg, {msg:'clock'}));
		next();
	}
}

module.exports = Clock;