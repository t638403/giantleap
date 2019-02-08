const { Transform } = require('stream');

const Metronome = require('@giantleap/Metronome'),
	Pattern     = require('@giantleap/Pattern'),
	Velocity    = require('@giantleap/Velocity'),
	Note        = require('@giantleap/Note'),
	Value       = require('@giantleap/Value'),
	Nrpn        = require('@giantleap/Nrpn'),
	Chord       = require('@giantleap/Chord'),
	Ctrl        = require('@giantleap/Ctrl'),
	Clock       = require('@giantleap/Clock'),
	Device      = require('@giantleap/Device'),
	Instrument  = require('@giantleap/Instrument'),
	Electribe   = require('@giantleap/Electribe'),
	Pick        = require('@giantleap/Pick'),
	MidiOut     = require('@giantleap/MidiOut'),
	Stitch      = require('@giantleap/Stitch'),
	MidiMsgr    = require('@giantleap/MidiMsgr'),
	Json        = require('@giantleap/JSON'),
	RingBuffer  = require('@giantleap/utils/RingBuffer')
;

const ensoniq1   = () => new Instrument(/MIDIMATE II \d\d:0/, 1);
const ensoniq2   = () => new Instrument(/MIDIMATE II \d\d:0/, 2);
const ensoniq3   = () => new Instrument(/MIDIMATE II \d\d:0/, 3);

const evolver   = () => new Instrument(/MIDIMATE II \d\d:1/, 2);
const electribe = () => new Electribe (/MIDIMATE II \d\d:1/, 2);
const yamaha    = () => new Instrument(/MIDIMATE II \d\d:1/, 3);

const arp       = () => new Instrument(/ARPODYSSEY-FS \d\d:0/, 1);
const doepfer   = () => new Instrument(/USB Device 0x7cd:0xfe06 \d\d:0/, 1);

const sendMidiClock = (bpm) => Object
	.values(MidiOut.availablePorts())
	.map(port => (new Metronome(bpm, 24))
		.pipe(new Clock())
		.pipe(new Device(port))
	)
;

// CLOCK ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

const bpm = 120;
const clocks = sendMidiClock(bpm);
const m120 = () => new Metronome(bpm, 4);
const m120_n = (n) => new Metronome(bpm, n);


// SONG ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const streams = [

	...clocks,

	m120()
		.pipe(new Pattern('x..x..x...x..x......x..x..x.x...'))
		.pipe(new Note([
			Electribe.S1
		]))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern('xxxxxxxx'))
		.pipe(new Note([
			Electribe.HH_OPEN,
			Electribe.HH_CLOSE,
			Electribe.HH_OPEN,
			Electribe.HH_CLOSE,
			Electribe.HH_OPEN,
			Electribe.HH_CLOSE,
			Electribe.HH_OPEN,
			Electribe.HH_CLOSE,
		]))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern('..x..x.x..x..x.x..x..x.x..x..x..'))
		.pipe(new Note(Electribe.CLAP))
		.pipe(electribe()),

	m120()
		.pipe(new Pattern([
			'..x..x.x..x..x.x..x..x.x..x.x.x...x.'
		]))
		.pipe(new Note('C3'))
		.pipe(arp()),

	m120()
		.pipe(new Pattern([
			'....x.......x....x.......x..x.......x....x..x....x..x..x.x..x...'
		]))
		.pipe(new Velocity('1'))
		.pipe(new Note('C7'))
		.pipe(ensoniq1()),

	m120()
		.pipe(new Pattern([
			'..x.'
		]))
		.pipe(new Velocity('1'))
		.pipe(new Note('A#3'))
		.pipe(ensoniq1()),

	m120()
		.pipe(new Pattern([
			'x...'
		]))
		.pipe(new Velocity('9'))
		.pipe(new Note('C2'))
		.pipe(ensoniq2()),

	m120()
		.pipe(new Pattern([
			'........x..x..x=',
			'============....'
		]))
		.pipe(new Chord([
			// ['F2', 'G#2', 'A#2', 'C#3', 'E3']
			['E4', 'F#4', 'G#4', 'A4'],
			['E4', 'F#4', 'G#4', 'A4'],
			['G3', 'A#3', 'C4', 'D4'],
		], 1))
		.pipe(yamaha())
];

(new Stitch(streams))
	.pipe(new MidiMsgr())
	.pipe(new MidiOut())
;