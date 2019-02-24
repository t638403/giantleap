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
const ensoniq1   = () => new Instrument(/MIDIMATE II \d+:0/, 1);
const ensoniq2   = () => new Instrument(/MIDIMATE II \d+:0/, 2);
const ensoniq3   = () => new Instrument(/MIDIMATE II \d+:0/, 3);

const evolver   = () => new Instrument(/MIDIMATE II \d+:1/, 2);
const electribe = () => new Electribe (/MIDIMATE II \d+:1/, 2);
const yamaha    = () => new Instrument(/MIDIMATE II \d+:1/, 3);

const arp       = () => new Instrument(/ARPODYSSEY-FS \d+:0/, 1);
const doepfer   = () => new Instrument(/USB Device 0x7cd:0xfe06 \d+:0/, 1);
const smplv1   = () => new Instrument(/samplv1 \d+:0/, 1);

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
const bpm = 120;
const m120 = () => new Metronome(bpm, 4);
const m80 = () => new Metronome(80, 4);
const m120_n = (n) => new Metronome(bpm, n);

// SONG ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const streams = [

	...getMidiClocks(bpm),

	// m120()
	// 	.pipe(new Pattern([
	// 		'x'
	// 	]))
	// 	.pipe(new Note([
	// 		'A#3'
	// 	]))
	// 	.pipe(new Value('97652345'))
	// 	.pipe(ensoniq1()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'x.......'
	// 	]))
	// 	.pipe(new Note([
	// 		'C2'
	// 	]))
	// 	.pipe(new Value('9'))
	// 	.pipe(ensoniq1()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'....x...'
	// 	]))
	// 	.pipe(new Note([
	// 		'F#2'
	// 	]))
	// 	.pipe(ensoniq1()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x...'
	// 	]))
	// 	.pipe(new Note([
	// 		'F3'
	// 	]))
	// 	.pipe(ensoniq1()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'...x..x.'
	// 	]))
	// 	.pipe(new Note([
	// 		'F#6'
	// 	]))
	// 	.pipe(ensoniq1()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'....x...'
	// 	]))
	// 	.pipe(new Note([
	// 		'C3'
	// 	]))
	// 	.pipe(new Value('0'))
	// 	.pipe(ensoniq1()),

	m120()
		.pipe(new Pattern([
			'x...'
		]))
		.pipe(new Note('C2'))
		.pipe(new Value('9'))
		.pipe(smplv1()),

	m120()
		.pipe(new Pattern([
			'x'
		]))
		.pipe(new Note(Electribe.HH_CLOSE))
		.pipe(new Value('237823029023610'))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern([
			'x....'
		]))
		.pipe(new Note(Electribe.S3))
		.pipe(new Value('9'))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern([
			'..x....'
		]))
		.pipe(new Note(Electribe.S4))
		.pipe(new Value('9'))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern([
			'xx.xx.xx.xxxxx.x.x.xxx.xx.xx..xx'
		]))
		.pipe(new Note(Electribe.S1))
		.pipe(new Value('237823029023610'))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern([
			'....x.x.x..xx.x.',
			'.x.xx.x.....x.xx',
			'...xx.x.x..xx.x.',
			'...x..x.x..x..x.',
		]))
		.pipe(new Note('C4'))
		// .pipe(new Value('585848482048593840'))
		.pipe(doepfer()),

	// m120()
	// 	.pipe(new Pattern([
	// 		'xxxxx.xx.x.xxx.x.x.x.xxxxx.xx.xx']))
	// 	.pipe(new Note(randSelect(16, ['G#3','C4','C3','G#3','C#4','C3','C4','C4']), 2))
	// 	// .pipe(new Value('585848482048593840'))
	// 	.pipe(yamaha()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x===============',
	// 		'================',
	// 		'x===============',
	// 		'================'
	// 	]))
	// 	.pipe(new Note(['G#3','G#3','C4','C4','C3','C3','G#3','G#3','C#4','C#4','C3','C3','C4','C4','C4','C4']))
	// 	// .pipe(new Value('585848482048593840'))
	// 	.pipe(arp()),
	//
	// m120()
	// 	.pipe(new Pattern('x....x..x..x.x.......x..x..x.x.x'))
	// 	.pipe(new Note([
	// 		Electribe.S1
	// 	]))
	// 	// .pipe(new Value('585848482048593840'))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern('x..x..x.'))
	// 	.pipe(new Note([
	// 		Electribe.HH_CLOSE
	// 	]))
	// 	// .pipe(new Value('585848482048593840'))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x',
	// 	]))
	// 	.pipe(new Nrpn(Electribe.nrpn('S1', 'Pitch')))
	// 	.pipe(new Value('23567239'))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'..x.....x.xxx.xx',
	// 	]))
	// 	.pipe(new Nrpn(Electribe.nrpn('S1', 'Mod Depth')))
	// 	.pipe(new Value('56675657564'))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x',
	// 	]))
	// 	.pipe(new Nrpn(Electribe.nrpn('S1', 'Decay')))
	// 	.pipe(new Value('23215421421'))
	// 	.pipe(electribe()),
	//
	// m120()
	// 	.pipe(new Pattern([
	// 		'x',
	// 	]))
	// 	.pipe(new Nrpn(Electribe.nrpn('*', 'Delay Depth')))
	// 	.pipe(new Value('040990000009909909'))
	// 	.pipe(electribe())
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
