const { Transform } = require('stream');
const RingBuffer    = require('@giantleap/utils/RingBuffer');
const isArray       = require('lodash/isArray');


class Chord extends Transform {
	constructor(chords, octaveOffset = 0) {
		super({objectMode:true});
		this.chords = RingBuffer(
			chords.map(chord => chord.map(note => note.replace(/\d/, m => parseInt(m, 10) + octaveOffset)))
		);
	}

	_transform(partialMidiMsg, _enc, next) {
		const chord = this.chords.next().value;
		for(const note of chord) {
			this.push(Object.assign({}, partialMidiMsg, {key:note}));
		}
		next();
	}
}

module.exports = Chord;