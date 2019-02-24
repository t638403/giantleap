const Metronome = require('@giantleap/Metronome'),
	Pattern     = require('@giantleap/Pattern'),

	Note        = require('@giantleap/Note'),
	Chord       = require('@giantleap/Chord'),

	Ctrl        = require('@giantleap/Ctrl'),
	Nrpn        = require('@giantleap/Nrpn'),
	Value       = require('@giantleap/Value'),

	Clock       = require('@giantleap/Clock'),
	Device      = require('@giantleap/Device'),
	Instrument  = require('@giantleap/Instrument'),
	Electribe   = require('@giantleap/Electribe'),

	Stitch      = require('@giantleap/Stitch'),
	MidiMsgr    = require('@giantleap/MidiMsgr'),
	MidiOut     = require('@giantleap/MidiOut')
;

/**
 * Make up a reg exp for selecting the right midi device. Midi devices are listed when running this file.
 *
 * @returns {Instrument}
 */
const ensoniq1   = () => new Instrument(/MIDIMATE II \d\d:0/, 1);
const ensoniq2   = () => new Instrument(/MIDIMATE II \d\d:0/, 2);
const ensoniq3   = () => new Instrument(/MIDIMATE II \d\d:0/, 3);

const evolver   = () => new Instrument(/MIDIMATE II \d\d:1/, 2);
const electribe = () => new Electribe (/MIDIMATE II \d\d:1/, 2);
const yamaha    = () => new Instrument(/MIDIMATE II \d\d:1/, 3);

const arp       = () => new Instrument(/ARPODYSSEY-FS \d\d:0/, 1);
const doepfer   = () => new Instrument(/USB Device 0x7cd:0xfe06 \d\d:0/, 1);

/**
 * Get midi clocks for all connected devices
 *
 * @param bpm {number} The BPM, say 120
 * @returns {Readable[]}
 */
const getMidiClocks = (bpm) => Object
	.values(MidiOut.availablePorts())
	.map(port => (new Metronome(bpm, 24))
		.pipe(new Clock())
		.pipe(new Device(port))
	)
;

const randSelect = (l, values) => {
	const selection = [];
	for(let i = 0; i < l; i++) {
		selection.push(values[Math.floor(Math.random() * values.length)]);
	}
	console.log(`[${selection.map(v => `'${v}'`).join(',')}]`);
	return selection;
};

// CLOCK ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const bpm = 140;
const m120 = () => new Metronome(bpm, 4, 0.3);
const m80 = () => new Metronome(80, 4);
const m120_n = (n) => new Metronome(bpm, n);

// SONG ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const streams = [

	...getMidiClocks(bpm),

	m120()
		.pipe(new Pattern([
			'x.....x...x..x..',
		]))
		.pipe(new Note([
			Electribe.S3
		]))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern([
			'....x...',
		]))
		.pipe(new Note([
			Electribe.S2
		]))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern([
			'.......xx.....x.',
			'................',
			'.....xx......x..',
			'................',
			'.xx...x..xx.....',
			'................'
		]))
		.pipe(new Note([
			Electribe.CLAP
		]))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern([
			'..x.x...x.....x.x.x..x...x......',
			'...x..x.....x..x..x.....x..x....'
		]))
		.pipe(new Note('A#3'))
		.pipe(ensoniq1()),

	m120()
		.pipe(new Pattern([
			'x',
		]))
		.pipe(new Note([
			Electribe.HH_OPEN
		]))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern([
			'x',
		]))
		.pipe(new Nrpn(Electribe.nrpn('HH OPEN', 'Decay')))
		.pipe(new Value([
			 0, 0,10, 0, 0, 0, 0, 5,
			 0, 1, 1, 3, 3, 2, 3, 5,
			 0, 0,10, 0, 0, 0, 5, 5,
			 3, 1, 1, 2, 0,20, 0, 0,
		]))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern([
			'..xx',
		]))
		.pipe(new Note([
			Electribe.S1
		]))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern([
			'..x.',
		]))
		.pipe(new Note([
			Electribe.S4
		]))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern([
			'x===..x==.x=.x=.x=.x==x==.x==x=.',
		]))
		.pipe(new Note([
			'D#2','D#2','D#2','D#2',
			'G2','G2','F#2','F#2','F#2',
		], 2))
		.pipe(arp()),

	m120()
		.pipe(new Pattern([
			'x=xxxx.x.x.xx==.x.x=x.x=xx=xx.xx',
			'x.x=.x=x===x.x=x=x.xxxx.x.x.x=x='
		]))
		.pipe(new Note(['B4','F#1','F#4','D4','D#2','G#2','C1','G#1','G#1','D2','F#2','G1','C1','F1','C4','F#4','D3','F2','G2','B3','G#3','F#3','F2','G#3','D#2'], 3))
		.pipe(yamaha()),

];

/**
 * All streams get stitched together here into one single (transform) stream and then sent to the MidiMsgr which in turn
 * converts the message into a real midi message that can be sent using the npm module `midi`.
 *
 * Finally the MidiOut write stream measures the time and sends a MIDI message if the time is right.
 */
(new Stitch(streams))
	.pipe(new MidiMsgr())
	.pipe(new MidiOut())
;
