const { Transform } = require('stream');
const RingBuffer    = require('@giantleap/utils/RingBuffer');
const isArray       = require('@giantleap/utils/underdash/isArray');

/**
 * Note - Play a note when a pattern hit comes by
 *
 * m120()
 *    .pipe(new Pattern([
 *       'xxxxxxxx........',
 *       'x.x.x.x.x.x.x.x.'
 *    ]))
 *    .pipe(new Note([
 *       'C2','D2','E2','F2','G2','A2','B2','C3',
 *    ]))
 *    .pipe(arp())
 */
class Note extends Transform {
	constructor(notes, octaveOffset = 0) {
		super({objectMode:true});
		this.notes = RingBuffer( (isArray(notes) ? notes : [notes]).map(note => note.replace(/\d/, m => parseInt(m, 10) + octaveOffset)) );
	}

	_transform(partialMidiMsg, _enc, next) {
		const note = this.notes.next().value;
		this.push(Object.assign({}, partialMidiMsg, {key:note}));
		next();
	}
}

module.exports = Note;