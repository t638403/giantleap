const { Transform } = require('stream');
const RingBuffer    = require('@giantleap/utils/RingBuffer');
const isArray       = require('lodash/isArray');


class Note extends Transform {
	constructor(notes) {
		super({objectMode:true, highWaterMark:5000});
		this.notes = RingBuffer(isArray(notes) ? notes : [notes]);
	}

	_transform(partialMidiMsg, _enc, next) {
		const note = this.notes.next().value;
		this.push(Object.assign({}, partialMidiMsg, {key:note}));
		next();
	}
}

module.exports = Note;