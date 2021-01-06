const { Transform } = require('stream');
const RingBuffer    = require('@giantleap/utils/RingBuffer');
const isArray       = require('@giantleap/utils/underdash/isArray');
const Msgr          = require('@giantleap/utils/Msgr');

/**
 * Note - Play a note when a pattern hit comes by
 *
 * m120()
 *   .pipe(new Pattern([
 *   'x.xx.x.x.x.xx.x.x.xx.x.x.x.xx.x.',
 *   'x.xx.x.x.x.xx.x.x.xx.x.x.x.xx.x.',
 *   'x.xx.x.x.x.xx.x.x.xx.x.x.x.xx.x.',
 *   'x.xx.x.x.x.xx.x.x.xx.x.x.x.xx.x.'
 *   ]))
 *   .pipe(new DiatonicMode([
 *   DiatonicMode.dorian('E3',  [1.0, 5.0, 2.1, 3.1, 7.1, 3.1, 5.0, 2.1, 3.1]),
 *   DiatonicMode.dorian('F#3', [1.0, 3.0, 2.1, 3.1, 4.1, 5.1, 3.1, 2.1, 3.1]),
 *   DiatonicMode.dorian('B3',  [1.0, 5.0, 1.1, 3.1, 4.1, 5.1, 3.1, 2.1, 3.1]),
 *   DiatonicMode.dorian('B3',  [1.0, 5.0, 1.1, 3.1, 4.1, 5.1, 3.1, 2.1, 3.1]),
 *   ]))
 *   .pipe(yamaha())
 */
class DiatonicMode extends Transform {
	constructor(notes, octaveOffset = 0) {
		super({objectMode:true});
		notes = notes.reduce((joined, notes) => joined.concat(notes), []);
		this.notes = RingBuffer( (isArray(notes) ? notes : [notes]).map(note => note.replace(/\d/, m => parseInt(m, 10) + octaveOffset)) );
	}

	_transform(partialMidiMsg, _enc, next) {
		const note = this.notes.next().value;
		this.push(Object.assign({}, partialMidiMsg, {key:note}));
		next();
	}
}

const diatonicMode = (modeName) => (key, indexes) => {
  // T = Tone
  // S = Semi tone
  const mode = {
    ionian:     'TTSTTTS',
    dorian:     'TSTTTST', // <- mooooi
    phrygian:   'STTTSTT',
    lydian:     'TTTSTTS',
    mixolydian: 'TTSTTST',
    aeolian:    'TSTTSTT',
    locrian:    'STTSTTT',
  }[modeName].split('').map(letter => {
    switch(letter) {
      case 'T':
        return 2;
      case 'S':
        return 1;
      default:
        throw new Error('No such tone ' + letter);
    }
  });
  if(!mode) throw new Error('Invalid mode name ' + modeName);

  const keyNr = Msgr.getNoteNumber(key);

  return indexes
    .map(float => parseInt(10 * float).toString())
    .map(intStr => {
      const scaleIndex = parseInt(intStr[0]);
      const octave = parseInt(intStr[1]);
      let noteNr = keyNr;
      for(let i=0; i < (scaleIndex - 1); i++) {
        noteNr += mode[i];
      }
      return noteNr + octave * 12;
    })
    .map(noteNr => Msgr.noteNrToStr(noteNr))

}

DiatonicMode.ionian     = diatonicMode('ionian');
DiatonicMode.dorian     = diatonicMode('dorian');
DiatonicMode.phrygian   = diatonicMode('phrygian');
DiatonicMode.lydian     = diatonicMode('lydian');
DiatonicMode.mixolydian = diatonicMode('mixolydian');
DiatonicMode.aeolian    = diatonicMode('aeolian');
DiatonicMode.locrian    = diatonicMode('locrian');

module.exports = DiatonicMode;

notes = [
  DiatonicMode.dorian('E3',  [1.0, 5.0, 2.1, 3.1, 7.1, 3.1, 5.0, 2.1, 3.1]),
  DiatonicMode.dorian('F#3', [1.0, 3.0, 2.1, 3.1, 4.1, 5.1, 3.1, 2.1, 3.1]),
  DiatonicMode.dorian('B3',  [1.0, 5.0, 1.1, 3.1, 4.1, 5.1, 3.1, 2.1, 3.1]),
  DiatonicMode.dorian('B3',  [1.0, 5.0, 1.1, 3.1, 4.1, 5.1, 3.1, 2.1, 3.1])
].reduce((joined, notes) => joined.concat(notes), []);