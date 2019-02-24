const Metronome = require('@giantleap/Metronome'),
	Pattern     = require('@giantleap/Pattern'),

	Note        = require('@giantleap/Note'),
	Chord       = require('@giantleap/Chord'),
	Velocity    = require('@giantleap/Velocity'),

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

const mySin = (bpm, factor = 1) => ns => {
	const cycleInNs = (60n * 1000000000n) / BigInt(bpm);
	const nrOfCycles = BigInt(Math.floor(Number(ns / cycleInNs)));
	const tInNs = Number(ns - nrOfCycles * cycleInNs);
	const actual = 0.5 * Math.sin( (tInNs * factor * 2 * Math.PI / Number(cycleInNs)) ) + 0.5;
	return Math.round(actual * 100) / 100;
};

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

	m120()
		.pipe(new Pattern([
			'xxxx'
		]))
		.pipe(new Note(Electribe.S1))
		.pipe(electribe()),

	m120()
		.pipe(new Nrpn(Electribe.nrpn('S1', 'Pitch')))
		.pipe(new Value(mySin(bpm, 1/8)))
		.pipe(electribe()),

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