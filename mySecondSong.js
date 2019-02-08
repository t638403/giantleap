const Metronome  = require('@giantleap/Metronome');
const Pattern    = require('@giantleap/Pattern');
const Note       = require('@giantleap/Note');
const Instrument = require('@giantleap/Instrument');
const Stitch     = require('@giantleap/Stitch');
const MidiMsgr   = require('@giantleap/MidiMsgr');
const MidiOut    = require('@giantleap/MidiOut');

const metronome = new Metronome(120, 4);
const midiChannel = 1;
const deviceName = /synthv1 \d+:0/;
const synthv1 = new Instrument(deviceName, midiChannel);
const pattern = [
	'x=..x=..x=..x=..x=..x=..x=..x=..',
	'x=..x=..x===....x=..x=..x===....',
	'x=x=x=x=x=..x=..x=x=x=x=x=..x=..',
	'x=..x=..x===....x=..x=..x===....'
];
const notes = [
	'C3','D3','E3','C3',
	'C3','D3','E3','C3',
	'E3','F3','G3',
	'E3','F3','G3',
	'G3','A3','G3','F3','E3','C3',
	'G3','A3','G3','F3','E3','C3',
	'C3','G2','C3',
	'C3','G2','C3',
];

const streams = [

	(new Metronome(120, 4))
		.pipe(new Pattern(pattern))
		.pipe(new Note(notes)),

	(new Metronome(120, 4, 0, 2000000000n))
		.pipe(new Pattern(pattern))
		.pipe(new Note(notes, 1)),

	(new Metronome(120, 4, 0, 4000000000n))
		.pipe(new Pattern(pattern))
		.pipe(new Note(notes, 2))
];

(new Stitch(streams))
	.pipe(synthv1)
	.pipe(new MidiMsgr())
	.pipe(new MidiOut())
;
